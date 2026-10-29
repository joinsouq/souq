# Deploying the Souq site on Cloudflare

The site has two parts in the Souq Cloudflare account:

| Part | What it is | Where the code is |
| --- | --- | --- |
| **souqweb** (Pages project) | The website plus the `/api/*` routes: forms, document upload, Asana webhook | `artifacts/souq-capital`, `functions/`, `wrangler.toml` |
| **souq-jobs** (Worker) | The slow work: cover sheets, quick looks, underwriting drafts | `jobs/`, `functions/_lib/jobs.ts` |

They talk through a queue called `souq-jobs`. Pages Functions can only run background work for 30 seconds after answering the browser, and a Claude cover sheet or underwriting draft takes minutes, so the site puts those on the queue and the Worker picks them up (up to 15 minutes each).

## One-time setup

Run these from the repo folder on your own machine.

```sh
pnpm install
npx wrangler login                       # sign in with amna@joinsouq.com
export CLOUDFLARE_ACCOUNT_ID=4890f78e2c1eb373783092cacc38d1d2   # the Souq account
npx wrangler queues create souq-jobs
```

### Secrets

Neither the site nor the jobs Worker has its keys yet. They're on Vercel, but marked sensitive there, so Vercel won't show or export them. Get each one from its source:

| Secret | Where to get it | Site | Worker |
| --- | --- | --- | --- |
| `ANTHROPIC_API_KEY` | console.anthropic.com > API keys | yes | yes |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Google Cloud > the service account > Keys (the whole JSON file) | yes | yes |
| `ASANA_TOKEN` | Asana > My settings > Apps > Developer apps (personal access token) | yes | yes |
| `RESEND_API_KEY` | resend.com > API keys | yes | no |
| `INTAKE_SECRET` | Any long random string (`openssl rand -hex 32`). A new one means upload links sent from the old site stop working. | yes | no |
| `SOUQ_FILTER_SKILL` | Optional fallback; the skill is normally read from Drive | optional | optional |

Put them in a file called `.dev.vars` in the repo folder (git ignores it), one per line:

```
ANTHROPIC_API_KEY=...
ASANA_TOKEN=...
RESEND_API_KEY=...
INTAKE_SECRET=...
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...whole JSON on one line...}
GOOGLE_DRIVE_ID=0AGWIUuKOfejeUk9PVA
ASANA_PROJECT_ID=1218558274599091
ASANA_ASSIGNEE_ID=1217275819355125
EMAIL_REPLY_TO=amna@joinsouq.com
```

Then load them into both. Keep the file only if you want to run the site locally with `pnpm pages:dev`; otherwise delete it.

```sh
npx wrangler pages secret bulk .dev.vars --project-name souqweb
npx wrangler secret bulk .dev.vars -c jobs/wrangler.toml
```

The Worker only uses the Claude, Google and Asana values; the extra ones don't hurt.

**Email sender:** the code sends from `Souq <hello@joinsouq.com>` unless `EMAIL_FROM` says otherwise. That only works once joinsouq.com is verified in Resend (resend.com > Domains > Add joinsouq.com, then add the DNS records it gives you in Cloudflare > joinsouq.com > DNS). Until then, Resend only delivers to your own address.

### Deploy the Worker, then the site

```sh
pnpm jobs:deploy
```

Then deploy the site. The souqweb project isn't connected to GitHub, so deploys come from your machine:

```sh
pnpm pages:deploy
```

The site must be redeployed after the queue exists, so it picks up the `JOBS` queue binding from `wrangler.toml`.

Run `pnpm pages:deploy` from the `souq-v2` branch: that's the project's production branch, so it updates souqweb.pages.dev.

**Plan note:** the Worker allows up to 5 minutes of CPU per job (`[limits] cpu_ms` in `jobs/wrangler.toml`), which needs the Workers Paid plan ($5/month). On the free plan, deploys with that setting fail, and the 10 ms CPU limit is too low for reading uploaded spreadsheets anyway.

## Test before switching the domain

On `souqweb.pages.dev`, with `pnpm jobs:logs` running in a second terminal:

1. **Funding application.** Submit one with a test company name. Check: confirmation email arrives, Asana card in Customer Pipeline > New, Drive folder with the application, then within a few minutes a "Quick look" comment and a "Cover sheet ready" comment with a Doc link.
2. **Accelerator application.** Same checks, minus the quick look.
3. **Document upload.** Open the upload link from the funding card, get the emailed code, upload a couple of files, finish. Check: receipt email, card moves to Diligence, then within a few minutes the underwriting draft Doc and comment.
4. **Asana trigger.** Move a test card to "Documents requested" and check the founder email goes out.

The logs should show `job start` and `job done` for each queued job. Delete the test cards and Drive folders afterwards.

## Switch joinsouq.com

1. Cloudflare dashboard > Souq account > Workers & Pages > **souqweb** > **Custom domains**.
2. Add `joinsouq.com`, then `www.joinsouq.com`. Cloudflare updates the DNS records itself since the domain is in the same account. It replaces whatever the records point to now.
3. Open `https://joinsouq.com` and `https://www.joinsouq.com` and check both load the new site.

## Point Asana at the new domain

1. Open `https://joinsouq.com/api/asana-setup` once. It registers the webhook for the new address.
2. Remove the old webhook that points at the Vercel address, so moves aren't sent twice. Ask Claude to list the project's webhooks, or use the Asana API: `GET /webhooks?workspace=<id>&resource=<project id>`, then `DELETE /webhooks/<gid>` for the Vercel one.

## Day to day

- `pnpm jobs:logs` shows the jobs Worker live.
- If a cover sheet or memo never shows up, the card gets a "didn't run" comment and the error is in the Worker's logs (dashboard > souq-jobs > Observability).
- Change anything in `functions/_lib/` that jobs use (coversheet, underwrite, services)? Redeploy both: `pnpm jobs:deploy` and the site.
