// POST /api/asana-webhook: Asana calls this when a card in Customer Pipeline
// is added to a column. When a funding card lands in "Documents requested",
// the founder gets their private upload link by email, and the card says so.
//
// Asana's first call is a handshake (X-Hook-Secret), which we echo back.
// Events are only a nudge: every decision is made from the card as it is now,
// so a fake or repeated call can't send anything the card doesn't call for.

import { docSlotsFor, docPathFromNotes } from "../../artifacts/souq-capital/src/intake/forms.js";
import { ensureDocsRequestedSection, getTask, updateNotes, comment, setWaitingOn } from "../_lib/services.js";
import { documentsRequest, sendEmail } from "../_lib/email.js";
import { bindEnv } from "../_lib/env.js";

type Event = { action?: string; resource?: { gid: string; resource_type: string }; parent?: { gid: string; resource_type: string } };
type Task = { name?: string; notes?: string; memberships?: { section?: { gid: string }; project?: { gid: string } }[] };

const SENT_MARK = "Upload link emailed to founder";

const json = (status: number, body: unknown, headers?: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

export const onRequest: PagesFunction<Record<string, string>> = async ({ request, env, waitUntil }) => {
  bindEnv(env);
  const hookSecret = request.headers.get("x-hook-secret");
  if (hookSecret) return json(200, { ok: true }, { "X-Hook-Secret": hookSecret });
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });

  const raw = await request.text();
  const body = (raw ? JSON.parse(raw) : {}) as { events?: Event[] };
  const tasks = new Set(
    (body.events || [])
      .filter((e) => e.action === "added" && e.resource?.resource_type === "task" && e.parent?.resource_type === "section")
      .map((e) => e.resource!.gid),
  );
  if (tasks.size) waitUntil(Promise.all([...tasks].map((gid) => handleTask(gid).catch((e) => console.error("docs request failed", gid, e)))));
  return json(200, { ok: true });
};

async function handleTask(gid: string) {
  const section = await ensureDocsRequestedSection();
  const task = (await getTask(gid)) as Task;
  const inSection = task.memberships?.some((m) => m.section?.gid === section);
  if (!inSection) return;

  const notes = String(task.notes || "");
  if (notes.includes(SENT_MARK)) return; // already sent once; moving it again doesn't resend

  const link = notes.match(/https?:\/\/\S+\/apply\/documents\?ref=\S+/)?.[0];
  if (!link) {
    await comment(gid, "Moved to Documents requested, but this card has no upload link (only funding and Accelerator applications get one), so nothing was sent.");
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
    needed: docSlotsFor(docPathFromNotes(notes)).filter((s) => s.required).map((s) => s.label),
  }));
  const when = new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" });
  await updateNotes(gid, `${notes}\n\n${SENT_MARK}: ${email}, ${when} ET`);
  await comment(gid, `Upload link emailed to ${email} automatically (card moved to Documents requested). They'll get a code to open it.`);
  await setWaitingOn(gid, "Founder").catch(() => {});
}
