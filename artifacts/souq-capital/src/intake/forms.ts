// Intake forms, defined once and used by both the website (to render the
// forms) and the server (to validate submissions and write the Asana card).
// To change a question, change it here. No React in this file.

export type FieldType =
  | "text" | "email" | "tel" | "url" | "number" | "money" | "percent"
  | "year" | "textarea" | "select" | "radio" | "checkboxes";

export type ShowIf = { field: string; equals?: string; includes?: string };

export type Field = {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  help?: string;
  placeholder?: string;
  showIf?: ShowIf;
  half?: boolean; // lays out two fields per row on desktop
};

export type Section = { title: string; intro?: string; showIf?: ShowIf; fields: Field[] };

export type PathId = "funding" | "accelerator" | "service" | "talk" | "community";

export type IntakeForm = {
  id: PathId;
  choice: string; // what the founder clicks on the Apply page
  choiceDetail: string;
  title: string;
  intro: string;
  minutes: number;
  sections: Section[];
  submitLabel: string;
  doneTitle: string;
  doneBody: string;
};

// ---- Shared option lists (kept identical to the Asana custom fields) -------

export const SALES_CHANNELS = ["Own site", "Amazon", "Wholesale/retail", "Brick-and-mortar", "Events/pop-ups", "Other"];
export const BOTTLENECKS = ["Cash/working capital", "Inventory planning", "Logistics", "Marketing/content", "Ops/systems", "Other"];
export const REVENUE_TREND = ["Up", "Flat", "Down"];
export const SERVICE_OPTIONS = [
  "3PL and returns",
  "Customer service",
  "Finance and fractional CFO",
  "Content",
  "Media buying",
  "Merchandising",
  "Inventory and demand planning",
  "Commerce systems and reporting",
];
const HEARD = ["Referral", "Souq Summit", "Office hours", "Portfolio company", "Instagram", "LinkedIn", "TikTok", "Google", "Other"];

const contact = (opts: { heardRequired?: boolean } = {}): Section => ({
  title: "About you",
  fields: [
    { id: "company", label: "Company name", type: "text", required: true, half: true },
    { id: "website", label: "Website or main store link", type: "url", required: true, half: true, placeholder: "yourbrand.com" },
    { id: "name", label: "Your name", type: "text", required: true, half: true },
    { id: "role", label: "Your role", type: "text", required: true, half: true, placeholder: "Founder, CEO" },
    { id: "email", label: "Email", type: "email", required: true, half: true },
    { id: "phone", label: "Phone", type: "tel", required: true, half: true },
    { id: "heard", label: "How did you hear about Souq?", type: "select", options: HEARD, required: opts.heardRequired ?? true },
  ],
});

// ---- The five paths ----------------------------------------------------

export const FORMS: Record<PathId, IntakeForm> = {
  funding: {
    id: "funding",
    choice: "Funding for inventory or cash flow",
    choiceDetail: "Souq Capital. Profit share, no interest, no equity.",
    title: "Apply for Souq Capital",
    intro: "Tell us about the business and what the funding is for. We review every application and reply within a few business days.",
    minutes: 6,
    submitLabel: "Submit application",
    doneTitle: "Application received.",
    doneBody: "Our team reviews every application. If it's a fit, we'll email you to set up an intro call and send a short list of documents to upload.",
    sections: [
      contact(),
      {
        title: "The business",
        fields: [
          { id: "sells", label: "What do you sell?", type: "text", required: true, placeholder: "Clean skincare, sold DTC and at Whole Foods" },
          { id: "model", label: "What would the funding pay for?", type: "radio", required: true,
            options: ["Inventory (physical products)", "A services contract or payroll"] },
          { id: "yearFounded", label: "Year the business started selling", type: "year", required: true, half: true },
          { id: "entity", label: "Legal entity name", type: "text", half: true, help: "As registered with the state, if different from the company name." },
          { id: "channels", label: "Where do you sell?", type: "checkboxes", required: true, options: SALES_CHANNELS },
          { id: "trend", label: "Revenue compared to last year", type: "radio", required: true, options: REVENUE_TREND },
        ],
      },
      {
        title: "The numbers",
        intro: "Best estimates are fine. We confirm everything later with documents.",
        fields: [
          { id: "revenue12", label: "Total revenue, last 12 months", type: "money", required: true, half: true },
          { id: "grossMargin", label: "Gross margin", type: "percent", required: true, half: true,
            help: "Revenue minus product cost and shipping/fulfillment, divided by revenue." },
          { id: "inventoryValue", label: "Inventory on hand today, at cost", type: "money", required: true, half: true,
            showIf: { field: "model", equals: "Inventory (physical products)" } },
          { id: "serviceVolume", label: "Average monthly revenue from the service being funded", type: "money", required: true, half: true,
            showIf: { field: "model", equals: "A services contract or payroll" } },
          { id: "adSpend", label: "Monthly ad spend", type: "money", half: true },
          { id: "debt", label: "Do you have any existing financing?", type: "checkboxes", required: true,
            options: ["None", "Bank loan or line of credit", "Merchant cash advance", "Revenue-based financing", "SBA / EIDL loan", "Credit cards", "Other"] },
          { id: "debtDetail", label: "Tell us about it: lender, balance, and whether it's secured against inventory", type: "textarea",
            showIf: { field: "debt", includes: "" } },
        ],
      },
      {
        title: "The request",
        fields: [
          { id: "amount", label: "How much are you looking for?", type: "money", required: true, half: true },
          { id: "timing", label: "When do you need it?", type: "select", required: true, half: true,
            options: ["As soon as possible", "Within 30 days", "1 to 3 months", "Just exploring"] },
          { id: "useOfFunds", label: "What will it pay for, specifically?", type: "textarea", required: true,
            placeholder: "A $120K production run for Q4, purchase order from Target attached later" },
          { id: "openPO", label: "Do you have an open purchase order or upcoming inventory buy?", type: "radio", options: ["Yes", "No"] },
          { id: "profitShareFit", label: "Souq is paid through a share of profit, not interest. Does that work for you?", type: "radio", required: true,
            options: ["Yes", "I'd like to learn more"] },
          { id: "alsoAccelerator", label: "Are you also interested in hands-on help from the Accelerator?", type: "radio",
            options: ["Yes", "No", "Maybe later"] },
          { id: "notes", label: "Anything else we should know?", type: "textarea" },
        ],
      },
    ],
  },

  accelerator: {
    id: "accelerator",
    choice: "Hands-on help growing my brand",
    choiceDetail: "The Souq Accelerator. A plan, monthly sessions, and operators who've done it.",
    title: "Apply to the Souq Accelerator",
    intro: "The Accelerator works with a small group of consumer brands at a time. This helps us understand where you are and where you're stuck.",
    minutes: 10,
    submitLabel: "Submit application",
    doneTitle: "Application received.",
    doneBody: "We'll review it and reach out to set up a conversation if it looks like a fit.",
    sections: [
      contact(),
      {
        title: "The brand",
        fields: [
          { id: "category", label: "Category", type: "select", required: true, half: true,
            options: ["Food and beverage", "Beauty and personal care", "Supplements and wellness", "Apparel", "Home and lifestyle", "Other"] },
          { id: "yearFounded", label: "Year founded", type: "year", required: true, half: true },
          { id: "channels", label: "Where do you sell?", type: "checkboxes", required: true, options: SALES_CHANNELS },
          { id: "customer", label: "Who is your core customer?", type: "textarea", required: true },
          { id: "whyWin", label: "What do you do better than the brands customers compare you to?", type: "textarea", required: true },
        ],
      },
      {
        title: "The numbers",
        fields: [
          { id: "revenueBand", label: "Revenue, last 12 months", type: "select", required: true, half: true,
            options: ["Under $500K", "$500K to $1M", "$1M to $3M", "$3M to $10M", "$10M+"] },
          { id: "trend", label: "Revenue compared to last year", type: "radio", required: true, options: REVENUE_TREND, half: true },
          { id: "grossMargin", label: "Approximate gross margin", type: "percent", half: true },
          { id: "adSpend", label: "Monthly ad spend", type: "money", half: true },
          { id: "repeat", label: "Do customers come back?", type: "radio", required: true,
            options: ["Yes, strong repeat buying", "Some, needs work", "Mostly one-time buyers"] },
        ],
      },
      {
        title: "How you operate",
        fields: [
          { id: "bottleneck", label: "Biggest bottleneck right now", type: "checkboxes", required: true, options: BOTTLENECKS },
          { id: "team", label: "Team size, including you", type: "text", required: true, half: true, placeholder: "3 full-time, 2 contractors" },
          { id: "founderFT", label: "Are you full-time on the business?", type: "radio", required: true, options: ["Yes", "No"], half: true },
          { id: "fulfillment", label: "How do you fulfill orders today?", type: "select", required: true,
            options: ["In-house", "A 3PL", "Amazon FBA", "A mix"] },
          { id: "manufacturing", label: "Where is your product made?", type: "radio", options: ["Domestic", "Overseas", "Both"] },
          { id: "upcoming", label: "Any big launch or season coming up?", type: "text", placeholder: "Ramadan, Black Friday, a new product" },
        ],
      },
      {
        title: "Working together",
        fields: [
          { id: "share", label: "If selected, which of these can you share?", type: "checkboxes",
            options: ["P&L", "Unit economics", "Manufacturing details", "Read-only Shopify access"] },
          { id: "handsOn", label: "How hands-on should we be?", type: "radio", required: true,
            options: ["Very hands-on, weekly execution", "Strategy and accountability", "Light touch"] },
          { id: "success", label: "What would make this a success for you six months from now?", type: "textarea", required: true },
          { id: "alsoFunding", label: "Do you also need funding from Souq Capital?", type: "radio", options: ["Yes", "No", "Not sure"] },
        ],
      },
    ],
  },

  service: {
    id: "service",
    choice: "Help with one part of my operations",
    choiceDetail: "Hire Souq for a single service, like fulfillment, media buying, or finance.",
    title: "Request a service",
    intro: "Pick what you need and answer a few questions about it. The lead for that service will reply with next steps.",
    minutes: 5,
    submitLabel: "Send request",
    doneTitle: "Request sent.",
    doneBody: "The lead for that service will reach out to set up a short scoping call.",
    sections: [
      contact(),
      {
        title: "What you need",
        fields: [
          { id: "services", label: "Which services?", type: "checkboxes", required: true, options: SERVICE_OPTIONS },
          { id: "monthlyRevenue", label: "Average monthly revenue", type: "money", required: true, half: true },
          { id: "start", label: "When do you want to start?", type: "select", required: true, half: true,
            options: ["Now", "Within 30 days", "1 to 3 months", "Exploring"] },
          { id: "channels", label: "Where do you sell?", type: "checkboxes", required: true, options: SALES_CHANNELS },
          { id: "why", label: "What's prompting this now?", type: "textarea", required: true },
        ],
      },
      {
        title: "Fulfillment",
        showIf: { field: "services", includes: "3PL and returns" },
        fields: [
          { id: "ordersMonth", label: "Orders shipped per month", type: "number", required: true, half: true },
          { id: "skus", label: "Number of active SKUs", type: "number", half: true },
          { id: "currentSetup", label: "Current warehouse or 3PL, and where", type: "text", required: true },
          { id: "fulfillCost", label: "What fulfillment costs you today (per order or per month)", type: "text", half: true },
          { id: "returns", label: "Returns per month", type: "number", half: true },
          { id: "inventoryTakeover", label: "Do you have inventory you'd need us to take over?", type: "radio", options: ["Yes", "No", "Arriving soon"] },
          { id: "handling", label: "Special handling", type: "checkboxes", options: ["Fragile", "Temperature controlled", "Kitting or bundles", "Oversized"] },
        ],
      },
      {
        title: "Merchandising and planning",
        showIf: { field: "services", includes: "Merchandising" },
        fields: [
          { id: "merchOutcome", label: "What's the main outcome you need, and by when?", type: "textarea", required: true,
            help: "Sales growth, stronger margin, clearing excess inventory, fewer stockouts, or a clearer assortment." },
          { id: "merchStructure", label: "Which categories and channels drive the business, and how is the assortment set up?", type: "textarea" },
          { id: "merchDecider", label: "Who makes buying decisions and approves the inventory budget?", type: "text" },
          { id: "merchReports", label: "Which of these can you pull by SKU?", type: "checkboxes",
            options: ["Sales", "Inventory", "Product cost", "Open purchase orders"] },
          { id: "merchPlanning", label: "Do you use any of these today?", type: "checkboxes",
            options: ["A sales forecast", "An approved buying budget", "An open-to-buy plan", "None yet"] },
        ],
      },
      {
        title: "Inventory and demand planning",
        showIf: { field: "services", includes: "Inventory and demand planning" },
        fields: [
          { id: "invValue", label: "Inventory on hand, at cost", type: "money", half: true },
          { id: "leadTime", label: "Average supplier lead time", type: "text", half: true },
          { id: "planMethod", label: "How do you plan buys today?", type: "radio", options: ["Spreadsheet", "Software", "Gut feel"] },
          { id: "stockouts", label: "Any stockouts or overstock in the last six months?", type: "textarea" },
        ],
      },
      {
        title: "Media buying",
        showIf: { field: "services", includes: "Media buying" },
        fields: [
          { id: "adSpend", label: "Monthly ad spend", type: "money", required: true, half: true },
          { id: "roas", label: "Current ROAS or cost per customer, if known", type: "text", half: true },
          { id: "platforms", label: "Platforms", type: "checkboxes", options: ["Meta", "Google", "TikTok", "Amazon", "Other"] },
          { id: "adsOwner", label: "Who runs ads today?", type: "radio", options: ["Founder", "In-house", "Agency"] },
          { id: "tracking", label: "Is tracking set up?", type: "checkboxes", options: ["Meta pixel", "Google Analytics", "Not sure"] },
        ],
      },
      {
        title: "Content",
        showIf: { field: "services", includes: "Content" },
        fields: [
          { id: "contentNeeds", label: "What do you need?", type: "checkboxes", options: ["Product photos", "Video ads", "Creator content", "Social management"] },
          { id: "contentLinks", label: "Where can we see your content today?", type: "text", placeholder: "Instagram, TikTok, Amazon links" },
          { id: "contentBudget", label: "Monthly content budget", type: "money", half: true },
          { id: "guidelines", label: "Do you have brand guidelines?", type: "radio", options: ["Yes", "No"], half: true },
        ],
      },
      {
        title: "Finance",
        showIf: { field: "services", includes: "Finance and fractional CFO" },
        fields: [
          { id: "books", label: "How are your books kept today?", type: "radio", options: ["QuickBooks or Xero, up to date", "QuickBooks or Xero, behind", "Spreadsheets", "Not really"] },
          { id: "financeNeed", label: "What do you need help with?", type: "checkboxes",
            options: ["Bookkeeping cleanup", "Monthly bookkeeping", "Cash flow forecasting", "Investor or lender reporting", "Taxes"] },
        ],
      },
    ],
  },

  talk: {
    id: "talk",
    choice: "Not sure yet, I'd like to talk first",
    choiceDetail: "Book office hours with the team and we'll point you to the right place.",
    title: "Request office hours",
    intro: "A 30-minute conversation with the Souq team. These answers let us skip the background and get straight to it.",
    minutes: 4,
    submitLabel: "Request office hours",
    doneTitle: "Request received.",
    doneBody: "We'll email you a few times that work for the team.",
    sections: [
      contact(),
      {
        title: "Before we talk",
        fields: [
          { id: "ask", label: "What do you most want to walk away with?", type: "textarea", required: true },
          { id: "sells", label: "What do you sell?", type: "text", required: true },
          { id: "basedShips", label: "Where are you based, and where do you ship from?", type: "text", required: true },
          { id: "channels", label: "Where do you sell?", type: "checkboxes", required: true, options: SALES_CHANNELS },
          { id: "team", label: "Who's on the team today?", type: "text", placeholder: "2 full-time, 1 contractor for ads" },
          { id: "bottleneck", label: "Biggest bottleneck right now", type: "checkboxes", required: true, options: BOTTLENECKS },
          { id: "revenue12", label: "Revenue, last 12 months", type: "money", half: true },
          { id: "trend", label: "Revenue compared to last year", type: "radio", options: REVENUE_TREND, half: true },
          { id: "inventoryValue", label: "Inventory on hand, rough value", type: "money", half: true },
          { id: "adSpend", label: "Monthly ad spend", type: "money", half: true },
          { id: "fulfillment", label: "Fulfillment setup and roughly what it costs a month", type: "text" },
          { id: "debt", label: "Any loans, credit lines, or other financing?", type: "text" },
        ],
      },
    ],
  },

  community: {
    id: "community",
    choice: "Join the Souq community",
    choiceDetail: "Free. Programming, resources, and founders building the same kind of company.",
    title: "Join the Souq community",
    intro: "Free to join. You'll hear about programming, the Summit, and resources from the team.",
    minutes: 1,
    submitLabel: "Join",
    doneTitle: "You're in.",
    doneBody: "We'll be in touch about upcoming programming.",
    sections: [
      {
        title: "About you",
        fields: [
          { id: "name", label: "Your name", type: "text", required: true, half: true },
          { id: "email", label: "Email", type: "email", required: true, half: true },
          { id: "company", label: "Company", type: "text", half: true },
          { id: "website", label: "Website", type: "url", half: true },
          { id: "building", label: "What are you building?", type: "textarea" },
        ],
      },
    ],
  },
};

export const PATH_ORDER: PathId[] = ["funding", "accelerator", "service", "talk", "community"];

// ---- Logic shared by browser and server ----------------------------------

export type Answers = Record<string, string | string[]>;

export function isShown(cond: ShowIf | undefined, a: Answers): boolean {
  if (!cond) return true;
  const v = a[cond.field];
  if (cond.equals !== undefined) return v === cond.equals;
  if (cond.includes !== undefined) {
    if (!Array.isArray(v)) return false;
    // includes "" means "any value other than None"
    if (cond.includes === "") return v.some((x) => x && x !== "None");
    return v.includes(cond.includes);
  }
  return true;
}

export function visibleFields(form: IntakeForm, a: Answers): Field[] {
  return form.sections.filter((s) => isShown(s.showIf, a)).flatMap((s) => s.fields.filter((f) => isShown(f.showIf, a)));
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns field id -> message. Empty object means valid. */
export function validate(form: IntakeForm, a: Answers): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of visibleFields(form, a)) {
    const v = a[f.id];
    const empty = v === undefined || (Array.isArray(v) ? v.length === 0 : String(v).trim() === "");
    if (empty) {
      if (f.required) errors[f.id] = f.type === "checkboxes" ? "Choose at least one." : "Required.";
      continue;
    }
    const s = Array.isArray(v) ? "" : String(v).trim();
    if (f.type === "email" && !EMAIL.test(s)) errors[f.id] = "Enter a valid email.";
    if ((f.type === "money" || f.type === "number") && !/^\d[\d,]*(\.\d+)?$/.test(s.replace(/^\$/, ""))) errors[f.id] = "Enter a number.";
    if (f.type === "percent" && !(Number(s.replace("%", "")) >= -100 && Number(s.replace("%", "")) <= 100)) errors[f.id] = "Enter a percentage, like 42.";
    if (f.type === "year" && !(/^\d{4}$/.test(s) && Number(s) >= 1900 && Number(s) <= new Date().getFullYear())) errors[f.id] = "Enter a four-digit year.";
    if (f.options && f.type !== "checkboxes" && !f.options.includes(s)) errors[f.id] = "Choose one of the options.";
    if (f.options && f.type === "checkboxes" && Array.isArray(v) && v.some((x) => !f.options!.includes(x))) errors[f.id] = "Choose from the options.";
    if (s.length > 4000) errors[f.id] = "Keep this under 4,000 characters.";
  }
  return errors;
}

export function display(f: Field, v: string | string[] | undefined): string {
  if (v === undefined || (Array.isArray(v) && v.length === 0) || v === "") return "";
  if (Array.isArray(v)) return v.join(", ");
  if (f.type === "money") return "$" + Number(String(v).replace(/[$,]/g, "")).toLocaleString("en-US");
  if (f.type === "percent") return `${String(v).replace("%", "")}%`;
  return String(v);
}

/** Every visible question and answer, grouped by section, as plain text. */
export function toText(form: IntakeForm, a: Answers): string {
  const out: string[] = [];
  for (const s of form.sections.filter((s) => isShown(s.showIf, a))) {
    out.push(s.title.toUpperCase());
    for (const f of s.fields.filter((f) => isShown(f.showIf, a))) {
      out.push(`${f.label}: ${display(f, a[f.id]) || "(not answered)"}`);
    }
    out.push("");
  }
  return out.join("\n");
}

export function fieldById(form: IntakeForm, id: string): Field | undefined {
  for (const s of form.sections) for (const f of s.fields) if (f.id === id) return f;
  return undefined;
}

// ---- Stage 2: documents requested after the intro call (funding only) ----

export type DocSlot = { id: string; label: string; help?: string; required?: boolean };

export const DOC_SLOTS: DocSlot[] = [
  { id: "pnl", label: "Profit and loss statements", help: "Last 3 years plus this year to date. Monthly detail if you have it.", required: true },
  { id: "balance", label: "Balance sheets", help: "Last 3 year-ends plus current.", required: true },
  { id: "bank", label: "Bank statements", help: "Last 12 months for every business account, all pages. 36 months if you have them.", required: true },
  { id: "tax", label: "Business tax returns", help: "Last 3 years, with all schedules." },
  { id: "salesMonthly", label: "Monthly sales, last 12 months", help: "A Shopify, Amazon, or accounting export is fine.", required: true },
  { id: "channelReports", label: "Sales by channel and by product", help: "Shopify net sales by channel and by product, Amazon sales by ASIN, if you sell there." },
  { id: "inventory", label: "Current inventory report", help: "By SKU, with quantity and cost. Include inventory aging if you have it." },
  { id: "skuRequest", label: "What the funding would buy", help: "Purchase orders, supplier invoices, or a sheet of SKUs, quantities, cost, and retail price." },
  { id: "debtDocs", label: "Loan or financing agreements", help: "Anything secured by inventory, receivables, or all business assets." },
  { id: "formation", label: "Company documents", help: "Articles of incorporation or organization, and the operating agreement." },
  { id: "other", label: "Anything else", help: "Contracts, decks, or anything that helps us understand the business." },
];

export const DOC_QUESTIONS: Field[] = [
  { id: "owners", label: "Who owns the company? List every owner and their percentage.", type: "textarea", required: true },
  { id: "suppliers", label: "Main suppliers, typical lead times, and payment terms", type: "textarea", required: true },
  { id: "debtSchedule", label: "All current debt and financing: lender, balance, payment, and what it's secured by", type: "textarea", required: true,
    help: "Write \"None\" if there isn't any." },
  { id: "sellThrough", label: "Roughly how long will it take to sell the inventory being funded?", type: "text" },
  { id: "risks", label: "What are the biggest risks to the business over the next 12 to 24 months?", type: "textarea" },
];

export const MAX_FILE_MB = 50;
