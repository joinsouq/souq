// GET /api/asana-setup: one-time setup for Customer Pipeline. Adds the
// "Documents requested" column (after Intro call) and the "Signing" column
// (after Proposal) if they're missing, and registers the Asana webhook that
// tells the site when cards move and comments are added. Safe to open more
// than once; it only creates what isn't there yet.

import { ensureDocsRequestedSection, ensureSigningSection, ensureWebhook, siteOrigin, DOCS_REQUESTED_NAME, SIGNING_NAME } from "../_lib/services.js";
import { bindEnv } from "../_lib/env.js";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export const onRequest: PagesFunction<Record<string, string>> = async ({ request, env }) => {
  bindEnv(env);
  try {
    const section = await ensureDocsRequestedSection();
    const signing = await ensureSigningSection();
    const target = `${siteOrigin(request.headers)}/api/asana-webhook`;
    const webhook = await ensureWebhook(target);
    return json(200, { ok: true, column: DOCS_REQUESTED_NAME, section, signingColumn: SIGNING_NAME, signing, webhook });
  } catch (e) {
    console.error("asana setup failed", e);
    return json(500, { ok: false, error: e instanceof Error ? e.message.slice(0, 300) : "error" });
  }
};
