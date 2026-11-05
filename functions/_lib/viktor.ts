// "@viktor" in an Asana comment on a Customer Pipeline card: the comment is
// posted to #souq-pipeline, tagging Viktor, with the card and the client's
// Drive folder. Viktor does the work in Slack and posts his answer back on
// the card through his own Asana connection.
//
// Runs in the souq-jobs Worker (needs SLACK_WEBHOOK_URL). VIKTOR_SLACK_ID
// overrides Viktor's Slack member ID if the app is ever reinstalled.

import { getStory, getTask, comment, folderUrl } from "./services.js";
import { postToSlack, slackLink } from "./slack.js";

const VIKTOR_DEFAULT_ID = "U0C8QMYA2HX";
const SENT = "Sent to Viktor in #souq-pipeline";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function askViktor(job: { taskGid: string; storyGid: string }) {
  const story = await getStory(job.storyGid);
  const text = String(story.text || "").trim();
  if (story.resource_subtype !== "comment_added" || !/@viktor\b/i.test(text) || text.startsWith(SENT)) return;

  const task = (await getTask(job.taskGid)) as { name?: string; notes?: string; permalink_url?: string };
  const notes = String(task.notes || "");
  const company = String(task.name || "this company").replace(/\s*\([^()]*\)\s*$/, "");
  const who = story.created_by?.name || "Someone";
  const card = task.permalink_url || `https://app.asana.com/0/0/${job.taskGid}`;

  // The upload link carries "<task>.<folder>"; the card notes link the application and cover sheet.
  const folder = notes.match(/ref=\d+\.([A-Za-z0-9_-]+)/)?.[1];
  const docs = [...new Set(notes.match(/https:\/\/(?:docs|drive)\.google\.com\/\S+/g) || [])];

  const viktor = process.env.VIKTOR_SLACK_ID || VIKTOR_DEFAULT_ID;
  await postToSlack(
    `<@${viktor}> ${esc(who)} asked on the Asana card for *${esc(company)}*:\n` +
      esc(text).split("\n").map((l) => `> ${l}`).join("\n") +
      `\n\n${slackLink(card, "Asana card")}` +
      (folder ? ` · ${slackLink(folderUrl(folder), "Client folder in Drive")}` : "") +
      (docs.length ? `\nDocs on the card: ${docs.map((d, i) => slackLink(d, `doc ${i + 1}`)).join(" · ")}` : "") +
      `\n\nRead the card and the client folder, do what ${esc(who.split(" ")[0])} asked, then post your answer as a comment on the Asana card and a short summary in this thread.`,
  );
  await comment(job.taskGid, `${SENT}. He'll reply on this card and in the Slack thread.`);
}
