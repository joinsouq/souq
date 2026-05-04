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
    company: "Fith",
    founder: "Rahim (Founder)",
    img: "https://framerusercontent.com/images/TKszLlD36vsYRwdnpx3i3GZrv0.png",
  },
  {
    quote: "We were able to fund our largest seasonal drop, ethically.",
    company: "5Pillars",
    founder: "Faruq (Founder)",
    img: "https://framerusercontent.com/images/0iklr3XneSnBaWuXShym3sAG5gA.jpeg",
  },
  {
    quote: "Working with Souq Capital has been one of the most transformative partnerships we've had.",
    company: "Noun Naturals",
    founder: "Khaled (Founder)",
    img: "https://framerusercontent.com/images/TFkq9ylYIoCIrrstmwA8tANps.png",
  },
  {
    quote: "Souq gave us the confidence to say yes to a $100K+ contract.",
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

const COMPARE_FEATURES = [
  { label: "Interest-free",        souq: true,  bank: false, vc: false, rbf: false, cc: false },
  { label: "No equity taken",      souq: true,  bank: true,  vc: false, rbf: true,  cc: true  },
  { label: "Pay only when sold",   souq: true,  bank: false, vc: false, rbf: false, cc: false },
  { label: "No collateral",        souq: true,  bank: false, vc: true,  rbf: true,  cc: true  },
  { label: "Halal-aligned",        souq: true,  bank: false, vc: false, rbf: false, cc: false },
];

function Check({ yes }: { yes: boolean }) {
  return yes ? (
    <span className="text-green-500 font-bold text-base">✓</span>
  ) : (
    <span className="text-black/20 font-bold text-base">✗</span>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/8 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        data-testid={`faq-${q.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-medium text-[#14181A] text-base pr-4">{q}</span>
        <span className="text-2xl text-muted-foreground group-hover:text-[#14181A] transition-colors flex-shrink-0">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p className="pb-5 text-muted-foreground leading-relaxed text-sm">{a}</p>
      )}
    </div>
  );
}

export default function Home() {
  const [activeReview, setActiveReview] = useState(0);

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
        className="relative grid-lines pt-20 overflow-hidden flex flex-col"
        style={{ minHeight: "100vh" }}
        data-testid="hero-section"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="max-w-7xl mx-auto h-full relative px-6">
            <div className="absolute left-[33.3%] top-0 bottom-0 w-px bg-black/6" />
            <div className="absolute left-[66.6%] top-0 bottom-0 w-px bg-black/6" />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-end pb-16 px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="md:col-span-1 flex items-end">
                <h1
                  className="font-sans text-[#14181A] leading-none select-none hero-title"
                  data-testid="hero-title"
                >
                  Souq
                </h1>
              </div>

              <div className="md:col-span-2 flex flex-col justify-end pb-4 md:pl-12">
                <p className="font-sans font-semibold leading-snug mb-2 hero-tagline">
                  Fuel your growth, without debt or dilution.
                </p>
                <p className="text-base text-[#14181A]/70 leading-relaxed max-w-lg">
                  We fund what drives your business — and only win when you do.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <Link href="/apply" data-testid="hero-apply-btn">
                    <button className="bg-[#14181A] text-white font-medium px-6 py-3 rounded-lg hover:bg-black/80 transition-all duration-200 text-sm">
                      Apply Now
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-sm text-[#14181A]/60 hover:text-[#14181A] transition-colors flex items-center gap-1"
                  >
                    Learn more ↓
                  </button>
                </div>
              </div>
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
      <section id="about" className="py-24 px-6 border-b border-black/8" data-testid="about-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">About</p>
              <h2 className="section-heading text-[#14181A] mb-0">
                We fund what moves your business.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="flex flex-col justify-center h-full">
                <p className="text-[#14181A]/70 leading-relaxed mb-8">
                  Souq Capital partners with growing businesses by funding inventory and service contracts — so you can say yes to bigger orders, land larger contracts, and scale without selling equity or paying interest.
                </p>
                <ul className="space-y-4">
                  {[
                    { label: "Interest-free", desc: "We share in profit — never charge interest." },
                    { label: "No equity", desc: "You keep 100% of your company." },
                    { label: "Aligned incentives", desc: "We only win when you win." },
                  ].map((item) => (
                    <li key={item.label} className="flex gap-4">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#14181A] flex-shrink-0" style={{ marginTop: "8px" }} />
                      <div>
                        <span className="font-semibold text-[#14181A] text-sm">{item.label} </span>
                        <span className="text-[#14181A]/60 text-sm">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 border-b border-black/8 bg-[#fafafa]" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">How it works</p>
            <h2 className="section-heading text-[#14181A] mb-3">Simple from day one.</h2>
            <p className="text-muted-foreground mb-16 max-w-lg">Apply in minutes. Get funded fast. Repay only as you sell.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-black/8 rounded-2xl overflow-hidden">
            {STEPS.map((step, i) => (
              <ScrollReveal key={i} delay={i * 100} className="border-b md:border-b-0 md:border-r border-black/8 last:border-0 p-8 bg-white">
                <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-xs font-bold text-[#14181A] mb-6">
                  {step.num}
                </div>
                <h3 className="section-subheading text-[#14181A] mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground font-medium mb-3">{step.sub}</p>
                <p className="text-sm text-[#14181A]/70 leading-relaxed">{step.desc}</p>
              </ScrollReveal>
            ))}
            <ScrollReveal delay={300} className="p-8 bg-[#14181A] text-white">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold mb-6">
                ↩
              </div>
              <h3 className="section-subheading text-white mb-1">Repay Souq</h3>
              <p className="text-xs text-white/50 font-medium mb-3">Shared profit as you sell</p>
              <p className="text-sm text-white/70 leading-relaxed">
                Only pay when product sells. A monthly invoice for a small percentage of profit on Souq inventory.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── COMPARE ── */}
      <section className="py-24 px-6 border-b border-black/8" data-testid="compare-section">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Compare</p>
            <h2 className="section-heading text-[#14181A] mb-3">See how we stack up.</h2>
            <p className="text-muted-foreground mb-16">Two ways to fund your business. Only one moves you forward.</p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="border border-black/8 rounded-2xl overflow-hidden">
              {/* Header row */}
              <div className="grid grid-cols-6 bg-[#fafafa] border-b border-black/8">
                <div className="col-span-2 px-6 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Feature</div>
                <div className="px-4 py-4 text-xs font-semibold text-center text-[#14181A]">Souq</div>
                <div className="px-4 py-4 text-xs font-medium text-center text-muted-foreground">Bank</div>
                <div className="px-4 py-4 text-xs font-medium text-center text-muted-foreground">VC</div>
                <div className="px-4 py-4 text-xs font-medium text-center text-muted-foreground">RBF</div>
              </div>
              {/* Feature rows */}
              {COMPARE_FEATURES.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-6 border-b border-black/8 last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}
                >
                  <div className="col-span-2 px-6 py-4 text-sm font-medium text-[#14181A]">{row.label}</div>
                  <div className="px-4 py-4 flex justify-center items-center bg-[#14181A]/[0.03]"><Check yes={row.souq} /></div>
                  <div className="px-4 py-4 flex justify-center items-center"><Check yes={row.bank} /></div>
                  <div className="px-4 py-4 flex justify-center items-center"><Check yes={row.vc} /></div>
                  <div className="px-4 py-4 flex justify-center items-center"><Check yes={row.rbf} /></div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── PORTFOLIO LOGOS ── */}
      <section className="py-16 px-6 border-b border-black/8 bg-[#fafafa]" data-testid="portfolio-section">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 text-center">Portfolio</p>
            <p className="text-center text-sm font-semibold text-[#14181A] mb-10">
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
      <section className="py-24 px-6 border-b border-black/8" data-testid="reviews-section">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Brand Stories</p>
            <h2 className="section-heading text-[#14181A] mb-16">What our partners say.</h2>
          </ScrollReveal>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-2 gap-6">
            {REVIEWS.map((review, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div
                  className="border border-black/8 rounded-2xl p-8 bg-white hover:shadow-md transition-shadow duration-300 flex flex-col gap-6"
                  data-testid={`review-card-${i}`}
                >
                  <p className="text-[#14181A] font-medium text-lg leading-snug flex-1">
                    "{review.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-black/6">
                    <img
                      src={review.img}
                      alt={review.company}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm text-[#14181A]">{review.company}</p>
                      <p className="text-xs text-muted-foreground">{review.founder}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Mobile carousel */}
          <div className="md:hidden">
            <div className="border border-black/8 rounded-2xl p-6 bg-white" data-testid="review-mobile-card">
              <p className="text-[#14181A] font-medium text-base leading-snug mb-6">
                "{REVIEWS[activeReview].quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-black/6">
                <img
                  src={REVIEWS[activeReview].img}
                  alt={REVIEWS[activeReview].company}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-[#14181A]">{REVIEWS[activeReview].company}</p>
                  <p className="text-xs text-muted-foreground">{REVIEWS[activeReview].founder}</p>
                </div>
              </div>
            </div>
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
      <section id="team" className="py-24 px-6 border-b border-black/8 bg-[#fafafa]" data-testid="team-section">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Team</p>
            <h2 className="section-heading text-[#14181A] mb-3">Meet our team.</h2>
            <p className="text-muted-foreground mb-16">
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
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    {member.role}
                  </p>
                  <h3 className="font-semibold text-[#14181A]">{member.name}</h3>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-24 px-6 border-b border-black/8" data-testid="faq-section">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">FAQs</p>
            <h2 className="section-heading text-[#14181A] mb-3">Common questions.</h2>
            <p className="text-muted-foreground mb-12">
              Find answers to common questions about our services, process, and how Souq can help your business grow.
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
      <section className="py-28 px-6 bg-[#14181A] text-white" data-testid="cta-section">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-6">Work With Us</p>
            <h2 className="cta-heading text-white mb-4">Apply today.</h2>
            <p className="text-white/60 text-base mb-10 max-w-md mx-auto leading-relaxed">
              Join the businesses Souq has already funded — interest-free, equity-free, and on your terms.
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
