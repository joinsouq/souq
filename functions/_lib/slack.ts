// Posts to the #souq-pipeline Slack channel through an incoming webhook, so
// the team can open a thread on each underwriting draft and work on the Doc
// with Viktor there (@Viktor reads and edits it through his Google Drive
// connection).
//
// Set SLACK_WEBHOOK_URL on the souq-jobs Worker. Without it, nothing is posted.

export async function postToSlack(text: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, unfurl_links: false }),
  });
  if (!res.ok) throw new Error(`Slack ${res.status}: ${await res.text()}`);
}

/** Slack's link format, with the characters Slack treats as markup escaped. */
export const slackLink = (url: string, label: string) =>
  `<${url}|${label.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}>`;
