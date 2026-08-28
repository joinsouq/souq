import { Router } from "express";

const router = Router();
const lumaEventUrl = "https://luma.com/51f8g6uw";

// Confirmed guest/company sign-ups, consolidated by company so a brand with
// multiple attendees gets one card instead of a repeated company name.
// Souq's own team is left out here since they're already featured on the
// Team page. Excludes exact duplicate sign-ups and one clearly mismatched
// LinkedIn link (Anwar Jibawi's entry pointed to a different attendee's
// profile).
// Company logos are self-hosted under souq-capital/public/logos, sourced from
// each company's own site/store and only added where the guest's stated
// company could be confidently matched to a real, findable brand.
const confirmedGuests: Array<{
  company?: string;
  logo?: string;
  people: Array<{ name: string; role?: string; linkedin?: string }>;
}> = [
  { company: "BXM Consultants", people: [{ name: "Lauren Kim", linkedin: "https://linkedin.com/in/lauren-kim-a319581" }] },
  { company: "EVERYTHING Studios", people: [{ name: "EVERYTHING BRAND", linkedin: "https://linkedin.com/in/abdulalimjemal" }] },
  {
    company: "Nominal",
    people: [
      { name: "Ian Park", linkedin: "https://linkedin.com/in/ianfromindy" },
      { name: "Ahmad Abdallah", role: "CMO" },
      { name: "Akram Abdallah" },
    ],
  },
  { company: "Tursh", people: [{ name: "TURSH LLC", linkedin: "https://linkedin.com/in/meenahoshmand" }] },
  {
    company: "Fadwa Masala",
    logo: "logos/fadwa-masala.png",
    people: [
      { name: "Ehsaan Mesghali", linkedin: "https://linkedin.com/in/emesghali" },
      { name: "Fadwa Hilili" },
    ],
  },
  {
    company: "Ayn Skin House",
    logo: "logos/ayn-skin-house.png",
    people: [{ name: "Inam" }],
  },
  { company: "Atlas and Silk", people: [{ name: "Fatimah Waseem" }] },
  { company: "Movements LLC", people: [{ name: "Ibrahim Mimou", linkedin: "https://linkedin.com/in/ibrahimmimou" }] },
  {
    company: "Veriswap",
    logo: "logos/veriswap.png",
    people: [{ name: "Noah" }],
  },
  { company: "Siraat", people: [{ name: "Rabia Mohiuddin" }] },
  { company: "PVBLIC House", people: [{ name: "Omar Nassimi" }] },
  {
    company: "Celery Retail",
    logo: "logos/celery-retail.png",
    people: [{ name: "Sahar Ali", linkedin: "https://linkedin.com/in/saharaliprofile" }],
  },
  { company: "Noor House", people: [{ name: "Mahnoor Khan" }] },
  {
    company: "Niswa Fashion",
    logo: "logos/niswa-fashion.png",
    people: [{ name: "Humaira Syed", linkedin: "https://linkedin.com/in/Niswafashion" }],
  },
  { company: "Yara Group", people: [{ name: "Hussein Khanafer", linkedin: "https://linkedin.com/in/Husseink" }] },
  { company: "Anwar", people: [{ name: "Anwar Jibawi" }] },
  {
    company: "Naali",
    logo: "logos/naali.png",
    people: [{ name: "Nadir Tayach", linkedin: "https://linkedin.com/in/nadir-tayach" }],
  },
  { company: "Summer Evenings", people: [{ name: "Summer Albarcha" }] },
  { company: "Calligrafist LLC", people: [{ name: "Ismail Sayeed", linkedin: "https://linkedin.com/in/ismailsayeed" }] },
  { company: "Choti Koti", people: [{ name: "Salman Hussain" }] },
  {
    company: "Hayati",
    logo: "logos/hayati.png",
    people: [{ name: "Yasmine Borno", linkedin: "https://linkedin.com/in/yasmine-borno-74512b116" }],
  },
  {
    company: "Founders Law",
    logo: "logos/founders-law.svg",
    people: [{ name: "Omar Z.", linkedin: "https://linkedin.com/in/omar-zoubeidi-8447bb224" }],
  },
  {
    company: "Wise Systems",
    logo: "logos/wise-systems.svg",
    people: [{ name: "Layla Shaikley", linkedin: "https://linkedin.com/in/lshaikley" }],
  },
  { company: "Healthspan", people: [{ name: "Aman Fahimullah" }] },
  { people: [{ name: "Mohannad El-Khairy", linkedin: "https://linkedin.com/in/mohannadelkhairy" }] },
  {
    company: "101 Studios / PrintYourVinyl",
    logo: "logos/printyourvinyl.svg",
    people: [{ name: "Mohammed Melies", linkedin: "https://linkedin.com/in/mohammed-melies" }],
  },
  { company: "Rho", people: [{ name: "Safwaan Mir", linkedin: "https://linkedin.com/in/safwaanmir" }] },
  {
    company: "Cartweel",
    logo: "logos/cartweel.svg",
    people: [{ name: "Ahmed A. Mirza", linkedin: "https://linkedin.com/in/ahmedamirza" }],
  },
  { company: "Dough Parlour", logo: "logos/dough-parlour.png", people: [{ name: "Natalie Sabri" }] },
  { people: [{ name: "Mohammad Afredi" }] },
  { company: "Purecious Jewelry", logo: "logos/purecious-jewelry.png", people: [{ name: "Asli Sungur" }] },
  { company: "IAMSHooter", people: [{ name: "Antar Hanif" }] },
  { company: "Neeyah", people: [{ name: "Abeer Ali" }] },
  { company: "Innate Capital / Nur House", logo: "logos/innate-capital.png", people: [{ name: "Dannah J" }] },
  { company: "GLO", people: [{ name: "Ammar Melies" }] },
  { company: "elaa", people: [{ name: "Omar Snoubar" }, { name: "Leena Snoubar" }] },
  { company: "Jamali", people: [{ name: "Lina Idelbi" }] },
  { company: "Paliroots", logo: "logos/paliroots.webp", people: [{ name: "Farah" }] },
  { company: "Pax & Benfica", people: [{ name: "Mouyyad Abdulhadi" }] },
  {
    company: "Veiled",
    logo: "logos/veiled.png",
    people: [{ name: "Yaser Albataineh" }, { name: "Kareem Elgendy" }],
  },
  { company: "Hearthy", logo: "logos/hearthy.png", people: [{ name: "Riaz Surti" }] },
  { company: "Fith", people: [{ name: "Rahim Siddiq" }] },
  { company: "RAYAN", people: [{ name: "Nadia Rayan" }] },
  {
    company: "Noun Naturals",
    logo: "logos/noun-naturals.png",
    people: [{ name: "Khaled Atallah" }, { name: "Steven" }],
  },
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