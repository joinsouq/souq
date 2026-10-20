// /api/documents: the private document page a founder gets after the intro call.
//   Opening the page takes the private link plus a one-time code emailed to the
//   founder (see _lib/access.ts). The browser then sends "x-doc-session".
//   GET  ?ref&t           -> without a session: where the code will go
//                            with a session: company, uploads so far, and progress
//   POST {action:"sendCode"}   -> emails the founder a code
//   POST {action:"verifyCode"} -> checks it and returns a session token
//   POST {action:"upload"} -> a one-time Drive upload URL for one file
//   POST {action:"finish"} -> saves their written answers, notes what's in and
//                              what's missing on the Asana card, moves the card,
//                              then runs the Claude underwriting draft

import { DOC_SLOTS, DOC_QUESTIONS, DOC_SECTIONS, MAX_FILE_MB, validate, toText, type IntakeForm, type Answers } from "../artifacts/souq-capital/src/intake/forms.js";
import {
  parseRef, verify, getTask, siteOrigin, ensureFolder, startUpload, listFiles, saveDoc, comment, moveTo, setWaitingOn, folderUrl, SECTIONS,
} from "./_lib/services.js";
import { runUnderwriting } from "./_lib/underwrite.js";
import { documentsReceived, accessCode, sendEmail } from "./_lib/email.js";
import { newCode, checkCode, newSession, checkSession, codesEnabled, maskEmail, progressFor } from "./_lib/access.js";
import { waitUntil } from "@vercel/functions";

type Req = { method?: string; body?: unknown; query?: Record<string, string>; headers: Record<string, string | string[] | undefined> };
type Res = { status: (n: number) => Res; json: (b: unknown) => void };

// The written questions, wrapped as a one-section form so we can reuse validate/toText.
const QUESTIONS_FORM: IntakeForm = {
  id: "funding", choice: "", choiceDetail: "", title: "Documents and details", intro: "", minutes: 0,
  submitLabel: "", doneTitle: "", doneBody: "", sections: DOC_SECTIONS,
};

const slotOf = (fileName: string) => DOC_SLOTS.find((s) => fileName.startsWith(`${s.label} - `));

/** Founder name and email from the card ("Contact: Name, role · email · phone"). */
function founderContact(notes: unknown): { name: string; email: string } | null {
  const m = String(notes || "").match(/Contact:\s*([^,·\n]+)[^·\n]*·\s*([^\s·]+@[^\s·]+)/);
  return m ? { name: m[1].trim(), email: m[2] } : null;
}

type Task = { name?: string; notes?: string; memberships?: { section?: { gid: string }; project?: { gid: string } }[] };
const sectionOf = (task: Task) =>
  task.memberships?.find((m) => m.project?.gid === process.env.ASANA_PROJECT_ID)?.section?.gid || task.memberships?.[0]?.section?.gid;

export default async function handler(req: Req, res: Res) {
  const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body || {}) as Record<string, unknown>;
  const ref = String((req.method === "GET" ? req.query?.ref : body.ref) || "");
  const t = String((req.method === "GET" ? req.query?.t : body.t) || "");
  const parsed = parseRef(ref);
  if (!parsed || !verify(ref, t)) return res.status(403).json({ error: "This link isn't valid. Ask the Souq team for a new one." });

  try {
    // ---- Step 1: the one-time code -------------------------------------
    const session = String(req.headers["x-doc-session"] || "");
    const signedIn = !codesEnabled() || checkSession(ref, session);

    if (!signedIn) {
      const task = (await getTask(parsed.task)) as Task;
      const contact = founderContact(task.notes);
      if (!contact) return res.status(403).json({ error: "We couldn't find an email for this link. Reply to the Souq team's email and we'll sort it out." });

      if (req.method === "GET") return res.status(200).json({ needsCode: true, emailHint: maskEmail(contact.email) });
      if (body.action === "sendCode") {
        await sendEmail(accessCode({ to: contact.email, name: contact.name, code: newCode(ref) }));
        return res.status(200).json({ ok: true, emailHint: maskEmail(contact.email) });
      }
      if (body.action === "verifyCode") {
        const result = checkCode(ref, String(body.code || ""));
        if (result === "locked") return res.status(429).json({ error: "Too many tries. Wait 15 minutes, then request a new code." });
        if (result === "wrong") return res.status(400).json({ error: "That code didn't match, or it expired. Check the latest email, or send a new code." });
        return res.status(200).json({ session: newSession(ref) });
      }
      return res.status(401).json({ error: "Your session ended. Reload the page to get a new code." });
    }

    // ---- Step 2: the page itself ---------------------------------------
    const docsFolder = await ensureFolder("Documents", parsed.folder);

    if (req.method === "GET") {
      const task = (await getTask(parsed.task)) as Task;
      const files = await listFiles(docsFolder);
      const bySlot: Record<string, string[]> = {};
      for (const f of files) {
        const s = slotOf(f.name);
        if (s) (bySlot[s.id] ||= []).push(f.name.slice(s.label.length + 3));
      }
      const required = DOC_SLOTS.filter((s) => s.required);
      const progress = progressFor(sectionOf(task), { have: required.filter((s) => bySlot[s.id]?.length).length, need: required.length });
      // Card names look like "Company (Founder)"; show just the company.
      return res.status(200).json({ company: String(task.name).replace(/\s*\([^()]*\)\s*$/, ""), uploaded: bySlot, progress });
    }

    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    if (body.action === "upload") {
      const slot = DOC_SLOTS.find((s) => s.id === body.slot);
      const size = Number(body.size);
      if (!slot) return res.status(400).json({ error: "Unknown document type." });
      if (!(size > 0) || size > MAX_FILE_MB * 1024 * 1024) return res.status(400).json({ error: `Files must be under ${MAX_FILE_MB} MB.` });
      const name = `${slot.label} - ${String(body.name || "file").replace(/[/\\]/g, "-").slice(0, 150)}`;
      const origin = String(req.headers.origin || "");
      const uploadUrl = await startUpload({ folderId: docsFolder, name, mimeType: String(body.type || ""), size, origin });
      return res.status(200).json({ uploadUrl });
    }

    if (body.action === "finish") {
      const answers: Answers = {};
      for (const f of DOC_QUESTIONS) answers[f.id] = String((body.answers as Record<string, unknown>)?.[f.id] ?? "").slice(0, 4000).trim();
      const errors = validate(QUESTIONS_FORM, answers);
      if (Object.keys(errors).length) return res.status(400).json({ errors });

      const files = await listFiles(docsFolder);
      const got = new Set(files.map((f) => slotOf(f.name)?.id).filter(Boolean));
      const missing = DOC_SLOTS.filter((s) => s.required && !got.has(s.id));
      const submitted = new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" });

      await saveDoc(`Details from founder (${submitted})`, toText(QUESTIONS_FORM, answers), parsed.folder);

      const received = DOC_SLOTS.filter((s) => got.has(s.id)).map((s) => `• ${s.label}`).join("\n") || "• (none)";
      const missingText = missing.map((s) => `• ${s.label}`).join("\n");
      await comment(
        parsed.task,
        `Founder uploaded documents (${submitted} ET). ${files.length} file(s), in the private folder: ${folderUrl(parsed.folder)}\n\nReceived:\n${received}` +
          (missing.length ? `\n\nStill missing (required):\n${missingText}` : "\n\nAll required documents are in. Ready for the full underwrite."),
      );
      await moveTo(parsed.task, SECTIONS.diligence);
      await setWaitingOn(parsed.task, missing.length ? "Founder" : "Souq").catch((e) => console.error("waiting-on update failed", e));

      // Claude's underwriting draft runs after the founder sees "done" (takes a few minutes).
      const task = (await getTask(parsed.task).catch(() => ({ name: "", notes: "" }))) as Task;
      const company = String(task.name || "").replace(/\s*\([^()]*\)\s*$/, "");

      // Email the founder a receipt.
      const contact = founderContact(task.notes);
      if (contact) {
        await sendEmail(documentsReceived({
          to: contact.email, name: contact.name, company,
          missing: missing.map((m) => m.label),
          link: `${siteOrigin(req)}/apply/documents?ref=${encodeURIComponent(ref)}&t=${encodeURIComponent(t)}`,
        })).catch((e) => console.error("documents email failed", e));
      }
      waitUntil(
        runUnderwriting({
          taskGid: parsed.task,
          clientFolder: parsed.folder,
          docsFolder,
          company: company || "this company",
        }).catch((e) => console.error("underwriting error", e)),
      );
      return res.status(200).json({ ok: true, missing: missing.map((m) => m.label) });
    }

    return res.status(400).json({ error: "Unknown action." });
  } catch (e) {
    console.error("documents error", e);
    return res.status(500).json({ error: "Something went wrong on our side. Please try again." });
  }
}
