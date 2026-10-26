// Intake forms, defined once and used by both the website (to render the
// forms) and the server (to validate submissions and write the Asana card).
// To change a question, change it here. No React in this file.

export type FieldType =
  | "text" | "email" | "tel" | "url" | "number" | "money" | "percent"
  | "year" | "textarea" | "select" | "radio" | "checkboxes";

export type ShowIf = { field: string; equals?: string; includes?: string; includesAny?: string[] };

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

export type PathId = "funding" | "accelerator" | "service" | "talk" | "community" | "3pl-onboarding";

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
export const BOTTLENECKS = ["Cash/working capital", "Inventory planning", "Logistics", "Marketing/content", "Ops/systems", "Team", "Other"];
export const REVENUE_TREND = ["Up", "Flat", "Down"];
const REVENUE_TREND_LONG = ["Up", "Flat", "Down", "Uneven or seasonal"];
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
    { id: "social", label: "Instagram or other social handle", type: "text", half: true, placeholder: "@yourbrand" },
    { id: "heard", label: "How did you hear about Souq?", type: "select", options: HEARD, required: opts.heardRequired ?? true, half: true },
  ],
});

const store: Field[] = [
  { id: "hasStore", label: "Do you have a physical store?", type: "radio", options: ["Yes", "No"], half: true },
  { id: "storeRent", label: "Total monthly rent across your stores", type: "money", half: true, showIf: { field: "hasStore", equals: "Yes" } },
];

// ---- The paths ------------------------------------------------------------

export const FORMS: Record<PathId, IntakeForm> = {
  funding: {
    id: "funding",
    choice: "Funding for inventory or cash flow",
    choiceDetail: "Souq Capital. Profit share, no interest, no equity.",
    title: "Apply for Souq Capital",
    intro: "Tell us about the business and what the funding is for. We review every application and reply within a few business days.",
    minutes: 7,
    submitLabel: "Submit application",
    doneTitle: "Application received.",
    doneBody: "Our team reviews every application. If it's a fit, we'll email you to set up an intro call and send a short list of documents to upload.",
    sections: [
      contact(),
      {
        title: "The business",
        fields: [
          { id: "sells", label: "What do you sell?", type: "text", required: true, placeholder: "Clean skincare, sold DTC and at Whole Foods" },
          { id: "businessType", label: "What kind of business is it?", type: "radio", required: true,
            options: ["A brand that makes its own products", "Distributor or wholesaler", "Retailer", "Services business", "Other"] },
          { id: "model", label: "Which best describes the funding need?", type: "radio", required: true,
            options: ["Inventory (physical products)", "A services contract or payroll"] },
          { id: "fundUses", label: "What would it pay for? Pick all that apply.", type: "checkboxes", required: true,
            options: ["An inventory purchase order", "Ad spend", "A services contract", "Payroll", "Waiting on customer payments (AR/PO)", "Other"] },
          { id: "yearFounded", label: "Year the business started selling", type: "year", required: true, half: true },
          { id: "hq", label: "Where is the business based?", type: "text", half: true, placeholder: "City, state" },
          { id: "entity", label: "Legal entity name", type: "text",
            help: "As registered with the state. If there's more than one brand or LLC, list them and say which is which." },
          { id: "channels", label: "Where do you sell?", type: "checkboxes", required: true, options: SALES_CHANNELS },
          { id: "topCustomers", label: "Your biggest customers or accounts, if any", type: "text", placeholder: "Whole Foods, 40 independent stores" },
          { id: "trend", label: "Revenue compared to last year", type: "radio", required: true, options: REVENUE_TREND },
          ...store,
        ],
      },
      {
        title: "The numbers",
        intro: "Best estimates are fine. We confirm everything later with documents.",
        fields: [
          { id: "revenue12", label: "Total revenue, last 12 months", type: "money", required: true, half: true },
          { id: "salesYTD", label: "Sales so far this year", type: "money", half: true },
          { id: "grossMargin", label: "Gross margin", type: "percent", required: true, half: true,
            help: "Revenue minus product cost and shipping/fulfillment, divided by revenue." },
          { id: "inventoryValue", label: "Inventory on hand today, at cost", type: "money", required: true, half: true,
            showIf: { field: "model", equals: "Inventory (physical products)" } },
          { id: "serviceVolume", label: "Average monthly revenue from the service being funded", type: "money", required: true, half: true,
            showIf: { field: "model", equals: "A services contract or payroll" } },
          { id: "adSpend", label: "Monthly ad spend", type: "money", half: true },
          { id: "cashCycle", label: "Days from paying your supplier to getting paid by customers", type: "select", half: true,
            options: ["Under 30", "30 to 60", "60 to 90", "90+", "Not sure"] },
          { id: "debt", label: "Do you have any existing financing?", type: "checkboxes", required: true,
            options: ["None", "Bank loan or line of credit", "Merchant cash advance", "Revenue-based financing", "SBA / EIDL loan", "Credit cards", "Other"] },
          { id: "debtDetail", label: "Tell us about it: lender, balance, and whether it's secured against inventory or receivables", type: "textarea",
            showIf: { field: "debt", includes: "" } },
          { id: "equity", label: "Have you raised outside equity?", type: "radio", required: true,
            options: ["No", "Yes, friends and family", "Yes, angels or funds"] },
        ],
      },
      {
        title: "The request",
        fields: [
          { id: "amount", label: "How much are you looking for?", type: "money", required: true, half: true },
          { id: "timing", label: "When do you need it?", type: "select", required: true, half: true,
            options: ["As soon as possible", "Within 30 days", "1 to 3 months", "Just exploring"] },
          { id: "recurring", label: "Is this a one-time need?", type: "radio", required: true,
            options: ["One-time", "Seasonal", "Every order cycle"] },
          { id: "useOfFunds", label: "What will it pay for, specifically, and what's the goal?", type: "textarea", required: true,
            placeholder: "A $120K production run for Q4 so we can fill the Target order" },
          { id: "openPO", label: "Do you have an open purchase order or upcoming inventory buy?", type: "radio", options: ["Yes", "No"] },
          { id: "poDetail", label: "Amount and expected delivery date", type: "text", showIf: { field: "openPO", equals: "Yes" } },
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
    minutes: 15,
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
          { id: "categoryOther", label: "Which category?", type: "text", half: true, showIf: { field: "category", equals: "Other" } },
          { id: "yearFounded", label: "Year founded", type: "year", required: true, half: true },
          { id: "hq", label: "Headquarters", type: "text", required: true, half: true, placeholder: "City, state" },
          { id: "channels", label: "Where do you sell?", type: "checkboxes", required: true, options: SALES_CHANNELS },
          { id: "customer", label: "Who is your core customer?", type: "textarea", required: true },
        ],
      },
      {
        title: "You and the story",
        fields: [
          { id: "whyStart", label: "Why did you start this company?", type: "textarea", required: true },
          { id: "suited", label: "What makes you uniquely suited to build it?", type: "textarea" },
          { id: "keepsUp", label: "What keeps you up at night about the business right now?", type: "textarea" },
        ],
      },
      {
        title: "Market",
        fields: [
          { id: "compareTo", label: "Who do customers compare you to most often?", type: "text", required: true },
          { id: "problem", label: "What problem do you solve better than the alternatives?", type: "textarea", required: true },
          { id: "whyWin", label: "Why will you win long-term in this category?", type: "textarea" },
          { id: "tam", label: "Rough size of the market, if you know it", type: "text" },
        ],
      },
      {
        title: "The numbers",
        fields: [
          { id: "revenueBand", label: "Revenue, last 12 months", type: "select", required: true, half: true,
            options: ["Under $500K", "$500K to $1M", "$1M to $3M", "$3M to $10M", "$10M+"] },
          { id: "trend", label: "Revenue compared to last year", type: "radio", required: true, options: REVENUE_TREND_LONG, half: true },
          { id: "grossMargin", label: "Approximate gross margin", type: "percent", half: true },
          { id: "adSpend", label: "Monthly marketing spend (average of the last 3 months)", type: "money", half: true },
          { id: "inventoryCover", label: "Inventory on hand, and roughly how many months it covers", type: "text", placeholder: "$180K, about 4 months" },
          { id: "repeat", label: "Do customers come back?", type: "radio", required: true,
            options: ["Yes, strong repeat buying", "Some, needs work", "Mostly one-time buyers"] },
        ],
      },
      {
        title: "Growth",
        fields: [
          { id: "acquisition", label: "Main ways you get customers today", type: "checkboxes", required: true,
            options: ["Paid social", "Organic social", "Influencers", "Email/SMS", "Retail", "Wholesale", "Other"] },
          { id: "working", label: "What's working best for growth right now?", type: "textarea" },
          { id: "didntWork", label: "What have you tried that didn't work?", type: "textarea" },
        ],
      },
      {
        title: "How you operate",
        fields: [
          { id: "bottleneck", label: "Biggest bottleneck right now", type: "checkboxes", required: true, options: BOTTLENECKS },
          { id: "team", label: "Team size, including you", type: "text", required: true, half: true, placeholder: "3 full-time, 2 contractors" },
          { id: "founderFT", label: "Are you full-time on the business?", type: "radio", required: true, options: ["Yes", "No"], half: true },
          { id: "deciders", label: "Who else makes decisions?", type: "text", placeholder: "Co-founders, partners, or investors" },
          { id: "opsOwner", label: "Who runs operations today?", type: "radio", options: ["Founder", "In-house team", "Agencies or contractors", "A mix"] },
          { id: "fulfillment", label: "How do you fulfill orders today?", type: "select", required: true, half: true,
            options: ["In-house", "A 3PL", "Amazon FBA", "A mix"] },
          { id: "tplName", label: "Which 3PL?", type: "text", half: true, showIf: { field: "fulfillment", equals: "A 3PL" } },
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
          { id: "whyNow", label: "Why is now the right time to accelerate?", type: "textarea", required: true },
          { id: "unlock90", label: "What should we help you unlock in the first 90 days?", type: "textarea" },
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
    minutes: 6,
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
          { id: "shipTo", label: "Where do you ship to?", type: "checkboxes", options: ["Customers (DTC)", "Amazon", "Wholesale and retail"] },
          { id: "packageSize", label: "Average package size and weight", type: "text", half: true },
          { id: "peak", label: "Busiest month, and orders that month", type: "text", half: true },
          { id: "storePlatforms", label: "Store platforms we'd connect to", type: "checkboxes", options: ["Shopify", "Amazon", "Walmart", "TikTok Shop", "Other"] },
          { id: "inventoryTakeover", label: "Do you have inventory you'd need us to take over?", type: "radio", options: ["Yes", "No", "Arriving soon"] },
          { id: "takeoverDetail", label: "Roughly how many units or pallets, and where it's stored now", type: "text",
            showIf: { field: "inventoryTakeover", equals: "Yes" } },
          { id: "handling", label: "Special handling", type: "checkboxes", options: ["Fragile", "Temperature controlled", "Kitting or bundles", "Oversized"] },
        ],
      },
      {
        title: "Merchandising, inventory, and planning",
        showIf: { field: "services", includesAny: ["Merchandising", "Inventory and demand planning"] },
        fields: [
          { id: "merchOutcome", label: "What's the main business outcome you need, and by when?", type: "textarea", required: true,
            help: "Sales growth, stronger gross margin, freeing up cash from excess inventory, fewer stockouts, or a clearer assortment." },
          { id: "merchStructure", label: "Which categories and channels drive the business, and who is the target customer?", type: "textarea",
            help: "Which products are core and replenished, which are seasonal, and when are your big launches and selling periods?" },
          { id: "merchDecider", label: "Who makes buying decisions, approves the inventory budget, and carries out the plan?", type: "text" },
          { id: "merchRole", label: "Do you want Souq to advise, or to do the work?", type: "radio", options: ["Advise", "Do the work", "Both"] },
          { id: "skusMerch", label: "Number of active SKUs", type: "number", half: true },
          { id: "invValue", label: "Inventory on hand, at cost", type: "money", half: true },
          { id: "planMethod", label: "How do you plan inventory buys today?", type: "radio", options: ["Spreadsheet", "Software", "Gut feel"] },
          { id: "leadTime", label: "Average supplier lead time", type: "text", half: true },
          { id: "moq", label: "Supplier minimum order quantities", type: "text", half: true },
          { id: "posPerYear", label: "Purchase orders placed per year", type: "number", half: true },
          { id: "stockouts", label: "Any stockouts or overstock in the last six months?", type: "textarea" },
          { id: "merchReports", label: "Which of these can you pull by SKU?", type: "checkboxes",
            options: ["Sales", "Inventory", "Product cost", "Open purchase orders"] },
          { id: "merchSystem", label: "Which system do those reports come from?", type: "text", placeholder: "Shopify, NetSuite, a spreadsheet" },
          { id: "merchTracking", label: "Do you track any of these today?", type: "checkboxes",
            options: ["Product gross margin", "Discounts", "Sell-through", "Inventory turnover"] },
          { id: "merchPlanning", label: "Do you use any of these today?", type: "checkboxes",
            options: ["A sales forecast", "An approved buying budget", "An open-to-buy plan", "None yet"] },
          { id: "merchCommitted", label: "If you have them: inventory already committed at cost, expected receipt dates, payments due, and remaining buying budget", type: "textarea" },
        ],
      },
      {
        title: "Media buying",
        showIf: { field: "services", includes: "Media buying" },
        fields: [
          { id: "adSpend", label: "Monthly ad spend", type: "money", required: true, half: true },
          { id: "adShare", label: "Share of sales that comes from ads", type: "percent", half: true },
          { id: "roas", label: "Current ROAS or cost per customer, if known", type: "text" },
          { id: "platforms", label: "Platforms", type: "checkboxes", options: ["Meta", "Google", "TikTok", "Amazon", "Other"] },
          { id: "adsOwner", label: "Who runs ads today?", type: "radio", options: ["Founder", "In-house", "Agency"] },
          { id: "tracking", label: "Is tracking set up?", type: "checkboxes", options: ["Meta pixel", "Google Analytics", "Not sure"] },
          { id: "adAccess", label: "Can you give us access to your ad accounts?", type: "radio", options: ["Yes", "After we talk"] },
        ],
      },
      {
        title: "Content",
        showIf: { field: "services", includes: "Content" },
        fields: [
          { id: "contentLinks", label: "Where can we see you online today?", type: "text", placeholder: "Website, Instagram, TikTok, YouTube, or Amazon links" },
          { id: "followers", label: "Roughly how many followers across your main channels?", type: "text", half: true },
          { id: "founderCreator", label: "Are you, the founder, a creator with your own audience?", type: "radio", half: true,
            options: ["Yes", "No", "Starting to build one"] },
          { id: "influencers", label: "Do you work with influencers or creators today?", type: "checkboxes", options: ["Paid", "Gifted product", "Affiliates", "Not yet"] },
          { id: "contentCustomer", label: "Who is your customer?", type: "text" },
          { id: "contentMaker", label: "Who makes your content today?", type: "radio", options: ["Founder", "In-house", "Freelancer", "Agency"] },
          { id: "postFreq", label: "How often do you post?", type: "text", half: true },
          { id: "assetsMonth", label: "Assets needed per month", type: "text", half: true },
          { id: "contentNeeds", label: "What do you need?", type: "checkboxes", options: ["Product photos", "Video ads", "Creator content (UGC)", "Social management"] },
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
          ...store,
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

  // Not on /apply: the team sends this link once a fulfillment client signs.
  // Replaces the Zite 3PL onboarding form.
  "3pl-onboarding": {
    id: "3pl-onboarding",
    choice: "3PL onboarding",
    choiceDetail: "",
    title: "Souq fulfillment onboarding",
    intro: "Tell us about your business and fulfillment needs so we can get you set up quickly and accurately.",
    minutes: 8,
    submitLabel: "Submit onboarding form",
    doneTitle: "Got it.",
    doneBody: "The fulfillment team will follow up within 1 to 2 business days.",
    sections: [
      {
        title: "Business information",
        fields: [
          { id: "company", label: "Full legal company name", type: "text", required: true,
            help: "If there's more than one company name, say whether they're brands under the same company or separate LLCs." },
          { id: "website", label: "Primary website or store", type: "url", required: true, half: true },
          { id: "address", label: "Principal business address", type: "text", required: true, half: true },
          { id: "name", label: "Your name", type: "text", required: true, half: true },
          { id: "email", label: "Email", type: "email", required: true, half: true },
          { id: "phone", label: "Phone", type: "tel", half: true },
        ],
      },
      {
        title: "Sales and operations",
        fields: [
          { id: "sellChannels", label: "Selling channels", type: "checkboxes", required: true, options: ["Shopify", "Amazon", "TikTok Shop", "Wholesale", "Other"] },
          { id: "skus", label: "Total active SKUs", type: "number", required: true, half: true },
          { id: "unitsPerOrder", label: "Average units per order", type: "number", required: true, half: true },
          { id: "ordersMonth", label: "Expected monthly orders, next 6 to 12 months", type: "number", required: true, half: true },
          { id: "platform", label: "Current order management or fulfillment platform", type: "text", required: true, half: true },
        ],
      },
      {
        title: "Fulfillment requirements",
        fields: [
          { id: "packing", label: "Any special packing requirements?", type: "textarea" },
          { id: "branded", label: "Any branded packaging or inserts?", type: "text" },
          { id: "carriers", label: "Any carrier requirements or preferred shipping methods?", type: "text" },
          { id: "returnsProcess", label: "Returns process requirements", type: "textarea" },
          { id: "initialInventory", label: "Estimated initial inventory", type: "text", required: true,
            help: "Number of pallets, cartons, or total units you'll send at first." },
          { id: "barcodes", label: "Are your products barcoded?", type: "select", required: true,
            options: ["Yes, all barcoded", "Partially barcoded", "No, they need labeling"] },
          { id: "kitting", label: "Any kitting, bundling, or prep?", type: "text" },
        ],
      },
      {
        title: "Timeline and billing",
        fields: [
          { id: "goLive", label: "Target go-live date", type: "text", required: true, half: true },
          { id: "billingContact", label: "Billing contact", type: "text", required: true, half: true },
          { id: "billingEmail", label: "Billing email", type: "email", required: true },
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
  if (cond.includesAny) return Array.isArray(v) ? v.some((x) => cond.includesAny!.includes(x)) : cond.includesAny.includes(String(v ?? ""));
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
// Covers everything the old "Souq Inventory Request" Fillout form asked.

export type DocSlot = { id: string; label: string; help?: string; required?: boolean; template?: { href: string; label: string } };

export const DOC_SLOTS: DocSlot[] = [
  { id: "pnl", label: "Profit and loss statements", help: "Last 3 years plus this year to date. Monthly detail if you have it.", required: true },
  { id: "balance", label: "Balance sheets", help: "Last 3 year-ends plus current.", required: true },
  { id: "bank", label: "Bank statements", help: "Last 12 months for every business account, all pages. 36 months if you have them.", required: true },
  { id: "tax", label: "Business tax returns", help: "Last 3 years, with all schedules." },
  { id: "salesMonthly", label: "Monthly sales, last 12 months", help: "A Shopify, Amazon, or accounting export is fine.", required: true },
  { id: "channelReports", label: "Sales by channel and by product", help: "Shopify net sales by sales channel and by product. Amazon sales and orders by ASIN, if you sell there." },
  { id: "productReports", label: "Product performance", help: "Shopify gross profit by product variant, inventory sold this year by SKU, and sales history for your best-selling SKUs." },
  { id: "inventory", label: "Current inventory report", help: "By SKU, with quantity and cost. Include inventory aging, or Amazon's Inventory Health report, if you have it." },
  { id: "skuRequest", label: "What the funding would buy", required: true,
    help: "One row per product: quantity, cost per unit, retail price, fulfillment cost, gross profit per unit, delivery date, and sell-by date. Purchase orders or supplier invoices help too.",
    template: { href: "/souq-sku-request-template.csv", label: "Download the template" } },
  { id: "debtDocs", label: "Loan or financing agreements", help: "Anything secured by inventory, receivables, or all business assets." },
  { id: "formation", label: "Company documents", help: "Articles of incorporation or organization, and the operating agreement." },
  { id: "other", label: "Anything else", help: "Contracts, decks, or anything that helps us understand the business." },
];

export const DOC_SECTIONS: Section[] = [
  {
    title: "Ownership and capital",
    fields: [
      { id: "owners", label: "Who owns the company? List every owner and their percentage.", type: "textarea", required: true },
      { id: "equityRaised", label: "Equity raised so far: how much, from whom, and when", type: "textarea", required: true,
        help: "Write \"None\" if you haven't raised any." },
      { id: "debtSchedule", label: "All current debt and financing: lender, balance, payment, and what it's secured by", type: "textarea", required: true,
        help: "Write \"None\" if there isn't any." },
    ],
  },
  {
    title: "Advertising",
    fields: [
      { id: "adPctRevenue", label: "Ad spend as a share of revenue", type: "percent", required: true, half: true },
      { id: "adPctSales", label: "Share of sales driven by ads", type: "percent", required: true, half: true },
    ],
  },
  {
    title: "Where sales come from",
    intro: "Rough percentages are fine.",
    fields: [
      { id: "pctDomestic", label: "Domestic", type: "percent", half: true },
      { id: "pctInternational", label: "International", type: "percent", half: true },
      { id: "pctShopify", label: "Shopify / own site", type: "percent", half: true },
      { id: "pctAmazon", label: "Amazon", type: "percent", half: true },
      { id: "pctTiktok", label: "TikTok Shop", type: "percent", half: true },
      { id: "pctEtsy", label: "Etsy", type: "percent", half: true },
      { id: "pctWholesale", label: "Wholesale and retail", type: "percent", half: true },
      { id: "pctOther", label: "Other", type: "percent", half: true },
    ],
  },
  {
    title: "Inventory and operations",
    fields: [
      { id: "warehouse", label: "Where is your inventory stored?", type: "radio", required: true,
        options: ["Our own warehouse", "A 3PL", "Both", "Neither"] },
      { id: "tplDetail", label: "3PL name and location", type: "text", showIf: { field: "warehouse", includesAny: ["A 3PL", "Both"] } },
      { id: "invSoftware", label: "Inventory management software", type: "text", half: true },
      { id: "purchaseFreq", label: "How often do you buy inventory?", type: "select", half: true,
        options: ["Weekly", "Every two weeks", "Monthly", "Quarterly", "Other"] },
      { id: "supplierCount", label: "Number of suppliers", type: "number", half: true },
      { id: "suppliers", label: "Main suppliers, typical lead times, and payment terms", type: "textarea", required: true },
      { id: "sellThrough", label: "Roughly how long will it take to sell the inventory being funded?", type: "text", required: true },
    ],
  },
  {
    title: "Risks",
    fields: [
      { id: "risks", label: "What are the biggest risks to the business over the next 12 to 24 months?", type: "textarea" },
    ],
  },
];

export const DOC_QUESTIONS: Field[] = DOC_SECTIONS.flatMap((s) => s.fields);

/** Which paths get the document upload page. */
export type DocPath = "funding" | "accelerator";
export const DOC_PATHS: DocPath[] = ["funding", "accelerator"];

// Funding-only items Accelerator founders aren't asked for.
const FUNDING_ONLY_SLOTS = ["skuRequest", "debtDocs"];

/** The document list for a path. Accelerator gets the funding list minus the funding-only items. */
export const docSlotsFor = (path: DocPath | string | undefined): DocSlot[] =>
  path === "accelerator" ? DOC_SLOTS.filter((s) => !FUNDING_ONLY_SLOTS.includes(s.id)) : DOC_SLOTS;

/** Works out the path from an Asana card's description ("Submitted ... via the website: <choice>"). */
export const docPathFromNotes = (notes: unknown): DocPath =>
  String(notes || "").includes(FORMS.accelerator.choice) ? "accelerator" : "funding";

export const MAX_FILE_MB = 50;
