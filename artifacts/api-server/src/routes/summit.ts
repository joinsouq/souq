import { Router } from "express";

const router = Router();
const lumaEventUrl = "https://luma.com/51f8g6uw";

const summitDetails = {
  header: {
    gathering: "The founders forum",
    year: "2026",
  },
  hero: {
    eyebrow: "Souq Summit 2026",
    title: "The Founders",
    emphasis: "Forum.",
    description:
      "A Saturday for Muslim founders, operators, and creators who want to compare notes, make useful connections, and move the work forward.",
    ctaLabel: "Request your invitation",
    ctaHref: lumaEventUrl,
    asideNumber: "09 / 12",
    aside:
      "Saturday, September 12, 2026 · Full event details on Luma.",
  },
  invitation: {
    label: "The room",
    heading: "A room full of people in the work.",
    body:
      "Founders bringing brands and businesses to the next stage. Operators building the systems behind them. Creators helping good companies get noticed. Come ready to share what’s working and what isn’t.",
  },
  program: {
    label: "The program",
    heading: "A working day with people who know the work.",
    blocks: [
      {
        title: "Morning",
        items: [
          "Doors and coffee",
          "Welcome",
          "Fireside: Marketing and Media",
          "Hot Seat: a founder's challenge, solved live by the room",
          "Fireside: Capital & Islamic finance",
          "Benchmarking Roundtables, grouped by stage",
        ],
      },
      {
        title: "Midday",
        items: [
          "Lunch, brand activations, and pre-matched 1:1 meetings",
        ],
      },
      {
        title: "Afternoon",
        items: [
          "Fireside: Operations and Fulfillment",
          "Hot Seat: a founder's challenge, solved live by the room",
          "Fireside: Leadership and Growth",
          "Live Brand Teardown",
          "Keynote",
          "Closing reflection",
        ],
      },
      {
        title: "Running all day",
        items: [
          "Souq Office Hours: 1:1 sessions with the Souq capital, 3PL, media, and financial ops teams",
        ],
      },
    ],
  },
  evening: {
    label: "Who’s in the room",
    items: [
      {
        index: "01",
        title: "Founders",
        description: "Owners and builders of Muslim-led brands and businesses.",
      },
      {
        index: "02",
        title: "Operators",
        description: "People running the finance, fulfillment, growth, and day-to-day systems.",
      },
      {
        index: "03",
        title: "Creators",
        description: "Creators who help good businesses earn attention and build trust.",
      },
    ],
  },
  logistics: {
    label: "Event details",
    date: "Saturday, September 12, 2026",
    rsvpDeadline: "RSVP by August 25",
    lumaHref: lumaEventUrl,
    hotels: [
      {
        name: "Hilton",
        rate: "$319/night",
        href: "https://www.google.com/maps/search/?api=1&query=Hilton+Santa+Monica",
      },
      {
        name: "The Georgian",
        rate: "$425/night",
        href: "https://www.google.com/maps/search/?api=1&query=The+Georgian+Santa+Monica",
      },
      {
        name: "The Proper",
        rate: "$475/night",
        href: "https://www.google.com/maps/search/?api=1&query=Santa+Monica+Proper+Hotel",
      },
    ],
  },
  closing: {
    eyebrow: "By invitation · Seats limited",
    title: "Request",
    emphasis: "yours.",
    ctaLabel: "Request your invitation",
    ctaHref: lumaEventUrl,
  },
  footer: {
    pillars: "Capital / Operating Stack / Summit",
    copyright: `© ${new Date().getFullYear()} Souq`,
  },
};

router.get("/summit", (_req, res): void => {
  res.set("Cache-Control", "no-store");
  res.json(summitDetails);
});

export default router;