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
    forWho: "Founders who want a plan and someone holding them to it.",
    href: "/accelerator",
    cta: "Explore the Accelerator",
  },
  {
    id: "operating-partnership",
    name: "Operating Partnership",
    summary: "A named Souq operating lead runs an agreed part of your back end. You keep the brand, product, and final say.",
    forWho: "Companies ready to hand over the operating load.",
    href: "/accelerator#operating-partnership",
    cta: "Talk to us about it",
  },
];

export const CAPITAL = {
  name: "Capital",
  summary: "Inventory and working capital on a profit share. No interest, no equity, and you repay as you sell.",
  forWho: "Available on its own or alongside any level, with its own application.",
  href: "/capital",
  cta: "How Capital works",
};

export type Service = { id: string; name: string; summary: string };

export const SERVICES: Service[] = [
  { id: "3pl", name: "3PL and returns", summary: "Storage, pick and pack, shipping, and returns handled from one warehouse." },
  { id: "customer-service", name: "Customer service", summary: "Inbox and chat support that answers in your brand's voice." },
  { id: "finance", name: "Finance and fractional CFO", summary: "Clean books, cash flow forecasts, and reporting you can take to investors." },
  { id: "content", name: "Content", summary: "Product photos, video, and creator content made for ads and social." },
  { id: "media-buying", name: "Media buying", summary: "Paid acquisition across Meta, Google, TikTok, and Amazon, measured on profit." },
  { id: "merchandising", name: "Merchandising", summary: "Assortment, pricing, and margin planning so every SKU earns its place." },
  { id: "inventory-planning", name: "Inventory and demand planning", summary: "Forecasts and buy plans that keep you in stock without tying up cash." },
  { id: "commerce-systems", name: "Commerce systems and reporting", summary: "Shopify, integrations, and dashboards that show what is working." },
];
