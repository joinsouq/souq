// GET /api/asana-setup: one-time setup for the "Documents requested" step.
// Adds the column to Customer Pipeline (after Intro call) if it's missing, and
// registers the Asana webhook that tells the site when cards move. Safe to
// open more than once; it only creates what isn't there yet.

import { ensureDocsRequestedSection, ensureWebhook, siteOrigin, DOCS_REQUESTED_NAME } from "../_lib/services.js";
import { bindEnv } from "../_lib/env.js";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export const onRequest: PagesFunction<Record<string, string>> = async ({ request, env }) => {
  bindEnv(env);
  try {
    const section = await ensureDocsRequestedSection();
    const target = `${siteOrigin(request.headers)}/api/asana-webhook`;
    const webhook = await ensureWebhook(target);
    return json(200, { ok: true, column: DOCS_REQUESTED_NAME, section, webhook });
  } catch (e) {
    console.error("asana setup failed", e);
    return json(500, { ok: false, error: e instanceof Error ? e.message.slice(0, 300) : "error" });
  }
};
