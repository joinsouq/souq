// Single source for how Souq is structured. The homepage, Services page and
// (later) the Apply router all read from here, so names stay consistent.

export type Level = {
  id: string;
  name: string;
  summary: string;
  forWho: string;
  href: string;
  cta: string;
};

// Ordered by depth of engagement: each level asks more of Souq than the last.
export const LEVELS: Level[] = [
  {
    id: "community",
    name: "Community",
    summary: "Programming, resources, and a room full of founders building the same kind of company.",
    forWho: "Any founder. Free to join.",
    href: "/community",
    cta: "Join the community",
  },
  {
    id: "services",
    name: "Services",
    summary: "Hire Souq for one part of the business, with a defined scope, owner, and price.",
    forWho: "Brands that know what they need.",
    href: "/services",
    cta: "See services",
  },
  {
    id: "accelerator",
    name: "Accelerator",
    summary: "A diagnostic, a 90-day plan, monthly working sessions, and quarterly reviews with operators who have scaled brands.",
    forWho: "Brands at $1M+ that want a plan and someone holding them to it.",
    href: "/accelerator",
    cta: "Explore the Accelerator",
  },
  {
    id: "operating-partnership",
    name: "Operating Partnership",
    summary: "A named Souq operating lead runs an agreed part of your back end. You keep the brand, product, and final say.",
    forWho: "Brands at $10M+ ready to hand over the operating load.",
    href: "/accelerator#operating-partnership",
    cta: "Talk to us about it",
  },
];

export const CAPITAL = {
  name: "Capital",
  summary: "Inventory and working capital on a profit share. No interest, no equity, and you repay as you sell.",
  forWho: "For brands at $200K+ in revenue, on its own or alongside any level.",
  href: "/capital",
  cta: "How Capital works",
};

export type Service = {
  id: string;
  name: string;
  summary: string;
  /** Shown when a founder opens the service. Placeholder copy until each
   *  vendor's capability one-pager comes in; swap these lines for theirs. */
  includes: string[];
  bestFor: string;
  /** Link to the vendor's one-pager (PDF), once we have it. */
  onePager?: string;
};

export const SERVICES: Service[] = [
  {
    id: "3pl", name: "3PL and returns",
    summary: "Storage, pick and pack, shipping, and returns handled from one warehouse.",
    includes: ["Receiving and storage", "Pick, pack, and ship", "Returns processing and restocking", "Order sync with your store"],
    bestFor: "Brands outgrowing a garage, a co-packer, or a 3PL that stopped answering.",
  },
  {
    id: "customer-service", name: "Customer service",
    summary: "Inbox and chat support that answers in your brand's voice.",
    includes: ["Email and chat inbox coverage", "Order, shipping, and returns questions", "Replies written in your brand's voice", "A weekly read on what customers are asking"],
    bestFor: "Founders still answering every ticket themselves.",
  },
  {
    id: "finance", name: "Finance and fractional CFO",
    summary: "Clean books, cash flow forecasts, and reporting you can take to investors.",
    includes: ["Monthly bookkeeping and close", "P&L, balance sheet, and cash flow", "A cash forecast you can plan buys around", "Investor and lender ready reporting"],
    bestFor: "Brands that need to know their numbers before the next buy or raise.",
  },
  {
    id: "content", name: "Content",
    summary: "Product photos, video, and creator content made for ads and social.",
    includes: ["Product and lifestyle photography", "Short-form video for ads and social", "Creator and UGC sourcing", "Assets cut to each channel's specs"],
    bestFor: "Brands whose ads are tired or whose product pages undersell the product.",
  },
  {
    id: "media-buying", name: "Media buying",
    summary: "Paid acquisition across Meta, Google, TikTok, and Amazon, measured on profit.",
    includes: ["Campaign setup and daily management", "Meta, Google, TikTok, and Amazon", "Daily spend and results reporting", "Budgets judged on profit, not clicks"],
    bestFor: "Brands spending on ads without a clear read on what it returns.",
  },
  {
    id: "merchandising", name: "Merchandising",
    summary: "Assortment, pricing, and margin planning so every SKU earns its place.",
    includes: ["Assortment and SKU review", "Pricing and margin planning", "Launch and drop calendars", "Line extensions that fit the brand"],
    bestFor: "Brands with a growing catalog and margins that are hard to see.",
  },
  {
    id: "inventory-planning", name: "Inventory and demand planning",
    summary: "Forecasts and buy plans that keep you in stock without tying up cash.",
    includes: ["SKU-level demand forecasts", "Buy plans and reorder points", "Purchase order tracking to the warehouse", "Stockout and overstock alerts"],
    bestFor: "Brands that keep selling out of winners and sitting on slow movers.",
  },
  {
    id: "commerce-systems", name: "Commerce systems and reporting",
    summary: "Shopify, integrations, and dashboards that show what is working.",
    includes: ["Shopify setup and cleanup", "Connecting apps, 3PL, and accounting", "Dashboards for sales, margin, and ads", "Automations that remove manual work"],
    bestFor: "Brands running on spreadsheets and copy-paste between tools.",
  },
];

// ---- Who qualifies, per tier (confirmed by Ahmad, Oct 23) -----------------
// Pricing stays off the site; the rate sheet is sent separately.

export type Criterion = { label: string; value: string };
export type TierCriteria = {
  id: "capital" | "accelerator" | "operating-partnership";
  name: string;
  /** The headline bar, shown large. */
  threshold: string;
  thresholdLabel: string;
  criteria: Criterion[];
};

export const CRITERIA: Record<TierCriteria["id"], TierCriteria> = {
  capital: {
    id: "capital",
    name: "Souq Capital",
    threshold: "$200K+",
    thresholdLabel: "in annual revenue",
    criteria: [
      { label: "Track record", value: "At least a year of sales data" },
      { label: "Business", value: "Inventory or service contracts. Working capital, not venture." },
      { label: "Margin", value: "Above 40%" },
      { label: "Ad spend", value: "Under 30% of revenue" },
      { label: "Existing debt", value: "None" },
      { label: "Location", value: "Based in the US" },
    ],
  },
  accelerator: {
    id: "accelerator",
    name: "Accelerator",
    threshold: "$1M+",
    thresholdLabel: "in annual revenue",
    criteria: [
      { label: "Operating", value: "At least one year" },
      { label: "Stage", value: "Focused on growth, not maintenance" },
      { label: "Founder", value: "A full-time operator in the business" },
      { label: "Location", value: "Open to brands anywhere" },
    ],
  },
  "operating-partnership": {
    id: "operating-partnership",
    name: "Operating Partnership",
    threshold: "$10M+",
    thresholdLabel: "in annual revenue",
    criteria: [
      { label: "Margin", value: "Above 50%" },
      { label: "Location", value: "A presence in the US" },
    ],
  },
};
