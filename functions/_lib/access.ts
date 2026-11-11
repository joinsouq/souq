// Who can open a founder's document page, and how far along they are.
//
// Access has two parts:
//   1. The private link (ref + t), which the team sends after the intro call.
//   2. A one-time code emailed to the founder's address on the Asana card.
// Having the link alone is no longer enough. Once the code checks out, the
// browser gets a session token that works on this link for 7 days.
//
// Nothing is stored: codes and sessions are signed with INTAKE_SECRET, so they
// can be checked without a database.

import { createHmac, timingSafeEqual } from "node:crypto";

const secret = () => {
  const s = process.env.INTAKE_SECRET;
  if (!s) throw new Error("Missing environment variable INTAKE_SECRET");
  return s;
};
const hmac = (msg: string) => createHmac("sha256", secret()).update(msg).digest();
const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

// ---- One-time codes: 8 digits, valid for 10 to 20 minutes ------------------

const WINDOW_MS = 10 * 60 * 1000;

function codeFor(ref: string, window: number): string {
  const n = hmac(`code:${ref}:${window}`).readUInt32BE(0) % 100_000_000;
  return String(n).padStart(8, "0");
}

export function newCode(ref: string): string {
  return codeFor(ref, Math.floor(Date.now() / WINDOW_MS));
}

// Light brute-force brake. Per server instance only, so it slows guessing
// rather than stopping it; the 8-digit code and short expiry do the rest.
const failures = new Map<string, { n: number; until: number }>();

export function checkCode(ref: string, input: string): "ok" | "wrong" | "locked" {
  const f = failures.get(ref);
  if (f && f.until > Date.now() && f.n >= 5) return "locked";
  const code = String(input || "").replace(/\D/g, "");
  const w = Math.floor(Date.now() / WINDOW_MS);
  if (code.length === 8 && (same(code, codeFor(ref, w)) || same(code, codeFor(ref, w - 1)))) {
    failures.delete(ref);
    return "ok";
  }
  const n = (f && f.until > Date.now() ? f.n : 0) + 1;
  failures.set(ref, { n, until: Date.now() + 15 * 60 * 1000 });
  return "wrong";
}

// ---- Sessions: "<expiry>.<signature>", tied to one link --------------------

const SESSION_DAYS = 7;

export function newSession(ref: string): string {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${exp}.${hmac(`session:${ref}:${exp}`).toString("base64url").slice(0, 32)}`;
}

export function checkSession(ref: string, token: string | undefined): boolean {
  const [expRaw, sig] = String(token || "").split(".");
  const exp = Number(expRaw);
  if (!exp || exp < Date.now() || !sig) return false;
  return same(sig, hmac(`session:${ref}:${exp}`).toString("base64url").slice(0, 32));
}

/** Emailing a code needs the email service; without it (local testing), the link alone opens the page. */
export const codesEnabled = () => Boolean(process.env.RESEND_API_KEY);

/** "amna@joinsouq.com" -> "a•••@joinsouq.com" */
export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "your email";
  return `${user.slice(0, 1)}${"•".repeat(Math.max(2, Math.min(user.length - 1, 6)))}@${domain}`;
}

// ---- Progress shown to the founder ---------------------------------------

export type Step = { label: string; state: "done" | "current" | "todo"; detail?: string };

// The founder's steps, in order, for both Capital and Accelerator. The
// proposal (Capital: indicative terms) goes out after the intro call;
// documents come next, then the review (Capital: underwriting), then both
// sides sign.
//   0 Applied · 1 Intro call · 2 Proposal/Terms · 3 Documents · 4 In review · 5 Signed · 6 Onboarded/Funded
const PROPOSAL = 2;
const DOCUMENTS = 3;
const REVIEW = 4;
const SIGNING = 5;
const DONE = 6;

// Asana Customer Pipeline columns, mapped to how far along the founder is.
// Columns not listed here (like "Documents requested") count as Documents,
// except a column with "sign" in its name (e.g. "Signing"), which counts as
// the signing step.
const STAGE_BY_SECTION: Record<string, number> = {
  "1218558113663017": 1, // New: applied, intro call next
  "1218558260242200": 1, // Intro call
  "1218558260175604": PROPOSAL, // Proposal
  "1218558205461144": DOCUMENTS, // Diligence: documents, then review
  "1218558190765255": REVIEW, // Parked: shown as "in review"; founders never see "parked"
  "1218558190745258": DONE, // Live: onboarded / funded
};

// 3PL brands see their own steps: the intake comes first, files go with it,
// then the proposal, the signed agreement, and go-live in the warehouse.
//   0 Intake · 1 Files · 2 Proposal · 3 Signed · 4 Live
function progressFor3pl(section: { gid?: string; name?: string } | undefined, files: { have: number; total: number }) {
  const gid = section?.gid || "";
  const LIVE = 4;
  let stage =
    gid === "1218558190745258" ? LIVE
    : /\bsign/i.test(section?.name || "") ? 3
    : ["1218558260175604", "1218558190765255"].includes(gid) ? 2
    : files.total > 0 && files.have >= files.total ? 2 : 1;
  stage = Math.max(stage, 1);
  const steps: Step[] = ["Intake", "Files", "Proposal", "Signed", "Live"].map((label, i) => ({
    label,
    state: i < stage || (i === LIVE && stage === LIVE) ? "done" : i === stage ? "current" : "todo",
  }));
  steps[1].detail = `${Math.min(files.have, files.total)} of ${files.total} added`;
  return { steps, percent: Math.round(Math.min((stage / LIVE) * 100, 100)) };
}

export function progressFor(
  section: { gid?: string; name?: string } | undefined,
  docs: { have: number; need: number; total?: number },
  path: "funding" | "accelerator" | "3pl" = "funding",
) {
  if (path === "3pl") return progressFor3pl(section, { have: docs.have, total: docs.total ?? 0 });
  let stage = STAGE_BY_SECTION[section?.gid || ""] ?? (/\bsign/i.test(section?.name || "") ? SIGNING : DOCUMENTS);
  // Anyone on this page has had the proposal and been sent their upload
  // link, so never show less than "Documents".
  stage = Math.max(stage, DOCUMENTS);
  if (stage === DOCUMENTS && docs.have >= docs.need) stage = REVIEW;

  const labels = path === "accelerator"
    ? ["Applied", "Intro call", "Proposal", "Documents", "In review", "Signed", "Onboarded"]
    : ["Applied", "Intro call", "Terms", "Documents", "In review", "Signed", "Funded"];
  const steps: Step[] = labels.map((label, i) => ({
    label,
    state: i < stage || (i === DONE && stage === DONE) ? "done" : i === stage ? "current" : "todo",
  }));
  steps[DOCUMENTS].detail = `${Math.min(docs.have, docs.need)} of ${docs.need} required`;

  // Each step is an equal share; the documents step fills in as files arrive.
  const share = 100 / DONE;
  let percent = stage * share;
  if (stage === DOCUMENTS) percent += share * (docs.need ? Math.min(docs.have, docs.need) / docs.need : 0);
  return { steps, percent: Math.round(Math.min(percent, 100)) };
}
