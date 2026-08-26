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
      "A full day in LA for the people building the next wave of Muslim-owned businesses.",
    ctaLabel: "Request your invitation",
    ctaHref: lumaEventUrl,
    asideNumber: "09 / 12",
    aside:
      "Saturday, September 12, 2026 · Blank Space Santa Monica, Los Angeles.",
  },
  invitation: {
    label: "The room",
    heading: "Founders, operators, and creators building what’s next.",
    body:
      "Founders and operators scaling brands, ecom, CPG, and service companies. Creators and influencers giving them reach. One room where both sides meet to talk about what it really takes to grow.",
  },
  program: {
    label: "The program",
    heading: "A full day of candid conversations and practical ideas for the work ahead.",
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
        description: "Building the next wave of Muslim-owned brands and businesses.",
      },
      {
        index: "02",
        title: "Operators",
        description: "Scaling ecom, CPG, service companies, and the systems behind them.",
      },
      {
        index: "03",
        title: "Creators",
        description: "Giving great businesses the reach, attention, and momentum to grow.",
      },
    ],
  },
  logistics: {
    label: "When & where",
    date: "Saturday, September 12, 2026",
    rsvpDeadline: "RSVP by August 25",
    venue: "Blank Space Santa Monica",
    venueNote: "Los Angeles · Venue announced",
    venueHref: "https://www.google.com/maps/search/?api=1&query=Blank+Space+Santa+Monica",
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