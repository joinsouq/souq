import { Router } from "express";

const router = Router();

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

router.get("/summit", (_req, res): void => {
  res.set("Cache-Control", "public, max-age=300");
  res.json(summitDetails);
});

export default router;