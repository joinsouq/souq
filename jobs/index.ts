// The souq-jobs Worker: runs the slow work the site queues up (cover sheets,
// quick looks, underwriting drafts). See functions/_lib/jobs.ts.
//
// Deploy with `pnpm jobs:deploy`. It needs the same secrets as the site
// (Claude, Google Drive, Asana); set them with
// `wrangler secret put <NAME> -c jobs/wrangler.toml`.

import { bindEnv } from "../functions/_lib/env.js";
import { runJob, type Job } from "../functions/_lib/jobs.js";

export default {
  async queue(batch: MessageBatch<Job>, env: Record<string, unknown>) {
    bindEnv(env);
    for (const msg of batch.messages) {
      console.log("job start", msg.body.kind, msg.body.taskGid, `attempt ${msg.attempts}`);
      // runJob reports its own failures on the Asana card and doesn't throw,
      // so a job is never retried into a duplicate comment.
      await runJob(msg.body);
      msg.ack();
      console.log("job done", msg.body.kind, msg.body.taskGid);
    }
  },
} satisfies ExportedHandler<Record<string, unknown>, Job>;
