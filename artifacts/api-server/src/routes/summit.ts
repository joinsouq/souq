import { createHmac, timingSafeEqual } from "node:crypto";
import { Router, type Request } from "express";

const router = Router();
const COOKIE_NAME = "souq_summit_access";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

const summitDetails = {
  header: {
    gathering: "Private gathering",
    year: "2026",
  },
  hero: {
    eyebrow: "Souq / Summit",
    title: "Make room for",
    emphasis: "what’s next.",
    description:
      "An intimate gathering for the founders, operators, and people shaping the next generation of consumer brands.",
    ctaLabel: "Request your invitation",
    ctaHref: "mailto:yaser@joinsouq.com?subject=Souq%20Summit%20invitation",
    asideNumber: "03",
    aside:
      "The third pillar of Souq is a room of founders who actually care — about the work, the details, and each other.",
  },
  invitation: {
    label: "The invitation",
    heading: "Good companies are built in public. Great ones are built together.",
    body:
      "Summit is a private space to step away from the dashboard and spend time with the people who understand the journey. No panels, no pitch decks — just generous conversation, a considered table, and a little room to think further.",
  },
  evening: {
    label: "The evening",
    items: [
      {
        index: "01",
        title: "Arrive curious",
        description: "Bring the question you haven’t had time to ask out loud.",
      },
      {
        index: "02",
        title: "Stay awhile",
        description: "A thoughtful table, good food, and conversations with range.",
      },
      {
        index: "03",
        title: "Leave with more",
        description:
          "New perspective, useful connections, and momentum for the next move.",
      },
    ],
  },
  closing: {
    eyebrow: "A room for builders",
    title: "Come as you are.",
    emphasis: "Build what matters.",
    ctaLabel: "Request your invitation",
    ctaHref: "mailto:yaser@joinsouq.com?subject=Souq%20Summit%20invitation",
  },
  footer: {
    pillars: "Capital / Operating Stack / Summit",
    copyright: `© ${new Date().getFullYear()} Souq`,
  },
};

function getSecrets(): { entryPassword: string; sessionSecret: string } | null {
  const entryPassword = process.env["SUMMIT_ENTRY_PASSWORD"];
  const sessionSecret = process.env["SESSION_SECRET"];

  if (!entryPassword || !sessionSecret) {
    return null;
  }

  return { entryPassword, sessionSecret };
}

function signature(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function matches(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function createAccessToken(sessionSecret: string): string {
  const payload = Buffer.from(
    JSON.stringify({ scope: "summit", expiresAt: Date.now() + SESSION_DURATION_MS }),
  ).toString("base64url");

  return `${payload}.${signature(payload, sessionSecret)}`;
}

function hasSummitAccess(req: Request, sessionSecret: string): boolean {
  const token = req.cookies?.[COOKIE_NAME];
  if (typeof token !== "string") {
    return false;
  }

  const [payload, tokenSignature] = token.split(".");
  if (!payload || !tokenSignature || !matches(tokenSignature, signature(payload, sessionSecret))) {
    return false;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      scope?: string;
      expiresAt?: number;
    };
    return parsed.scope === "summit" && typeof parsed.expiresAt === "number" && parsed.expiresAt > Date.now();
  } catch {
    return false;
  }
}

router.post("/summit/access", async (req, res): Promise<void> => {
  const { entryPhrase } = req.body as { entryPhrase?: unknown };
  const secrets = getSecrets();

  if (!secrets) {
    req.log.error("Summit access is missing required server configuration");
    res.status(500).json({ error: "Access is temporarily unavailable." });
    return;
  }

  if (typeof entryPhrase !== "string" || entryPhrase.length > 200) {
    res.status(400).json({ error: "Invalid entry phrase." });
    return;
  }

  if (!matches(entryPhrase.trim(), secrets.entryPassword.trim())) {
    res.json({ ok: false });
    return;
  }

  res.cookie(COOKIE_NAME, createAccessToken(secrets.sessionSecret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
    maxAge: SESSION_DURATION_MS,
    path: "/api/summit",
  });
  res.json({ ok: true });
});

router.get("/summit", async (req, res): Promise<void> => {
  const secrets = getSecrets();

  if (!secrets) {
    req.log.error("Summit content is missing required server configuration");
    res.status(500).json({ error: "Event details are temporarily unavailable." });
    return;
  }

  if (!hasSummitAccess(req, secrets.sessionSecret)) {
    res.status(204).end();
    return;
  }

  res.set("Cache-Control", "private, no-store");
  res.json(summitDetails);
});

export default router;