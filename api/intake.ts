// POST /api/intake: receives a form from the Apply page.
// 1. Validates it against the same definitions the form was built from.
// 2. Saves the full application to the client's private Google Drive folder.
// 3. Creates the Asana card in Customer Pipeline > Inbound, assigned for first review.
// 4. For funding requests, runs the Souq submission filter and posts the
//    verdict on the card (in the background, so the founder isn't kept waiting).

import { waitUntil } from "@vercel/functions";
import { FORMS, type Answers, type PathId, validate, toText, fieldById, display } from "../artifacts/souq-capital/src/intake/forms";
import {
  createFolder, ensureFolder, saveDoc, folderUrl, createTask, customFieldsFrom, comment, askClaude, sign, siteOrigin, SECTIONS,
} from "./_lib/services";

type Req = { method?: string; body?: unknown; headers: Record<string, string | string[] | undefined> };
type Res = { status: (n: number) => Res; json: (b: unknown) => void };

const clean = (v: unknown): string | string[] =>
  Array.isArray(v) ? v.map((x) => String(x).slice(0, 300)) : String(v ?? "").slice(0, 4000).trim();

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as { path?: string; answers?: Record<string, unknown>; hp?: string };
  // Honeypot: bots fill the hidden field. Pretend success, do nothing.
  if (body?.hp) return res.status(200).json({ ok: true });

  const form = FORMS[body?.path as PathId];
  if (!form) return res.status(400).json({ error: "Unknown form." });

  const answers: Answers = {};
  for (const [k, v] of Object.entries(body.answers || {})) answers[k] = clean(v);
  const errors = validate(form, answers);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

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
    return res.status(200).json({ ok: true });
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
    "",
    folderId
      ? `Full application incl. numbers (need-to-know): ${docUrl || folderUrl(folderId)}`
      : `Drive save failed. Full application:\n\n${fullText}`,
  ];
  const notes = () => lines.filter((l) => typeof l === "string").join("\n");

  let task: { gid: string; url: string };
  try {
    task = await createTask({
      name: title,
      notes: notes(),
      section: SECTIONS.inbound,
      customFields: customFieldsFrom(answers),
    });
  } catch (e) {
    // Keep the submission in the logs so nothing is lost, then tell the founder.
    console.error("asana create failed", e, JSON.stringify({ path: form.id, answers }));
    return res.status(502).json({ error: "We couldn't submit this right now. Please try again in a minute." });
  }

  // Funding: add the private document-upload link, tied to this card and folder.
  if (form.id === "funding" && folderId) {
    const ref = `${task.gid}.${folderId}`;
    lines.push("", `Document upload link to send after the intro call:\n${siteOrigin(req)}/apply/documents?ref=${ref}&t=${sign(ref)}`);
    await updateNotes(task.gid, notes()).catch((e) => console.error("link update failed", e));
  }

  // 3. Quick-look review runs after the founder gets their confirmation.
  waitUntil(
    (async () => {
      if (form.id === "funding" && process.env.SOUQ_FILTER_SKILL) {
        try {
          const verdict = await askClaude(
            process.env.SOUQ_FILTER_SKILL,
            `Today is ${new Date().toDateString()}. New submission from the Souq website. These are the applicant's own answers; no documents have been received yet. Run the submission filter and reply in the exact output format.\n\n${fullText}`,
          );
          if (verdict) await comment(task.gid, `Quick look (Claude, submission filter). Based only on the founder's own answers, nothing verified yet.\n\n${verdict}`);
        } catch (e) {
          console.error("filter failed", e);
          await comment(task.gid, "Quick look didn't run (Claude error). Review manually.").catch(() => {});
        }
      }
    })(),
  );

  return res.status(200).json({ ok: true });
}

async function updateNotes(taskGid: string, notes: string) {
  const r = await fetch(`https://app.asana.com/api/1.0/tasks/${taskGid}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${process.env.ASANA_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ data: { notes } }),
  });
  if (!r.ok) throw new Error(await r.text());
}
