// GET /api/asana-setup: one-time setup for the "Documents requested" step.
// Adds the column to Customer Pipeline (after Intro call) if it's missing, and
// registers the Asana webhook that tells the site when cards move. Safe to
// open more than once; it only creates what isn't there yet.

import { ensureDocsRequestedSection, ensureWebhook, siteOrigin, DOCS_REQUESTED_NAME } from "./_lib/services.js";

type Req = { headers: Record<string, string | string[] | undefined> };
type Res = { status: (n: number) => Res; json: (b: unknown) => void };

export default async function handler(req: Req, res: Res) {
  try {
    const section = await ensureDocsRequestedSection();
    // Preview deployments sit behind Vercel's login; Asana needs the automation bypass to reach them.
    const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    const target = `${siteOrigin(req)}/api/asana-webhook${bypass ? `?x-vercel-protection-bypass=${bypass}` : ""}`;
    const webhook = await ensureWebhook(target);
    return res.status(200).json({ ok: true, column: DOCS_REQUESTED_NAME, section, webhook, bypass: Boolean(bypass) });
  } catch (e) {
    console.error("asana setup failed", e);
    return res.status(500).json({ ok: false, error: e instanceof Error ? e.message.slice(0, 300) : "error" });
  }
}
