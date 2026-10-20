// /api/documents: the private document page a founder gets after the intro call.
//   GET  ?ref&t           -> who this link belongs to, and what's already uploaded
//   POST {action:"upload"} -> a one-time Drive upload URL for one file
//   POST {action:"finish"} -> saves their written answers, notes what's in and
//                              what's missing on the Asana card, moves the card

import { DOC_SLOTS, DOC_QUESTIONS, MAX_FILE_MB, validate, toText, type IntakeForm, type Answers } from "../artifacts/souq-capital/src/intake/forms.js";
import {
  parseRef, verify, getTask, ensureFolder, startUpload, listFiles, saveDoc, comment, moveTo, folderUrl, SECTIONS,
} from "./_lib/services.js";

type Req = { method?: string; body?: unknown; query?: Record<string, string>; headers: Record<string, string | string[] | undefined> };
type Res = { status: (n: number) => Res; json: (b: unknown) => void };

// The written questions, wrapped as a one-section form so we can reuse validate/toText.
const QUESTIONS_FORM: IntakeForm = {
  id: "funding", choice: "", choiceDetail: "", title: "Documents and details", intro: "", minutes: 0,
  submitLabel: "", doneTitle: "", doneBody: "", sections: [{ title: "Details", fields: DOC_QUESTIONS }],
};

const slotOf = (fileName: string) => DOC_SLOTS.find((s) => fileName.startsWith(`${s.label} - `));

export default async function handler(req: Req, res: Res) {
  const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body || {}) as Record<string, unknown>;
  const ref = String((req.method === "GET" ? req.query?.ref : body.ref) || "");
  const t = String((req.method === "GET" ? req.query?.t : body.t) || "");
  const parsed = parseRef(ref);
  if (!parsed || !verify(ref, t)) return res.status(403).json({ error: "This link isn't valid. Ask the Souq team for a new one." });

  try {
    const docsFolder = await ensureFolder("Documents", parsed.folder);

    if (req.method === "GET") {
      const task = await getTask(parsed.task);
      const files = await listFiles(docsFolder);
      const bySlot: Record<string, string[]> = {};
      for (const f of files) {
        const s = slotOf(f.name);
        if (s) (bySlot[s.id] ||= []).push(f.name.slice(s.label.length + 3));
      }
      // Card names look like "Company (Founder)"; show just the company.
      return res.status(200).json({ company: String(task.name).replace(/\s*\(.*\)\s*$/, ""), uploaded: bySlot });
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
      await moveTo(parsed.task, missing.length ? SECTIONS.docsNeeded : SECTIONS.underwriting);
      return res.status(200).json({ ok: true, missing: missing.map((m) => m.label) });
    }

    return res.status(400).json({ error: "Unknown action." });
  } catch (e) {
    console.error("documents error", e);
    return res.status(500).json({ error: "Something went wrong on our side. Please try again." });
  }
}
