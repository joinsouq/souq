import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const TICKER_ITEMS = [
  "NO EQUITY", "NO INTEREST", "NO COLLATERAL", "NO FIXED PAYMENTS",
  "NO EQUITY", "NO INTEREST", "NO COLLATERAL", "NO FIXED PAYMENTS",
];

const STEPS = [
  {
    num: "1",
    title: "Apply",
    sub: "Apply in Minutes",
    desc: "Tell us about your revenue, cash cycle, and use of funds — inventory, services, or contract fulfillment.",
  },
  {
    num: "2",
    title: "Review",
    sub: "We Evaluate & Offer Terms",
    desc: "We review performance and approve capital for high-potential brands.",
  },
  {
    num: "3",
    title: "Grow Freely",
    sub: "You Get Funded",
    desc: "Funds are delivered to your vendor, contractor, or directly to your business — fast.",
  },
];

const REVIEWS = [
  {
    quote: "Souq helped us scale inventory without selling equity or stressing over interest payments.",
    story:
      "Fith, a fast-growing fitness brand, used Souq funding to restock and launch new products with no debt, no dilution. Result: 3× revenue in 6 months.",
    company: "Fith",
    founder: "Rahim (Founder)",
    img: "https://framerusercontent.com/images/TKszLlD36vsYRwdnpx3i3GZrv0.png",
  },
  {
    quote: "We were able to fund our largest seasonal drop, ethically.",
    story:
      "5Pillars used Souq to finance a major Ramadan inventory run. The funding arrived fast and flexibly, helping them meet record demand while staying true to their values.",
    company: "5Pillars",
    founder: "Faruq (Founder)",
    img: "https://framerusercontent.com/images/0iklr3XneSnBaWuXShym3sAG5gA.jpeg",
  },
  {
    quote:
      "Working with Souq Capital has been one of the most transformative partnerships we've had.",
    story:
      "Souq helped Noun Naturals scale inventory for Q4 and stay true to their values — leading to 3x growth without financial strain.",
    company: "Noun Naturals",
    founder: "Khaled (Founder)",
    img: "https://framerusercontent.com/images/TFkq9ylYIoCIrrstmwA8tANps.png",
  },
  {
    quote: "Souq gave us the confidence to say yes to a $100K+ contract.",
    story:
      "Skyward needed upfront funds to launch a big contract. Souq stepped in with stress-free, non-collateral capital — the project was won and delivered with ease.",
    company: "Skyward Building Services",
    founder: "Rudwan (President)",
    img: "https://framerusercontent.com/images/jgskvYZ0Y28pOB26fBlltLNY.png",
  },
];

const TEAM = [
  {
    name: "Ahmad Saleh",
    role: "Investments",
    img: "https://framerusercontent.com/images/X1IMUee8SEC5fnr7ZufgF5PpR4.png",
  },
  {
    name: "Safeer Mohiuddin",
    role: "Investments",
    img: "https://framerusercontent.com/images/wlbcCEInWJWPq1JrypfGcqzv7c.png",
  },
  {
    name: "Bathool Syed",
    role: "Finance",
    img: "https://framerusercontent.com/images/XdNBxWXW7OmyJn0KTAaUPKRjTY.jpg",
  },
  {
    name: "Razi Mohiuddin",
    role: "Strategy",
    img: "https://framerusercontent.com/images/8TuXuezSSvm2mAcG6YRcxj9xU.webp",
  },
];

const FAQS = [
  {
    q: "What kinds of capital do you offer?",
    a: "We offer inventory financing and service contract funding. We pay your vendor or contractor directly — or fund your business — and only get repaid as you sell.",
  },
  {
    q: "Is this a loan?",
    a: "No. Souq Capital does not lend money. We invest in your inventory or contracts and share in the profit when you sell. There are no fixed repayment schedules or interest charges.",
  },
  {
    q: "Do you take equity?",
    a: "No. We never take equity in your business. You remain fully in control of your company.",
  },
  {
    q: "Is it halal?",
    a: "Yes. Our model is structured to be interest-free and aligned with Islamic finance principles. We share in profit, not interest.",
  },
  {
    q: "What kind of businesses do you fund?",
    a: "We fund product-based businesses (e-commerce, retail, wholesale) and service businesses with contracts. If you have a clear revenue cycle and need capital to fulfill orders or contracts, we want to hear from you.",
  },
];

const PORTFOLIO_LOGOS = [
  "https://framerusercontent.com/images/d1M2yO4renIe63zyjHBGvVg75o.webp",
  "https://framerusercontent.com/images/plfphbwl2VPFGHJCrJnxiTvPk.png",
  "https://framerusercontent.com/images/xHiHBwNZlPz03R5HKkHDxly6ZQ.webp",
  "https://framerusercontent.com/images/5GXdEOmfvTNvT0MIpwbWAkZCLI.png",
  "https://framerusercontent.com/images/8az2aLMXTavJXOsnPew1WclT4E.png",
  "https://framerusercontent.com/images/YsRFY1L1lDMnMyAyAJxQAvt5I.png",
  "https://framerusercontent.com/images/WV5asNZ4yoIR2gVJUToJbado0.svg",
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/8 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        data-testid={`faq-${q.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="step-h4 text-[#14181A] pr-4">{q}</span>
        <span className="text-2xl text-[#787777] group-hover:text-[#14181A] transition-colors flex-shrink-0">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p className="pb-6 body-p">{a}</p>
      )}
    </div>
  );
}

export default function Home() {
  const [activeReview, setActiveReview] = useState(0);

  // Auto-advance review carousel
  useEffect(() => {
    const t = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % REVIEWS.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#14181A]">
      <Navbar />

      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative overflow-hidden flex flex-col"
        style={{ height: "100vh", paddingTop: "0" }}
        data-testid="hero-section"
      >
        {/* Grid dividers — 5 dividers (space-between) at 0%,25%,50%,75%,100% within max-width 1320px */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-stretch" style={{ padding: "0 50px" }}>
          <div className="flex-1 flex items-stretch" style={{ maxWidth: "1320px", margin: "0 auto", width: "100%" }}>
            <div className="absolute left-0 right-0" style={{ top: "33.33%", height: "1px", backgroundColor: "rgba(204,204,204,0.7)", left: "50px", right: "50px" }} />
            <div className="absolute left-0 right-0" style={{ top: "66.66%", height: "1px", backgroundColor: "rgba(204,204,204,0.7)", left: "50px", right: "50px" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(204,204,204,0.7)", left: "calc(50px + 25%)" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(204,204,204,0.7)", left: "calc(50px + 50%)" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(204,204,204,0.7)", left: "calc(50px + 75%)" }} />
          </div>
        </div>

        {/* Hero content — pushed to bottom, matching Framer's flex-end alignment */}
        <div className="flex-1 flex flex-col justify-end" style={{ padding: "120px 50px 24px", zIndex: 2 }}>
          <div style={{ maxWidth: "1320px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "48px" }}>
            {/* Souq + tagline row — space-between */}
            <div style={{ display: "flex", flexFlow: "row", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
              {/* Big word — fixed 372px */}
              <div style={{ flex: "none", width: "372px", overflow: "hidden" }}>
                <h1
                  className="font-sans text-[#14181A] leading-none select-none hero-title"
                  data-testid="hero-title"
                >
                  Souq
                </h1>
              </div>

              {/* Tagline — max 49% */}
              <div style={{ flex: "none", maxWidth: "49%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <p className="body-h3 mb-6">
                  <strong>Fuel your growth, without debt or dilution.</strong>
                  <br />
                  We fund what drives your business — and only win when you do.
                </p>
              </div>
            </div>

            {/* CTA row */}
            <div style={{ display: "flex", flexFlow: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <Link href="/apply" data-testid="hero-apply-btn">
                  <button className="bg-[#14181A] text-white font-medium px-6 py-3 rounded-lg hover:bg-black/80 transition-all duration-200 text-base">
                    Apply Now
                  </button>
                </Link>
              </div>
              <button
                onClick={() => {
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="section-label hover:text-[#14181A] transition-colors"
              >
                [ Scroll to learn more ]
              </button>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="border-t border-b border-black/8 bg-[#14181A] overflow-hidden py-3">
          <div className="flex animate-ticker whitespace-nowrap" style={{ width: "max-content" }}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="text-white text-xs font-medium tracking-widest uppercase px-8">
                {item} <span className="text-white/30 mx-2">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="border-b border-black/8" style={{ padding: "49px 50px 30px" }} data-testid="about-section">
        <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "80px" }}>
          <ScrollReveal>
            <p className="section-label">[ About ]</p>
          </ScrollReveal>

          <div style={{ display: "flex", flexFlow: "row", gap: "64px", width: "100%", alignItems: "flex-start" }} className="flex-col md:flex-row">
            <ScrollReveal style={{ flex: "0.6 0 0", minWidth: 0, display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <p className="step-h4 mb-6">What we do for you</p>
                <p className="about-heading mb-6">
                  Capital built to move your business forward.
                </p>
                <p className="body-p">
                  Souq Capital partners with you by funding inventory and service contracts — unlocking cash flow so you can invest in marketing, operations, and scale your business with confidence.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150} style={{ flex: "1 0 0", minWidth: 0, display: "flex", flexDirection: "column", gap: "25px" }}>
              <div>
                <p className="step-h4 mb-6">Why we do it</p>
                <p className="about-heading mb-6">
                  The funding world is broken.
                </p>
                <p className="body-h3 mb-4">
                  Banks offer rigid loans with collateral
                  <br />VCs take ownership and control
                  <br />"Revenue-based" lenders still charge interest and expect fixed payments — even when you haven't been paid yet.
                </p>
                <p className="body-h3">
                  We built Souq to match capital to revenue — with funding that moves at the speed of your business, not someone else's schedule.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="border-b border-black/8 bg-[#fafafa]" style={{ padding: "50px 50px 100px" }} data-testid="how-it-works-section">
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <ScrollReveal>
            <p className="section-label mb-4">[ How it works ]</p>
            <h2 className="section-h2 mb-4">3 Easy Steps</h2>
            <p className="body-p mb-16">A smarter way to fund your business's growth.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-black/8 rounded-2xl overflow-hidden">
            {STEPS.map((step, i) => (
              <ScrollReveal key={i} delay={i * 100} className="border-b md:border-b-0 md:border-r border-black/8 last:border-0 p-8 bg-white">
                <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-xs font-bold text-[#14181A] mb-6">
                  {step.num}
                </div>
                <p className="step-h4 mb-1">{step.title}</p>
                <p className="section-label mb-3">{step.sub}</p>
                <p className="body-p">{step.desc}</p>
              </ScrollReveal>
            ))}
            {/* Repay step */}
            <ScrollReveal delay={300} className="p-8 bg-[#14181A] text-white">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold mb-6">
                ↩
              </div>
              <p className="step-h4 text-white mb-1">Repay Souq</p>
              <p className="section-label text-white/50 mb-3">Shared profit as you sell</p>
              <p className="body-p text-white/70">
                Only pay when product sells. A monthly invoice for a small percentage of profit on Souq inventory.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── COMPARE ── */}
      <section className="border-b border-black/8" style={{ padding: "100px 50px" }} data-testid="compare-section">
        <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "64px" }}>
          <ScrollReveal>
            <p className="section-label mb-4">[ Compare ]</p>
            <h2 className="section-h2 mb-4">Compare Your Options</h2>
            <p className="body-p">Two ways to fund your business. Only one moves you forward.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Souq */}
            <ScrollReveal>
              <div className="bg-[#14181A] text-white rounded-2xl p-8 h-full">
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-sm font-medium mb-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Souq Capital
                </div>
                <ul className="space-y-4">
                  {["Interest Free", "Equity Free", "Payback when you sell", "Flexible Use (Goods & Services)", "Aligned Incentives"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center text-green-400 text-xs flex-shrink-0">✓</span>
                      <span className="body-p text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            {/* Traditional */}
            <ScrollReveal delay={100}>
              <div className="border border-black/8 rounded-2xl p-8 bg-white h-full">
                <div className="inline-flex items-center gap-2 bg-black/5 rounded-full px-3 py-1 text-sm font-medium text-[#787777] mb-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Traditional Funding Types
                </div>
                <ul className="space-y-6">
                  {[
                    { name: "Bank Loans", issues: "High interest rates, Conflicts of interest" },
                    { name: "Venture Capital", issues: "Debt-ridden, Variable payback, Conflicts of interest" },
                    { name: "RBF / Lending Platforms", issues: "High interest rates, Rigid use (mostly inventory), Misaligned Values" },
                    { name: "Credit Cards / LOC", issues: "High interest rates, Variable payback, Rigid use, Conflicts of interest" },
                  ].map((item) => (
                    <li key={item.name}>
                      <p className="step-h4 text-[#14181A]">{item.name}</p>
                      <p className="body-p mt-1">{item.issues}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO LOGOS ── */}
      <section className="border-b border-black/8 bg-[#fafafa]" style={{ padding: "50px 50px" }} data-testid="portfolio-section">
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <ScrollReveal>
            <p className="section-label text-center mb-2">[ Portfolio ]</p>
            <p className="text-center step-h4 text-[#14181A] mb-10">
              $5M Invested · 13 Companies · 17 Investments
            </p>
          </ScrollReveal>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {PORTFOLIO_LOGOS.map((src, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <img
                  src={src}
                  alt={`Portfolio company ${i + 1}`}
                  className="h-8 md:h-10 object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  data-testid={`portfolio-logo-${i}`}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENT REVIEWS ── */}
      <section className="border-b border-black/8" style={{ padding: "100px 50px" }} data-testid="reviews-section">
        <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "64px" }}>
          <ScrollReveal>
            <p className="section-label mb-4">[ Brand Stories ]</p>
            <h2 className="section-h2 mb-4">Client Reviews</h2>
            <p className="body-p">See what some of our partners say about Souq.</p>
          </ScrollReveal>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-2 gap-6">
            {REVIEWS.map((review, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div
                  className="border border-black/8 rounded-2xl p-8 bg-white hover:shadow-md transition-shadow duration-300 flex flex-col gap-4"
                  data-testid={`review-card-${i}`}
                >
                  <p className="body-h3 text-[#14181A]">
                    "{review.quote}"
                  </p>
                  <p className="body-p">{review.story}</p>
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-black/6">
                    <img
                      src={review.img}
                      alt={review.company}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm text-[#14181A]">{review.company}</p>
                      <p className="text-xs text-[#787777]">{review.founder}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Mobile carousel */}
          <div className="md:hidden">
            <div
              className="border border-black/8 rounded-2xl p-6 bg-white"
              data-testid="review-mobile-card"
            >
              <p className="body-h3 text-[#14181A] mb-3">
                "{REVIEWS[activeReview].quote}"
              </p>
              <p className="body-p mb-4">{REVIEWS[activeReview].story}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-black/6">
                <img
                  src={REVIEWS[activeReview].img}
                  alt={REVIEWS[activeReview].company}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-[#14181A]">{REVIEWS[activeReview].company}</p>
                  <p className="text-xs text-[#787777]">{REVIEWS[activeReview].founder}</p>
                </div>
              </div>
            </div>
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveReview(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeReview ? "bg-[#14181A]" : "bg-black/20"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="team" className="border-b border-black/8 bg-[#fafafa]" style={{ padding: "100px 50px" }} data-testid="team-section">
        <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "64px" }}>
          <ScrollReveal>
            <p className="section-label mb-4">[ Team ]</p>
            <h2 className="section-h2 mb-4">Meet Our Team</h2>
            <p className="body-p">
              10+ years experience · 10 investment funds · 6 completed · $40M+ raised · 300+ investors
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="flex flex-col" data-testid={`team-member-${i}`}>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-black/5 mb-4">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="section-label mb-1">{member.role}</p>
                  <p className="step-h4 text-[#14181A]">{member.name}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="border-b border-black/8" style={{ padding: "100px 50px" }} data-testid="faq-section">
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
          <ScrollReveal>
            <p className="section-label mb-4">[ FAQs ]</p>
            <h2 className="section-h2 mb-4">Frequently Asked Questions</h2>
            <p className="body-p">
              Find answers to common questions about our services, process, and how Souq can help you achieve your goals.
            </p>
          </ScrollReveal>

          <div className="border-t border-black/8">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#14181A] text-white" style={{ padding: "100px 50px" }} data-testid="cta-section">
        <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px", alignItems: "center", textAlign: "center" }}>
          <ScrollReveal>
            <p className="section-label text-white/40 mb-6">[ Work With Us ]</p>
            <h2 className="section-h2 text-white mb-6">
              Ready to grow your business with Souq?
              <span className="block text-white/50">Apply today.</span>
            </h2>
            <p className="body-p text-white/60 mb-10" style={{ maxWidth: "600px", margin: "0 auto 40px" }}>
              Souq helps founders unlock growth without losing ownership or taking on risky loans.
            </p>
            <Link href="/apply" data-testid="cta-apply-btn">
              <button className="bg-white text-[#14181A] font-semibold px-8 py-4 rounded-xl hover:bg-white/90 transition-all duration-200 text-base">
                Apply Now
              </button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
