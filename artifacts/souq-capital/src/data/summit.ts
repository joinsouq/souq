export type SummitDetails = {
  header: { gathering: string; year: string };
  hero: {
    eyebrow: string;
    title: string;
    emphasis: string;
    description: string;
    asideNumber: string;
    aside: string;
  };
  agenda: {
    label: string;
    heading: string;
    groups: Array<{
      label: string;
      time: string;
      items: Array<{
        start: string;
        end: string;
        duration: string;
        segment: string;
        speakers?: string;
        description?: string;
        singleLineDescription?: boolean;
        kind?: "session" | "break";
      }>;
    }>;
  };
  evening: {
    label: string;
    items: Array<{ index: string; title: string; description: string }>;
  };
  guests?: {
    label: string;
    heading: string;
    body: string;
    list: Array<{
      company?: string;
      logo?: string;
      people: Array<{ name: string; role?: string; linkedin?: string }>;
    }>;
  };
  footer: { pillars: string; copyright: string };
};

// Static copy used by the GitHub Pages build when the optional API is unavailable.
// Keep this synchronized with the API route's Summit payload.
const confirmedGuests = [
  {
    company: "Elaa",
    logo: "logos/elaa.webp",
    people: [{ name: "Omar Snoubar" }, { name: "Leena Snoubar" }],
  },
  {
    company: "Fith",
    logo: "logos/fith.png",
    people: [{ name: "Rahim Siddiq" }],
  },
  {
    company: "Hearthy",
    logo: "logos/hearthy.png",
    people: [{ name: "Riaz Surti" }],
  },
  {
    company: "Veiled",
    logo: "logos/veiled.png",
    people: [{ name: "Yaser Albataineh" }, { name: "Kareem Elgendy" }],
  },
  {
    company: "Noun Naturals",
    logo: "logos/noun-naturals.png",
    people: [{ name: "Khaled Atallah" }, { name: "Steven" }],
  },
  {
    company: "Pax & Beneficia",
    logo: "logos/pax-beneficia.svg",
    people: [{ name: "Mouyyad Abdulhadi" }],
  },
  {
    company: "Paliroots",
    logo: "logos/paliroots.webp",
    people: [{ name: "Farah" }],
  },
  {
    company: "Naali",
    logo: "logos/naali.png",
    people: [{ name: "Nadir Tayach", linkedin: "https://linkedin.com/in/nadir-tayach" }],
  },
  {
    company: "Nominal",
    logo: "logos/nominal.png",
    people: [
      { name: "Ian Park", linkedin: "https://linkedin.com/in/ianfromindy" },
      { name: "Ahmad Abdallah" },
      { name: "Akram Abdallah" },
    ],
  },
  {
    company: "Fadwa Masala",
    logo: "logos/fadwa-masala.png",
    people: [
      { name: "Ehsaan Mesghali", linkedin: "https://linkedin.com/in/emesghali" },
      { name: "Fadwa Hilili" },
    ],
  },
  { company: "BXM Consultants", people: [{ name: "Lauren Kim", linkedin: "https://linkedin.com/in/lauren-kim-a319581" }] },
  { company: "EVERYTHING Studios", people: [{ name: "EVERYTHING BRAND", linkedin: "https://linkedin.com/in/abdulalimjemal" }] },
  { company: "Tursh", people: [{ name: "TURSH LLC", linkedin: "https://linkedin.com/in/meenahoshmand" }] },
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
  { company: "Jamali", people: [{ name: "Lina Idelbi" }] },
  {
    company: "RAYAN",
    logo: "logos/rayan.png",
    people: [{ name: "Nadia Rayan" }],
  },
];

const summitDetails: SummitDetails = {
  header: {
    gathering: "The founders forum",
    year: "2026",
  },
  hero: {
    eyebrow: "Souq Summit 2026",
    title: "The Founders",
    emphasis: "Forum.",
    description:
      "A Saturday for Muslim founders, operators, and creators to compare notes, make useful connections, and move the work forward.",
    asideNumber: "09 / 12",
    aside: "Saturday, September 12, 2026 · Thank you for joining us",
  },
  agenda: {
    label: "Run of show",
    heading: "How the day ran.",
    groups: [
      {
        label: "Opening",
        time: "9:00 AM–11:10 AM",
        items: [
          {
            start: "9:00 AM",
            end: "9:55 AM",
            duration: "55 min",
            segment: "Doors & Coffee",
          },
          {
            start: "9:55 AM",
            end: "10:00 AM",
            duration: "5 min",
            segment: "Welcome & Housekeeping",
            speakers: "Bathool Syed, Souq",
          },
          {
            start: "10:00 AM",
            end: "10:20 AM",
            duration: "20 min",
            segment: "Fireside Chat: Building with Ihsan",
            speakers: "Sh. Umer Khan, Sharia Advisor; Safeer Mohiuddin, Souq",
          },
          {
            start: "10:20 AM",
            end: "10:30 AM",
            duration: "10 min",
            segment: "Souq Blueprint",
            speakers: "Ahmad Saleh, Souq",
          },
          {
            start: "10:30 AM",
            end: "10:50 AM",
            duration: "20 min",
            segment: "Fireside Chat: Mastering Your Craft",
            speakers: "Faraz Zaidi, Found; Asli Sungur, Purecious",
          },
          {
            start: "10:50 AM",
            end: "11:10 AM",
            duration: "20 min",
            segment: "Fireside Chat: Letting Go",
            speakers: "Yaser Albataineh, Veiled; Akram Abdallah, Nominal",
          },
        ],
      },
      {
        label: "Breakout Sessions",
        time: "11:20 AM–11:50 AM · choose one track",
        items: [
          {
            start: "11:20 AM",
            end: "11:50 AM",
            duration: "30 min",
            segment: "Track A: Production, Ideation to Creation",
            speakers: "Lauren Kim, Souq; Akram Abdallah, Nominal",
            description: "Welcome room",
          },
          {
            start: "11:20 AM",
            end: "11:50 AM",
            duration: "30 min",
            segment: "Track B: Media & Storytelling",
            speakers:
              "Shahbaz Khan, NFL; Ahmad Abdallah, Nominal; Mod. Antar Hanif, iAMSHOOTER",
            description: "This room",
          },
        ],
      },
      {
        label: "Lunch & Dhuhr",
        time: "11:50 AM–1:00 PM",
        items: [
          {
            start: "11:50 AM",
            end: "12:50 PM",
            duration: "60 min",
            segment: "Lunch",
          },
          {
            start: "12:50 PM",
            end: "1:00 PM",
            duration: "10 min",
            segment: "Dhuhr",
          },
        ],
      },
      {
        label: "Your Superpower and Kryptonite",
        time: "1:00 PM–2:20 PM",
        items: [
          {
            start: "1:00 PM",
            end: "1:20 PM",
            duration: "20 min",
            segment: "Creator to Brand",
            speakers:
              "Summer Albarcha, Summer Evenings; Leena Snoubar, Elaa; Mod. Layla Shaikley, Wise Systems",
          },
          {
            start: "1:20 PM",
            end: "1:40 PM",
            duration: "20 min",
            segment: "Ambition & Discipline",
            speakers: "Khaled Atallah, Noun; Mod. Ahmad Saleh, Souq",
          },
          {
            start: "1:40 PM",
            end: "2:00 PM",
            duration: "20 min",
            segment: "Finding the Balance",
            speakers: "Fadwa Hilili, Fadwa Masala; Mod. Bathool Syed, Souq",
          },
          {
            start: "2:00 PM",
            end: "2:20 PM",
            duration: "20 min",
            segment: "Phases of a Business, When to Do What",
            speakers: "Razi Mohiuddin, Souq; Mod. Ahmad Saleh, Souq",
          },
        ],
      },
      {
        label: "Let's Get to Business",
        time: "2:20 PM–5:30 PM",
        items: [
          {
            start: "2:20 PM",
            end: "3:00 PM",
            duration: "40 min",
            segment: "Break",
            kind: "break",
          },
          {
            start: "3:00 PM",
            end: "3:20 PM",
            duration: "20 min",
            segment: "Fireside Chat: Coming in as an Outsider",
            speakers:
              "Aziza El Wanni, The Potion Studio; Nadir Tayach, Naali; Mod. Ahmad Saleh, Souq",
          },
          {
            start: "3:20 PM",
            end: "3:50 PM",
            duration: "30 min",
            segment: "Workshop: DTC Growth Teardown",
            speakers: "Kareem Elgendy, Veiled; Mod. Safeer Mohiuddin, Souq",
          },
          {
            start: "3:50 PM",
            end: "4:30 PM",
            duration: "40 min",
            segment: "Panel: The View from the Other Side",
            speakers:
              "Yaser Albataineh, Veiled; Leena Snoubar, Elaa; Karam Saleh, Orijinal; Ebrahim Qattous, Abe Media; Abir Syed, Upcounting; Mod. Akram Abdallah, Nominal",
          },
          {
            start: "4:30 PM",
            end: "5:30 PM",
            duration: "60 min",
            segment: "Closing & Networking",
            speakers: "Ahmad Saleh, Souq",
          },
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
    label: "In the room",
    heading: "The founders and teams who joined us.",
    body: "Thank you to the founders, operators, and brands who spent September 12 with us. Join the Souq community to hear about the next one.",
    list: confirmedGuests,
  },
  footer: {
    pillars: "Capital / Operating Stack / Summit",
    copyright: `© ${new Date().getFullYear()} Souq`,
  },
};

export default summitDetails;