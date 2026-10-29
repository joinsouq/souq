// Long-running work that happens after the founder already has their answer:
// the cover sheet, the quick look, and the underwriting draft. Each one calls
// Claude and can take several minutes.
//
// Cloudflare stops background work (waitUntil) 30 seconds after the response
// is sent, so the site hands these to the "souq-jobs" queue instead. The
// souq-jobs Worker (jobs/index.ts) picks them up and gets up to 15 minutes
// per job. If the queue isn't bound (local dev), they fall back to waitUntil.

import { comment, getTask, askClaude } from "./services.js";
import { loadSkill, runUnderwriting } from "./underwrite.js";
import { runCoverSheet } from "./coversheet.js";

export type Job =
  | {
      kind: "coverSheet";
      taskGid: string;
      folderId: string;
      company: string;
      path: string;
      applicationText: string;
      answers: Record<string, string | string[]>;
    }
  | { kind: "quickLook"; taskGid: string; applicationText: string }
  | { kind: "underwrite"; taskGid: string; clientFolder: string; docsFolder: string; company: string };

type JobQueue = { send(body: Job): Promise<unknown> };

/** Sends a job to the queue, or runs it in the background if there's no queue. */
export async function enqueue(env: Record<string, unknown>, waitUntil: (p: Promise<unknown>) => void, job: Job) {
  const queue = env.JOBS as JobQueue | undefined;
  if (queue) {
    try {
      await queue.send(job);
      return;
    } catch (e) {
      console.error("queue send failed, running in the background instead", job.kind, e);
    }
  } else {
    console.warn("JOBS queue not bound; running in the background (cut off after 30 seconds)", job.kind);
  }
  waitUntil(runJob(job));
}

/** Runs one job. Failures are posted on the Asana card, never thrown. */
export async function runJob(job: Job): Promise<void> {
  switch (job.kind) {
    case "coverSheet":
      return coverSheet(job);
    case "quickLook":
      return quickLook(job);
    case "underwrite":
      return runUnderwriting(job).catch((e) => console.error("underwriting error", e));
  }
}

async function coverSheet(job: Extract<Job, { kind: "coverSheet" }>) {
  try {
    const cover = await runCoverSheet(job);
    // Add the link to the card as it is now, so edits made in the meantime
    // (by the team or by other automations) aren't overwritten.
    const coverLine = `Cover sheet (public background on the company and founders): ${cover.link}`;
    const current = String(((await getTask(job.taskGid)) as { notes?: string }).notes || "");
    const at = current.indexOf("Full application incl. numbers");
    const updated = at >= 0 ? `${current.slice(0, at)}${coverLine}\n\n${current.slice(at)}` : `${current}\n\n${coverLine}`;
    await updateNotes(job.taskGid, updated).catch((e) => console.error("cover link update failed", e));
    await comment(job.taskGid, `Cover sheet ready (Claude, from the application and public sources).${cover.summary ? `\n\n${cover.summary}` : ""}\n\n${cover.link}`);
  } catch (e) {
    console.error("cover sheet failed", e);
    await comment(job.taskGid, "Cover sheet didn't run (Claude error). Look the company up manually.").catch(() => {});
  }
}

async function quickLook(job: Extract<Job, { kind: "quickLook" }>) {
  // The skill comes from the "_Souq skills" folder in Drive; the env var is a fallback.
  const filterSkill =
    (await loadSkill("souq-submission-filter").catch((e) => { console.error("skill load failed", e); return null; })) ||
    process.env.SOUQ_FILTER_SKILL;
  if (!filterSkill) return;
  try {
    const verdict = await askClaude(
      filterSkill,
      `Today is ${new Date().toDateString()}. New submission from the Souq website. These are the applicant's own answers; no documents have been received yet. Run the submission filter and reply in the exact output format.\n\n${job.applicationText}`,
    );
    if (verdict) await comment(job.taskGid, `Quick look (Claude, submission filter). Based only on the founder's own answers, nothing verified yet.\n\n${verdict}`);
  } catch (e) {
    console.error("filter failed", e);
    await comment(job.taskGid, "Quick look didn't run (Claude error). Review manually.").catch(() => {});
  }
}

export async function updateNotes(taskGid: string, notes: string) {
  const r = await fetch(`https://app.asana.com/api/1.0/tasks/${taskGid}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${process.env.ASANA_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ data: { notes } }),
  });
  if (!r.ok) throw new Error(await r.text());
}
