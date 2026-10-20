// Confirmation emails to founders, sent through Resend (resend.com).
//
// Settings (Vercel environment variables):
//   RESEND_API_KEY   required; without it no email is sent and nothing breaks
//   EMAIL_FROM       e.g. "Souq <hello@joinsouq.com>" (the domain must be verified in Resend)
//   EMAIL_REPLY_TO   where founder replies go, e.g. "hello@joinsouq.com"
//
// To change what an email says, edit the text below.

import type { PathId } from "../../artifacts/souq-capital/src/intake/forms.js";

type Email = { to: string; subject: string; paragraphs: string[] };

const SIGN_OFF = "The Souq team";

export async function sendEmail({ to, subject, paragraphs }: Email): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return; // email not set up yet: skip quietly
  const text = [...paragraphs, SIGN_OFF].join("\n\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Souq <hello@joinsouq.com>",
      to: [to],
      reply_to: process.env.EMAIL_REPLY_TO || undefined,
      subject,
      text,
      html: toHtml(paragraphs),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function toHtml(paragraphs: string[]): string {
  const body = paragraphs
    .map((p) => {
      // Lines starting with "• " become a list.
      const lines = p.split("\n");
      if (lines.every((l) => l.startsWith("• "))) {
        return `<ul style="margin:0 0 16px;padding-left:20px">${lines.map((l) => `<li style="margin:0 0 4px">${esc(l.slice(2))}</li>`).join("")}</ul>`;
      }
      return `<p style="margin:0 0 16px">${esc(p).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
  return `<!doctype html><html><body style="margin:0;padding:0;background:#ffffff">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#111111">
<p style="margin:0 0 28px;font-size:20px;font-weight:600;letter-spacing:-0.02em">Souq</p>
${body}
<p style="margin:24px 0 0">${SIGN_OFF}</p>
<p style="margin:32px 0 0;font-size:12px;color:#888888">You're getting this because you filled out a form at joinsouq.com.</p>
</div></body></html>`;
}

const firstName = (name: string) => name.trim().split(/\s+/)[0] || "there";

/** The "we got it" email for each website form. */
export function confirmationFor(path: PathId, a: Record<string, string | string[]>): Email | null {
  const to = String(a.email || "").trim();
  if (!to) return null;
  const hi = `Hi ${firstName(String(a.name || ""))},`;
  const company = String(a.company || "").trim();
  const reply = "If anything changes in the meantime, or you have a question, just reply to this email.";

  switch (path) {
    case "funding":
      return {
        to,
        subject: "We received your Souq Capital application",
        paragraphs: [
          hi,
          `Thanks for applying for funding from Souq Capital${company ? ` for ${company}` : ""}. Your application came through.`,
          "Here's what happens next:",
          "• We review every application and reply within a few business days.\n• If it looks like a fit, we'll email you to set up an intro call.\n• After the call, we'll send a private link where you can upload a short list of documents.",
          reply,
        ],
      };
    case "accelerator":
      return {
        to,
        subject: "We received your Souq Accelerator application",
        paragraphs: [
          hi,
          `Thanks for applying to the Souq Accelerator${company ? ` with ${company}` : ""}. Your application came through.`,
          "We work with a small group of brands at a time, so we read every application closely. If it looks like a fit, we'll reach out to set up a conversation.",
          reply,
        ],
      };
    case "service": {
      const services = Array.isArray(a.services) ? a.services.join(", ") : "";
      return {
        to,
        subject: "We received your request",
        paragraphs: [
          hi,
          `Thanks for reaching out${services ? ` about ${services}` : ""}. Your request came through.`,
          "The lead for that service will email you to set up a short scoping call. On the call, they'll walk through your setup, then send you a scope and a quote.",
          reply,
        ],
      };
    }
    case "talk":
      return {
        to,
        subject: "Your office hours request",
        paragraphs: [
          hi,
          "Thanks for requesting office hours with Souq. Your request came through.",
          "We'll email you a few times that work for the team. The session is 30 minutes, and your answers mean we can skip the background and get straight to what you want to walk away with.",
          reply,
        ],
      };
    case "community":
      return {
        to,
        subject: "Welcome to the Souq community",
        paragraphs: [
          hi,
          "You're in. Thanks for joining the Souq community.",
          "We'll keep you posted on programming, the Summit, and resources from the team. Membership is free.",
          "If you ever want hands-on help, funding, or a single service, you can apply anytime at joinsouq.com/apply.",
        ],
      };
    case "3pl-onboarding":
      return {
        to,
        subject: "Your Souq fulfillment onboarding form",
        paragraphs: [
          hi,
          `Thanks for sending your onboarding details${company ? ` for ${company}` : ""}. They came through.`,
          "The fulfillment team will follow up within 1 to 2 business days to confirm your setup and go-live date.",
          reply,
        ],
      };
  }
}

/** Sent when a founder finishes the document upload page. */
export function documentsReceived(opts: { to: string; name: string; company: string; missing: string[]; link: string }): Email {
  const hi = `Hi ${firstName(opts.name)},`;
  const paragraphs = [hi, `Thanks, we received the documents and details${opts.company ? ` for ${opts.company}` : ""}.`];
  if (opts.missing.length) {
    paragraphs.push(
      "We still need these before we can finish the review:",
      opts.missing.map((m) => `• ${m}`).join("\n"),
      `You can add them anytime with the same private link:\n${opts.link}`,
    );
  } else {
    paragraphs.push("That's everything we need. The team will review it and come back to you with next steps.");
  }
  paragraphs.push("If you have a question, just reply to this email.");
  return { to: opts.to, subject: "We received your documents", paragraphs };
}
