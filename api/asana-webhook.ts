// POST /api/asana-webhook: Asana calls this when a card in Customer Pipeline
// is added to a column. When a funding card lands in "Documents requested",
// the founder gets their private upload link by email, and the card says so.
//
// Asana's first call is a handshake (X-Hook-Secret), which we echo back.
// Events are only a nudge: every decision is made from the card as it is now,
// so a fake or repeated call can't send anything the card doesn't call for.

import { waitUntil } from "@vercel/functions";
import { DOC_SLOTS } from "../artifacts/souq-capital/src/intake/forms.js";
import { ensureDocsRequestedSection, getTask, updateNotes, comment, setWaitingOn } from "./_lib/services.js";
import { documentsRequest, sendEmail } from "./_lib/email.js";

type Req = { method?: string; body?: unknown; headers: Record<string, string | string[] | undefined> };
type Res = { status: (n: number) => Res; json: (b: unknown) => void; setHeader: (k: string, v: string) => void };
type Event = { action?: string; resource?: { gid: string; resource_type: string }; parent?: { gid: string; resource_type: string } };
type Task = { name?: string; notes?: string; memberships?: { section?: { gid: string }; project?: { gid: string } }[] };

const SENT_MARK = "Upload link emailed to founder";

export default async function handler(req: Req, res: Res) {
  const hookSecret = req.headers["x-hook-secret"];
  if (hookSecret) {
    res.setHeader("X-Hook-Secret", String(hookSecret));
    return res.status(200).json({ ok: true });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = (typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {}) as { events?: Event[] };
  const tasks = new Set(
    (body.events || [])
      .filter((e) => e.action === "added" && e.resource?.resource_type === "task" && e.parent?.resource_type === "section")
      .map((e) => e.resource!.gid),
  );
  if (tasks.size) waitUntil(Promise.all([...tasks].map((gid) => handleTask(gid).catch((e) => console.error("docs request failed", gid, e)))));
  return res.status(200).json({ ok: true });
}

async function handleTask(gid: string) {
  const section = await ensureDocsRequestedSection();
  const task = (await getTask(gid)) as Task;
  const inSection = task.memberships?.some((m) => m.section?.gid === section);
  if (!inSection) return;

  const notes = String(task.notes || "");
  if (notes.includes(SENT_MARK)) return; // already sent once; moving it again doesn't resend

  const link = notes.match(/https?:\/\/\S+\/apply\/documents\?ref=\S+/)?.[0];
  if (!link) {
    await comment(gid, "Moved to Documents requested, but this card has no upload link (only funding applications get one), so nothing was sent.");
    return;
  }
  const contact = notes.match(/Contact:\s*([^,·\n]+)[^·\n]*·\s*([^\s·]+@[^\s·]+)/);
  if (!contact) {
    await comment(gid, "Moved to Documents requested, but there's no founder email on this card, so the upload link wasn't sent. Send it by hand.");
    return;
  }
  const [, name, email] = contact;
  const company = String(task.name || "").replace(/\s*\([^()]*\)\s*$/, "");

  await sendEmail(documentsRequest({
    to: email, name: name.trim(), company, link,
    needed: DOC_SLOTS.filter((s) => s.required).map((s) => s.label),
  }));
  const when = new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" });
  await updateNotes(gid, `${notes}\n\n${SENT_MARK}: ${email}, ${when} ET`);
  await comment(gid, `Upload link emailed to ${email} automatically (card moved to Documents requested). They'll get a code to open it.`);
  await setWaitingOn(gid, "Founder").catch(() => {});
}
