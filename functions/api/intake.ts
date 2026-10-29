// POST /api/intake: receives a form from the Apply page.
// 1. Validates it against the same definitions the form was built from.
// 2. Saves the full application to the client's private Google Drive folder.
// 3. Creates the Asana card in Customer Pipeline > New ("Talk to us" goes to Intro call), assigned for first review.
// 4. For funding requests, runs the Souq submission filter and posts the
//    verdict on the card (in the background, so the founder isn't kept waiting).
// 5. For every application, drafts a cover sheet (public background on the
//    company and founders) as a Google Doc in the folder, linked on the card.

import { FORMS, type Answers, type PathId, validate, toText, fieldById, display } from "../../artifacts/souq-capital/src/intake/forms.js";
import {
  createFolder, ensureFolder, saveDoc, folderUrl, createTask, customFieldsFrom, sign, siteOrigin, SECTIONS,
} from "../_lib/services.js";
import { confirmationFor, sendEmail } from "../_lib/email.js";
import { bindEnv } from "../_lib/env.js";
import { enqueue, updateNotes } from "../_lib/jobs.js";

const BREAK = "\u0000break";

const clean = (v: unknown): string | string[] =>
  Array.isArray(v) ? v.map((x) => String(x).slice(0, 300)) : String(v ?? "").slice(0, 4000).trim();

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export const onRequest: PagesFunction<Record<string, string>> = async ({ request, env, waitUntil }) => {
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });
  bindEnv(env);

  const raw = await request.text();
  const body = (raw ? JSON.parse(raw) : {}) as { path?: string; answers?: Record<string, unknown>; hp?: string };
  // Honeypot: bots fill the hidden field. Pretend success, do nothing.
  if (body?.hp) return json(200, { ok: true });

  const form = FORMS[body?.path as PathId];
  if (!form) return json(400, { error: "Unknown form." });

  const answers: Answers = {};
  for (const [k, v] of Object.entries(body.answers || {})) answers[k] = clean(v);
  const errors = validate(form, answers);
  if (Object.keys(errors).length) return json(400, { errors });

  const company = String(answers.company || "").trim() || String(answers.name);
  const person = String(answers.name || "").trim();
  const title = person && person !== company ? `${company} (${person})` : company;
  const submitted = new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" });
  const fullText = `${form.title}\nSubmitted ${submitted} ET via joinsouq.com/apply\n\n${toText(form, answers)}`;

  // Community sign-ups aren't customers: keep them out of the pipeline.
  if (form.id === "community") {
    try {
      const folder = await ensureFolder("Community sign-ups", process.env.GOOGLE_DRIVE_ID!);
      await saveDoc(`${title} (${submitted})`, fullText, folder);
    } catch (e) {
      console.error("community save failed", e, JSON.stringify(answers));
    }
    await emailFounder(form.id, answers);
    return json(200, { ok: true });
  }

  // 1. Private Drive folder with the full application.
  let folderId = "";
  let docUrl = "";
  try {
    folderId = (await createFolder(title)).id;
    docUrl = await saveDoc(`Application: ${form.title} (${submitted})`, fullText, folderId);
  } catch (e) {
    console.error("drive save failed", e);
  }

  // 2. The Asana card: a short summary, with numbers kept in Drive (need-to-know).
  const pick = (id: string) => {
    const f = fieldById(form, id);
    return f ? display(f, answers[id]) : "";
  };
  const lines: (string | false | undefined)[] = [
    `Submitted ${submitted} ET via the website: ${form.choice}`,
    pick("website") && `Website: ${pick("website")}`,
    `Contact: ${person}${pick("role") ? `, ${pick("role")}` : ""} · ${pick("email")} · ${pick("phone")}`,
    pick("sells") && `Sells: ${pick("sells")}`,
    pick("category") && `Category: ${pick("category")}`,
    pick("services") && `Services requested: ${pick("services")}`,
    pick("channels") && `Channels: ${pick("channels")}`,
    pick("model") && `Funding for: ${pick("model")}`,
    pick("timing") && `Timing: ${pick("timing")}`,
    pick("ask") && `Wants from the session: ${pick("ask")}`,
    pick("why") && `Why now: ${pick("why")}`,
    pick("alsoAccelerator") === "Yes" && "Also interested in the Accelerator",
    pick("alsoFunding") === "Yes" && "Also wants funding",
    pick("heard") && `Heard about Souq: ${pick("heard")}`,
    BREAK,
    folderId
      ? `Full application incl. numbers (need-to-know): ${docUrl || folderUrl(folderId)}`
      : `Drive save failed. Full application:\n\n${fullText}`,
  ];
  // Unanswered questions leave empty strings; drop them, keep the deliberate breaks.
  const notes = () => lines.filter((l): l is string => typeof l === "string" && l !== "").map((l) => (l === BREAK ? "" : l)).join("\n");

  let task: { gid: string; url: string };
  try {
    task = await createTask({
      name: title,
      notes: notes(),
      section: form.id === "talk" ? SECTIONS.introCall : form.id === "3pl-onboarding" ? SECTIONS.live : SECTIONS.new,
      customFields: customFieldsFrom(form.id, answers),
    });
  } catch (e) {
    // Keep the submission in the logs so nothing is lost, then tell the founder.
    console.error("asana create failed", e, JSON.stringify({ path: form.id, answers }));
    return json(502, { error: "We couldn't submit this right now. Please try again in a minute." });
  }

  // Funding and Accelerator: add the private document-upload link, tied to this card and folder.
  if ((form.id === "funding" || form.id === "accelerator") && folderId) {
    const ref = `${task.gid}.${folderId}`;
    lines.push(BREAK, `Document upload link to send after the intro call:\n${siteOrigin(request.headers)}/apply/documents?ref=${ref}&t=${sign(ref)}`);
    await updateNotes(task.gid, notes()).catch((e) => console.error("link update failed", e));
  }

  // 3. Cover sheet: public background on the company and founders, saved to
  //    the folder and linked on the card.
  // 4. For funding requests, the quick-look review.
  //    Both take minutes, so they go to the jobs queue (see _lib/jobs.ts).
  if (folderId) {
    await enqueue(env, waitUntil, { kind: "coverSheet", taskGid: task.gid, folderId, company, path: form.id, applicationText: fullText, answers });
  }
  if (form.id === "funding") {
    await enqueue(env, waitUntil, { kind: "quickLook", taskGid: task.gid, applicationText: fullText });
  }

  await emailFounder(form.id, answers);
  return json(200, { ok: true });
};

/** "We got it" email to the founder. Never blocks or fails the submission. */
async function emailFounder(path: PathId, answers: Answers) {
  const email = confirmationFor(path, answers);
  if (!email) return;
  await sendEmail(email).catch((e) => console.error("confirmation email failed", e));
}
