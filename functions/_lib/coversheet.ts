// Cover sheet: a one-page skim of public background on a company that just
// applied (who they are, founders, footprint, flags, fit against Souq's
// criteria). Saved as a Google Doc in the client's folder and linked on the
// Asana card. Separate from underwriting, which runs later on documents.
//
// The team can override the default below by adding a "souq-cover-sheet"
// skill folder to "_Souq skills" in Drive.

import { marked } from "marked";
import { saveDoc } from "./services.js";
import { loadSkill } from "./underwrite.js";
import { CRITERIA } from "../../artifacts/souq-capital/src/data/offerings.js";

const DEFAULT_COVER_SKILL = `You write a one-page cover sheet for a company that just applied to Souq, an Islamic-aligned
working capital and operating partner for consumer brands. The team reads it in under a minute before any call.
It is background, not a credit decision.

Use the application for what they told us and web search for what's public. Mark application facts "(per app)".
If you can't find something, write "Not found". Never guess or invent people, numbers, or links.

Keep the whole thing under 250 words. Short fragments, no paragraphs, no marketing language. Use exactly this
structure, in Markdown:

SUMMARY: one sentence on who they are and what stands out. No dollar amounts.

# <Company>

| | |
|---|---|
| Website | |
| Based in | |
| Founded | |
| Sells | |
| Channels | |
| Applied for | |
| Revenue | (per app) |

**Founders:** one line per person: name, role, one-line background, link.

**Public footprint:** one line: biggest social channel and followers, Amazon rating if any, notable retail or press.

**Flags:** only real concerns from the public record (lawsuits, complaints, recalls, trademark conflicts, mismatches
with the application). If none, write "None found."

**Fit:** one line per Souq criterion given below: criterion, Met / Not met / Unknown.

**Sources:** up to five links.`;

const CRITERIA_FOR: Record<string, (keyof typeof CRITERIA)[]> = {
  funding: ["capital"],
  accelerator: ["accelerator", "operating-partnership"],
};

function criteriaText(path: string, answers: Record<string, string | string[]>): string {
  const ids = new Set(CRITERIA_FOR[path] || []);
  if (answers.alsoFunding === "Yes") ids.add("capital");
  if (answers.alsoAccelerator === "Yes") ids.add("accelerator");
  if (!ids.size) return "They did not apply for Capital or the Accelerator. Write \"Fit: not applicable\" and nothing else for that line.";
  return [...ids].map((id) => {
    const t = CRITERIA[id];
    return `${t.name}: ${t.threshold} ${t.thresholdLabel}; ` + t.criteria.map((c) => `${c.label}: ${c.value}`).join("; ");
  }).join("\n");
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type ClaudeContent = { type: string; text?: string; [k: string]: unknown };

/** One Claude turn with web search, following "pause_turn" until it finishes. */
async function claudeWithSearch(system: string, prompt: string, timeoutMs: number): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set");
  const deadline = Date.now() + timeoutMs;
  const messages: { role: "user" | "assistant"; content: unknown }[] = [{ role: "user", content: prompt }];
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
        max_tokens: 4000,
        system,
        messages,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }],
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

/**
 * Builds the cover sheet for a new application, saves it as a Google Doc in
 * the client's folder, and returns the link plus a one-line summary with no
 * figures, for the Asana card.
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

  const out = await claudeWithSearch(skill, prompt, 240_000);
  const summary = out.match(/^\s*SUMMARY:\s*(.+)$/im)?.[1]?.trim() || "";
  const body = out.replace(/^\s*SUMMARY:.*$/im, "").trim();
  const html = marked.parse(body, { gfm: true, async: false }) as string;
  const made = new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" });
  const doc = `<!doctype html><html><head><meta charset="utf-8"><style>
body { font-family: Arial, sans-serif; font-size: 10.5pt; line-height: 1.35; }
h1 { font-size: 16pt; margin-bottom: 4pt; }
table { border-collapse: collapse; margin: 6pt 0 10pt; } td, th { border: 1px solid #cccccc; padding: 3pt 6pt; vertical-align: top; }
p { margin: 4pt 0; }
</style></head><body>
<p style="color:#888888;font-size:8.5pt">Cover sheet · ${esc(made)} ET · Claude, from the application and public sources</p>
${summary ? `<p style="font-size:11.5pt"><b>${esc(summary)}</b></p>` : ""}
${html}
</body></html>`;
  const link = await saveDoc(`Cover sheet: ${opts.company}`, doc, opts.folderId, "text/html");
  return { link, summary };
}
