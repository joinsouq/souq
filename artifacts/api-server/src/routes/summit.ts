import { Router } from "express";

const router = Router();
const lumaEventUrl = "https://luma.com/51f8g6uw";

// Confirmed guest/company sign-ups. Souq's own team is left out here since
// they're already featured on the Team page. Excludes exact duplicate
// sign-ups and one clearly mismatched LinkedIn link (Anwar Jibawi's entry
// pointed to a different attendee's profile).
const confirmedGuests: Array<{ name: string; company?: string; linkedin?: string }> = [
  { name: "Lauren Kim", company: "BXM Consultants", linkedin: "https://linkedin.com/in/lauren-kim-a319581" },
  { name: "EVERYTHING BRAND", company: "EVERYTHING Studios", linkedin: "https://linkedin.com/in/abdulalimjemal" },
  { name: "Ian Park", company: "Nominal", linkedin: "https://linkedin.com/in/ianfromindy" },
  { name: "TURSH LLC", company: "Tursh", linkedin: "https://linkedin.com/in/meenahoshmand" },
  { name: "Ehsaan Mesghali", company: "Fadwa Masala", linkedin: "https://linkedin.com/in/emesghali" },
  { name: "Inam", company: "Ayn Skin House" },
  { name: "Fatimah Waseem", company: "Atlas and Silk" },
  { name: "Ibrahim Mimou", company: "Movements LLC", linkedin: "https://linkedin.com/in/ibrahimmimou" },
  { name: "Noah", company: "Veriswap" },
  { name: "Rabia Mohiuddin", company: "Siraat" },
  { name: "Omar Nassimi", company: "PVBLIC House" },
  { name: "Sahar Ali", company: "Celery Retail", linkedin: "https://linkedin.com/in/saharaliprofile" },
  { name: "Mahnoor Khan", company: "Noor House" },
  { name: "Humaira Syed", company: "Niswa Fashion", linkedin: "https://linkedin.com/in/Niswafashion" },
  { name: "Hussein Khanafer", company: "Yara Group", linkedin: "https://linkedin.com/in/Husseink" },
  { name: "Anwar Jibawi", company: "Anwar" },
  { name: "Nadir Tayach", company: "Naali", linkedin: "https://linkedin.com/in/nadir-tayach" },
  { name: "Summer Albarcha", company: "Summer Evenings" },
  { name: "Ismail Sayeed", company: "Calligrafist LLC", linkedin: "https://linkedin.com/in/ismailsayeed" },
  { name: "Salman Hussain", company: "Choti Koti" },
  { name: "Yasmine Borno", company: "Hayati", linkedin: "https://linkedin.com/in/yasmine-borno-74512b116" },
  { name: "Omar Z.", company: "Founders Law", linkedin: "https://linkedin.com/in/omar-zoubeidi-8447bb224" },
  { name: "Layla Shaikley", company: "Wise Systems", linkedin: "https://linkedin.com/in/lshaikley" },
  { name: "Aman Fahimullah", company: "Healthspan" },
  { name: "Mohannad El-Khairy", linkedin: "https://linkedin.com/in/mohannadelkhairy" },
  { name: "Mohammed Melies", company: "101 Studios / PrintYourVinyl", linkedin: "https://linkedin.com/in/mohammed-melies" },
  { name: "Safwaan Mir", company: "Rho", linkedin: "https://linkedin.com/in/safwaanmir" },
  { name: "Ahmed A. Mirza", company: "Cartweel", linkedin: "https://linkedin.com/in/ahmedamirza" },
  { name: "Natalie Sabri", company: "Dough Parlour" },
  { name: "Mohammad Afredi" },
  { name: "Asli Sungur", company: "Purecious Jewelry" },
  { name: "Antar Hanif", company: "IAMSHooter" },
  { name: "Abeer Ali", company: "Neeyah" },
  { name: "Dannah J", company: "Innate Capital / Nur House" },
  { name: "Ahmad Abdallah", company: "Nominal · CMO" },
  { name: "Ammar Melies", company: "GLO" },
  { name: "Omar Snoubar", company: "elaa" },
  { name: "Leena Snoubar", company: "elaa" },
  { name: "Lina Idelbi", company: "Jamali" },
  { name: "Farah", company: "Paliroots" },
  { name: "Mouyyad Abdulhadi", company: "Pax & Benfica" },
  { name: "Yaser Albataineh", company: "Veiled" },
  { name: "Riaz Surti", company: "Hearthy" },
  { name: "Rahim Siddiq", company: "Fith" },
  { name: "Nadia Rayan", company: "RAYAN" },
  { name: "Kareem Elgendy", company: "Veiled" },
  { name: "Fadwa Hilili", company: "Fadwa Masala" },
  { name: "Akram Abdallah", company: "Nominal" },
  { name: "Khaled Atallah", company: "Noun Naturals" },
  { name: "Steven", company: "Noun Naturals" },
];

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
  guests: {
    label: "Confirmed guests",
    heading: "Founders and teams already confirmed.",
    body: "A growing list of the founders, operators, and brands joining September 12. More guests and speakers are confirmed every week.",
    list: confirmedGuests,
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