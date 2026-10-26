// Runs Souq's Claude skills against a client's application and documents.
//
// The skills live in the shared drive, in a folder called "_Souq skills", so
// the team can update them without touching code. Each skill is a folder
// (e.g. "souq-underwriting") holding SKILL.md plus its references/assets.
// Nothing about a client leaves Drive except to Claude, and the full memo is
// saved back into the client's folder (financials stay out of Asana).

import ExcelJS from "exceljs";
import mammoth from "mammoth";
import { marked } from "marked";
import { listFolder, findFolder, downloadFile, saveDoc, comment, type DriveFile } from "./services.js";
import { CRITERIA } from "../../artifacts/souq-capital/src/data/offerings.js";

const SKILLS_ROOT = "_Souq skills";
const FOLDER = "application/vnd.google-apps.folder";

// ---------------------------------------------------------------- Skills

const skillCache = new Map<string, { text: string; at: number }>();

/** SKILL.md first, then every other file in the skill folder, labeled by path. */
export async function loadSkill(name: string): Promise<string | null> {
  const hit = skillCache.get(name);
  if (hit && Date.now() - hit.at < 10 * 60 * 1000) return hit.text;

  const root = await findFolder(SKILLS_ROOT);
  if (!root) return null;
  const skillFolder = await findChildFolder(root, name, 4);
  if (!skillFolder) return null;

  const files: { path: string; text: string }[] = [];
  const walk = async (id: string, prefix: string, depth: number) => {
    for (const f of await listFolder(id)) {
      if (f.mimeType === FOLDER) { if (depth < 4) await walk(f.id, `${prefix}${f.name}/`, depth + 1); continue; }
      if (f.name.startsWith(".")) continue;
      files.push({ path: prefix + f.name, text: (await downloadFile(f)).toString("utf8") });
    }
  };
  await walk(skillFolder, "", 0);

  const main = files.find((f) => /^skill\.md$/i.test(f.path));
  if (!main) return null;
  const rest = files.filter((f) => f !== main).map((f) => `\n\n---\n# Bundled file: ${f.path}\n\n${f.text}`);
  const text = main.text + rest.join("");
  skillCache.set(name, { text, at: Date.now() });
  return text;
}

async function findChildFolder(parent: string, name: string, depth: number): Promise<string | null> {
  const kids = (await listFolder(parent)).filter((f) => f.mimeType === FOLDER);
  const direct = kids.find((f) => f.name === name);
  if (direct) return direct.id;
  if (depth <= 0) return null;
  for (const k of kids) {
    const found = await findChildFolder(k.id, name, depth - 1);
    if (found) return found;
  }
  return null;
}

// ---------------------------------------------------------------- Documents -> Claude

type Block =
  | { type: "text"; text: string }
  | { type: "document"; source: { type: "base64"; media_type: "application/pdf"; data: string }; title: string }
  | { type: "image"; source: { type: "base64"; media_type: string; data: string } };

const MAX_BINARY = 22 * 1024 * 1024; // base64 PDFs + images, under Claude's 32 MB request cap
const MAX_TEXT = 500_000;            // characters of extracted text
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

/** Turns a folder's files into Claude content blocks, within size limits. */
async function filesToBlocks(files: DriveFile[], label: string) {
  const blocks: Block[] = [];
  const skipped: string[] = [];
  let binary = 0;
  let text = 0;

  for (const f of files) {
    if (f.mimeType === FOLDER || f.name.startsWith(".")) continue;
    const name = `${label}${f.name}`;
    try {
      const isPdf = f.mimeType === "application/pdf" || /\.pdf$/i.test(f.name);
      const isImage = IMAGE_TYPES.includes(f.mimeType);
      if (isPdf || isImage) {
        const size = Number(f.size || 0) * 1.34;
        if (binary + size > MAX_BINARY) { skipped.push(`${name} (too large to include in this pass)`); continue; }
        const data = (await downloadFile(f)).toString("base64");
        binary += data.length;
        blocks.push(isPdf
          ? { type: "document", source: { type: "base64", media_type: "application/pdf", data }, title: name }
          : { type: "image", source: { type: "base64", media_type: f.mimeType, data } });
        if (isImage) blocks.push({ type: "text", text: `(The image above is: ${name})` });
        continue;
      }

      let body: string | null = null;
      if (/sheet|excel/.test(f.mimeType) && /\.xlsx$/i.test(f.name)) body = await xlsxToText(await downloadFile(f));
      else if (/wordprocessingml/.test(f.mimeType) || /\.docx$/i.test(f.name)) body = (await mammoth.extractRawText({ buffer: await downloadFile(f) })).value;
      else if (f.mimeType.startsWith("text/") || /json|csv|google-apps\.(document|spreadsheet)/.test(f.mimeType) || /\.(csv|txt|md)$/i.test(f.name)) {
        body = (await downloadFile(f)).toString("utf8");
      }
      if (body === null) { skipped.push(`${name} (file type ${f.mimeType} can't be read automatically)`); continue; }
      if (text + body.length > MAX_TEXT) { skipped.push(`${name} (too large to include in this pass)`); continue; }
      text += body.length;
      blocks.push({ type: "text", text: `=== File: ${name} ===\n${body}` });
    } catch (e) {
      console.error("could not read", f.name, e);
      skipped.push(`${name} (could not be opened)`);
    }
  }
  return { blocks, skipped };
}

async function xlsxToText(buf: Buffer): Promise<string> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf as unknown as ArrayBuffer);
  const out: string[] = [];
  wb.eachSheet((ws) => {
    out.push(`--- Sheet: ${ws.name} ---`);
    ws.eachRow({ includeEmpty: false }, (row) => {
      const cells = (row.values as unknown[]).slice(1).map((v) => {
        if (v && typeof v === "object") {
          const o = v as { result?: unknown; text?: unknown; richText?: { text: string }[] };
          if (o.result !== undefined) return String(o.result);
          if (o.richText) return o.richText.map((r) => r.text).join("");
          if (o.text !== undefined) return String(o.text);
          if (v instanceof Date) return v.toISOString().slice(0, 10);
        }
        return v === undefined || v === null ? "" : String(v);
      });
      out.push(cells.join(","));
    });
  });
  return out.join("\n");
}

// ---------------------------------------------------------------- Claude

type ClaudeContent = { type: string; text?: string; [k: string]: unknown };

/** One Claude turn with web search, following "pause_turn" until it finishes. */
export async function claudeWithSearch(system: string, content: Block[], timeoutMs: number): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set");
  const deadline = Date.now() + timeoutMs;
  const messages: { role: "user" | "assistant"; content: unknown }[] = [{ role: "user", content }];
  let text = "";

  for (let round = 0; round < 5; round++) {
    const left = deadline - Date.now();
    if (left < 5000) throw new Error("timed out");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: AbortSignal.timeout(left),
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: process.env.UNDERWRITING_MODEL || "claude-opus-5-5",
        max_tokens: 16000,
        system,
        messages,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 10 }],
      }),
    });
    if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);
    const j = (await res.json()) as { content: ClaudeContent[]; stop_reason: string };
    text += j.content.filter((c) => c.type === "text").map((c) => c.text).join("");
    if (j.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: j.content });
  }
  return text.trim();
}

// ---------------------------------------------------------------- Underwriting

/**
 * Reads everything in the client's folder (application, founder's details,
 * uploaded documents), runs the underwriting skill, saves the memo as a
 * Google Doc in the client's folder, and comments on the Asana card with the
 * verdict and a link. Financial figures stay in the Doc, not in Asana.
 */
export async function runUnderwriting(opts: { taskGid: string; clientFolder: string; docsFolder: string; company: string }) {
  const skill = await loadSkill("souq-underwriting");
  if (!skill) {
    await comment(opts.taskGid, `Underwriting draft didn't run: the "souq-underwriting" skill isn't in the "${SKILLS_ROOT}" folder in Souq Clients.`);
    return;
  }

  const top = (await listFolder(opts.clientFolder)).filter((f) => f.mimeType !== FOLDER && !/^Claude underwriting draft/.test(f.name));
  const docs = await listFolder(opts.docsFolder);
  const a = await filesToBlocks(top, "");
  const b = await filesToBlocks(docs, "Documents/");
  const skipped = [...a.skipped, ...b.skipped];

  const today = new Date().toLocaleDateString("en-US", { timeZone: "America/New_York", dateStyle: "long" });
  const intro: Block = {
    type: "text",
    text:
      `Today is ${today}. Underwrite ${opts.company} for Souq using the skill. Below are the founder's website application, ` +
      `their written answers, and every document they uploaded. Run the public-record checks you can with web search, ` +
      `and be explicit about anything you could not verify.` +
      (skipped.length ? `\n\nThese files were uploaded but are NOT included below (treat them as not reviewed):\n${skipped.map((s) => `- ${s}`).join("\n")}` : "") +
      `\n\nStart your reply with exactly these two lines, then the full report:\n` +
      `VERDICT: Go | No-Go | Conditional\n` +
      `HEADLINE: one sentence on the main reason, with no dollar amounts or financial figures.`,
  };

  const started = new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" });
  let memo: string;
  try {
    memo = await claudeWithSearch(skill, [intro, ...a.blocks, ...b.blocks], 270_000);
  } catch (e) {
    console.error("underwriting failed", e);
    await comment(opts.taskGid, `Underwriting draft didn't finish (${e instanceof Error ? e.message.slice(0, 200) : "error"}). Run the souq-underwriting skill in Claude on the client folder instead.`);
    return;
  }

  const verdict = memo.match(/^\s*VERDICT:\s*(.+)$/im)?.[1]?.trim() || "see memo";
  const headline = memo.match(/^\s*HEADLINE:\s*(.+)$/im)?.[1]?.trim() || "";
  const link = await saveDoc(
    `Claude underwriting draft (${started})`,
    memoToHtml(memo, { company: opts.company, verdict, headline, started }),
    opts.clientFolder,
    "text/html",
  );
  await comment(
    opts.taskGid,
    `Underwriting draft (Claude, souq-underwriting skill). A first pass for the team, not a decision.\n\n` +
      `VERDICT: ${verdict}\n${headline}\n\nFull memo with figures (need-to-know): ${link}` +
      (skipped.length ? `\n\nNot reviewed automatically: ${skipped.join("; ")}` : ""),
  );
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Claude writes Markdown; Google Docs needs HTML to show real headings, bold, and tables. */
function memoToHtml(memo: string, m: { company: string; verdict: string; headline: string; started: string }): string {
  // The VERDICT/HEADLINE lines (and a divider after them) become the header block instead.
  const body = memo
    .replace(/^\s*VERDICT:.*$/im, "")
    .replace(/^\s*HEADLINE:.*$/im, "")
    .replace(/^\s*(---|\*\*\*)\s*$/m, "")
    .trim();
  const html = marked.parse(body, { gfm: true, async: false }) as string;
  const color = /no-go/i.test(m.verdict) ? "#b3261e" : /^\W*go\b/i.test(m.verdict) ? "#1e7b34" : "#9a6700";
  return `<!doctype html><html><head><meta charset="utf-8"><style>
body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; }
h1 { font-size: 18pt; } h2 { font-size: 14pt; margin-top: 18pt; } h3 { font-size: 12pt; }
table { border-collapse: collapse; } td, th { border: 1px solid #bbbbbb; padding: 4pt 6pt; vertical-align: top; }
th { background: #f1f1f1; }
</style></head><body>
<p style="color:#666666;font-size:9pt">Claude underwriting draft for ${esc(m.company)} · ${esc(m.started)} ET · A first pass for the team, not a decision. Need-to-know.</p>
<p style="font-size:16pt;font-weight:bold;color:${color}">Verdict: ${esc(m.verdict)}</p>
${m.headline ? `<p style="font-size:12pt">${esc(m.headline)}</p>` : ""}
<hr/>
${html}
</body></html>`;
}

// ---------------------------------------------------------------- Cover sheet

/**
 * Used when there's no "souq-cover-sheet" skill in the Drive folder yet.
 * Once the team drops one in, theirs wins and this is ignored.
 */
const DEFAULT_COVER_SKILL = `You write the cover sheet for a company that just applied to Souq, an Islamic-aligned
working capital and operating partner for consumer brands. The cover sheet is the first thing the team reads
before any call: who the company is, who runs it, and what the public record shows. It is background, not a
credit decision.

Use the founder's application for what they told us, and web search for everything public. Keep the two apart:
anything from the application is "per the application"; anything from the web gets a source link. If you
could not find or confirm something, say "Not found" rather than guessing. Never invent people, numbers, or links.

What to look up:
- The company: website, what it sells, price point, where it sells (own site, Amazon, retail, wholesale), when it
  started, where it's based, any press or awards.
- The founders and leadership: name, role, background (prior companies, roles, education) from LinkedIn,
  interviews, podcasts, press. Note anything that suggests they are or are not full time on the business.
- Public footprint: Instagram, TikTok, LinkedIn and other socials with rough follower counts, Amazon or marketplace
  ratings and review counts, notable retail doors.
- Public record: state business registration if findable, USPTO trademarks for the brand name, lawsuits, regulator
  actions, BBB complaints, recalls, or negative press. Say plainly when nothing turned up.
- Fit against Souq's criteria for the path they applied to (given below): for each criterion say Met, Not met, or
  Unknown, with what you based it on.

Write in plain, short sentences. No marketing language. Use this structure, in Markdown:

SUMMARY: one or two sentences on who they are and what stands out. No dollar amounts or financial figures.

# Cover sheet: <Company>

## At a glance
A two-column table: Company, Website, Based in, Founded, What they sell, Channels, Applied for, Revenue
(per the application), Team size (if known).

## The business
Three to five sentences.

## Founders and leadership
One short paragraph per person, with sources.

## Public footprint
Bullets: website, each social channel with follower counts, marketplaces and ratings, retail, press.

## Public record
Bullets: registration, trademarks, legal or regulatory issues, complaints, negative press.

## Fit against Souq's criteria
A table: Criterion, What we know, Met / Not met / Unknown.

## Worth asking on the first call
Three to five specific questions the public record raised or couldn't answer.

## Sources
Every link you used, one per line.`;

const CRITERIA_FOR: Record<string, (keyof typeof CRITERIA)[]> = {
  funding: ["capital"],
  accelerator: ["accelerator", "operating-partnership"],
};

function criteriaText(path: string, answers: Record<string, string | string[]>): string {
  const ids = new Set(CRITERIA_FOR[path] || []);
  if (answers.alsoFunding === "Yes") ids.add("capital");
  if (answers.alsoAccelerator === "Yes") ids.add("accelerator");
  if (!ids.size) return "They did not apply for Capital or the Accelerator, so there are no tier criteria to check. Skip that section and say so in one line.";
  return [...ids].map((id) => {
    const t = CRITERIA[id];
    return `${t.name}: ${t.threshold} ${t.thresholdLabel}; ` + t.criteria.map((c) => `${c.label}: ${c.value}`).join("; ");
  }).join("\n");
}

/**
 * Builds the cover sheet (public background) for a new application, saves it
 * as a Google Doc in the client's folder, and returns the link plus a short
 * summary with no figures, for the Asana card.
 */
export async function runCoverSheet(opts: {
  company: string; folderId: string; path: string; applicationText: string; answers: Record<string, string | string[]>;
}): Promise<{ link: string; summary: string }> {
  const skill = (await loadSkill("souq-cover-sheet").catch(() => null)) || DEFAULT_COVER_SKILL;
  const today = new Date().toLocaleDateString("en-US", { timeZone: "America/New_York", dateStyle: "long" });
  const prompt =
    `Today is ${today}. Write the cover sheet for ${opts.company}.\n\n` +
    `Souq's criteria for what they applied to:\n${criteriaText(opts.path, opts.answers)}\n\n` +
    `Their application, in their own words:\n\n${opts.applicationText}`;

  const out = await claudeWithSearch(skill, [{ type: "text", text: prompt }], 240_000);
  const summary = out.match(/^\s*SUMMARY:\s*(.+)$/im)?.[1]?.trim() || "";
  const body = out.replace(/^\s*SUMMARY:.*$/im, "").trim();
  const html = marked.parse(body, { gfm: true, async: false }) as string;
  const made = new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" });
  const doc = `<!doctype html><html><head><meta charset="utf-8"><style>
body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; }
h1 { font-size: 18pt; } h2 { font-size: 14pt; margin-top: 18pt; } h3 { font-size: 12pt; }
table { border-collapse: collapse; } td, th { border: 1px solid #bbbbbb; padding: 4pt 6pt; vertical-align: top; }
th { background: #f1f1f1; }
</style></head><body>
<p style="color:#666666;font-size:9pt">Cover sheet for ${esc(opts.company)} · ${esc(made)} ET · Drafted by Claude from the application and public sources. Check anything marked unverified.</p>
${summary ? `<p style="font-size:12pt">${esc(summary)}</p><hr/>` : ""}
${html}
</body></html>`;
  const link = await saveDoc(`Cover sheet: ${opts.company}`, doc, opts.folderId, "text/html");
  return { link, summary };
}
