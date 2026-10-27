// The rest of this code reads settings from process.env (the Node convention,
// carried over from when this ran on Vercel). Cloudflare Pages Functions hand
// secrets and vars through context.env instead, so each function entrypoint
// copies them into process.env once at the top of the request.
export function bindEnv(env: Record<string, unknown>) {
  for (const [k, v] of Object.entries(env)) if (typeof v === "string") process.env[k] = v;
}
