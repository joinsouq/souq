import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

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
      "Fith, a fast-growing fitness brand, used Souq to restock and launch new products — keeping full ownership throughout. Result: 3× revenue in 6 months.",
    company: "Fith",
    founder: "Rahim (Founder)",
    img: "https://framerusercontent.com/images/TKszLlD36vsYRwdnpx3i3GZrv0.png",
  },
  {
    quote: "We were able to fund our largest seasonal drop, on our terms.",
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
      "They provided over 6 figures at a critical moment. That funding helped us refresh our inventory, strengthen our operations, and bring new life into the brand. Halal funding, built on trust.",
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
    objectPosition: "center 35%",
  },
  {
    name: "Safeer Mohiuddin",
    role: "Investments",
    img: "https://framerusercontent.com/images/wlbcCEInWJWPq1JrypfGcqzv7c.png",
    objectPosition: "center top",
  },
  {
    name: "Bathool Syed",
    role: "Finance",
    img: "https://framerusercontent.com/images/XdNBxWXW7OmyJn0KTAaUPKRjTY.jpg",
    objectPosition: "center 30%",
  },
  {
    name: "Razi Mohiuddin",
    role: "Strategy",
    img: "https://framerusercontent.com/images/8TuXuezSSvm2mAcG6YRcxj9xU.webp",
    objectPosition: "center top",
  },
];

const FAQS = [
  {
    q: "What kinds of capital do you offer?",
    a: "We offer inventory financing and service contract funding. We pay your suppliers upfront on your behalf, and you pay us back as you sell — with a shared percentage of profit. No fixed payments, no interest.",
  },
  {
    q: "Is this a loan?",
    a: "No. Souq Capital provides non-debt working capital through a profit-sharing model. We only get repaid as you sell, and only take a percentage of profit on Souq inventory — never a fixed payment or interest rate.",
  },
  {
    q: "Do you take equity?",
    a: "No. You keep 100% ownership of your business. Souq Capital is not an investor — we're a capital partner.",
  },
  {
    q: "Is it halal?",
    a: "Yes. Our model is Sharia-compliant. We operate on a profit-sharing basis, not interest. No riba.",
  },
  {
    q: "What kind of businesses do you fund?",
    a: "We fund product-based businesses that need inventory capital, and service businesses with confirmed contracts. If you have a revenue cycle and a need for working capital, apply and let's talk.",
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

function FaqItem({ q, a, last }: { q: string; a: string; last?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        data-testid={`faq-${q.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`}
        className="w-full flex items-center justify-between py-6 px-8 text-left group"
      >
        <span className="font-medium text-[#333] text-base pr-4" style={{ fontSize: "16px" }}>{q}</span>
        <div
          className="flex-shrink-0 relative"
          style={{ width: "20px", height: "20px", opacity: 0.3 }}
        >
          {/* horizontal bar */}
          <div className="absolute" style={{ width: "14px", height: "2px", backgroundColor: "#000", borderRadius: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          {/* vertical bar — hidden when open */}
          {!open && (
            <div className="absolute" style={{ width: "2px", height: "14px", backgroundColor: "#000", borderRadius: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          )}
        </div>
      </button>
      {open && (
        <p className="px-8 pb-6 leading-relaxed text-[#333]" style={{ fontSize: "16px", opacity: 0.8 }}>{a}</p>
      )}
      {!last && (
        <div style={{ height: "1px", backgroundColor: "rgba(0,0,0,0.05)", margin: "0 0" }} />
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
        data-testid="hero-section"
        className="relative overflow-hidden flex flex-col"
        style={{ height: "100vh" }}
      >
        {/* Grid background lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <div className="absolute inset-0" style={{ maxWidth: "1320px", left: "50%", transform: "translateX(-50%)", position: "absolute" }}>
            <div className="absolute top-0 bottom-0 w-px" style={{ left: "25%", backgroundColor: "rgba(204,204,204,0.7)" }} />
            <div className="absolute top-0 bottom-0 w-px" style={{ left: "50%", backgroundColor: "rgba(204,204,204,0.7)" }} />
            <div className="absolute top-0 bottom-0 w-px" style={{ left: "75%", backgroundColor: "rgba(204,204,204,0.7)" }} />
          </div>
          <div className="absolute left-0 right-0 h-px" style={{ top: "33%", backgroundColor: "rgba(204,204,204,0.7)" }} />
          <div className="absolute left-0 right-0 h-px" style={{ top: "66%", backgroundColor: "rgba(204,204,204,0.7)" }} />
        </div>

        {/* Hero content */}
        <div className="flex-1 flex flex-col justify-end" style={{ padding: "120px 50px 160px", zIndex: 2 }}>
          <div style={{ maxWidth: "1320px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
            {/* Souq title — fixed 372px */}
            <div style={{ width: "372px", flexShrink: 0 }}>
              <h1
                className="hero-title text-[#14181A] leading-none select-none"
                data-testid="hero-title"
              >
                Souq
              </h1>
            </div>

            {/* Tagline — max 49% */}
            <div style={{ maxWidth: "49%" }} className="flex flex-col gap-2 pb-1">
              <p className="body-h3 font-semibold text-[#14181A]">
                <strong>Fuel your growth, without debt or dilution.</strong>
                <br />
                We fund what drives your business — and only win when you do.
              </p>
            </div>
          </div>

          {/* CTA row */}
          <div style={{ maxWidth: "1320px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", paddingTop: "24px" }}>
            <button
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="section-label text-[#14181A]/60 hover:text-[#14181A] transition-colors"
            >
              [ Scroll to learn more ]
            </button>
          </div>
        </div>
      </section>

      {/* ── ABOUT — What we do ── */}
      <section
        id="about"
        data-testid="about-section"
        className="border-b border-black/8"
        style={{ padding: "100px 50px" }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", flexDirection: "row", gap: "80px", alignItems: "flex-start" }}>
          <ScrollReveal style={{ flex: "0.6 0 0" }}>
            <div className="flex flex-col gap-3">
              <p className="section-label text-[#787777]">[ About ]</p>
              <p className="section-label text-[#14181A]">What we do for you</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100} style={{ flex: "1 0 0" }}>
            <div className="flex flex-col gap-4">
              <p className="body-h3 font-bold text-[#14181A]">Capital built to move your business forward.</p>
              <p className="body-p text-[#14181A]">Souq Capital partners with you by funding inventory and service contracts — unlocking cash flow so you can invest in marketing, operations, and scale your business with confidence.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── ABOUT — Why we do it ── */}
      <section
        id="why-we-do-it"
        className="border-b border-black/8"
        style={{ padding: "100px 50px" }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", flexDirection: "row", gap: "80px", alignItems: "flex-start" }}>
          <ScrollReveal style={{ flex: "0.6 0 0" }}>
            <p className="section-label text-[#14181A]">Why we do it</p>
          </ScrollReveal>
          <ScrollReveal delay={100} style={{ flex: "1 0 0" }}>
            <div className="flex flex-col gap-4">
              <p className="body-h3 font-bold text-[#14181A]">The funding world is broken.</p>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                <li>
                  <p className="body-p text-[#14181A]">Banks offer rigid loans with collateral</p>
                </li>
                <li>
                  <p className="body-p text-[#14181A]">VCs take ownership and control</p>
                </li>
                <li>
                  <p className="body-p text-[#14181A]">"Revenue-based" lenders still charge interest and expect fixed payments — even when you haven't been paid yet.</p>
                </li>
              </ul>
              <p className="body-p text-[#14181A]">We built Souq to match capital to revenue — with funding that moves at the speed of your business, not someone else's schedule.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        data-testid="how-it-works-section"
        className="border-b border-black/8"
        style={{ padding: "100px 50px" }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <ScrollReveal>
            <div className="flex flex-col gap-2 mb-12">
              <p className="section-label text-[#787777]">[ How it works ]</p>
              <h2 className="section-h2 text-[#14181A]">3 Easy Steps</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 border-t border-l border-black/8">
            {STEPS.map((step, i) => (
              <ScrollReveal
                key={i}
                delay={i * 80}
                className="border-b border-r border-black/8 p-8 flex flex-col gap-6 bg-white"
              >
                <p className="section-label text-[#787777]">[ {step.num} ]</p>
                <div className="flex flex-col gap-1">
                  <h3 className="body-h3 text-[#14181A]">{step.title}</h3>
                  <h4 className="step-h4 text-[#14181A]">{step.sub}</h4>
                </div>
                <p className="body-p text-[#666]">{step.desc}</p>
              </ScrollReveal>
            ))}

            {/* Dark repay card */}
            <ScrollReveal delay={240} className="border-b border-r border-black/8 p-8 flex flex-col gap-6 bg-[#14181A]">
              <p className="section-label text-white/70">[ Repay ]</p>
              <div className="flex flex-col gap-1">
                <h3 className="body-h3 text-white">Repay Souq</h3>
                <h4 className="step-h4 text-white/90">Shared profit as you sell</h4>
              </div>
              <p className="body-p text-white/80">
                Only pay when product sells. A monthly invoice for a small percentage of profit on Souq inventory.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── COMPARE ── */}
      <section
        id="compare"
        className="border-b border-black/8"
        style={{ padding: "100px 50px", backgroundColor: "#14181A" }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <ScrollReveal>
            <div className="flex flex-col gap-3 mb-12">
              <p className="section-label" style={{ color: "rgba(255,255,255,0.5)" }}>[ Compare ]</p>
              <h2 className="section-h2" style={{ color: "#fff" }}>Compare Your Options</h2>
              <p className="body-p" style={{ color: "rgba(255,255,255,0.6)" }}>
                Two ways to fund your business. Only one moves you forward.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Souq Capital card */}
            <ScrollReveal>
              <div className="rounded-[20px] bg-white p-10 flex flex-col gap-6 h-full">
                <h3 className="body-h3 font-semibold text-[#14181A]">Souq Capital</h3>
                <div className="flex flex-col gap-3">
                  {[
                    "Interest Free",
                    "Equity Free",
                    "Payback when you sell",
                    "Flexible Use (Goods & Services)",
                    "Aligned Incentives",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "rgba(31,181,103,0.25)", border: "1px solid rgb(31,181,103)" }}
                      >
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="rgb(31,181,103)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="body-p" style={{ color: "#101010", letterSpacing: "-0.04em" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Traditional Funding card */}
            <ScrollReveal delay={100}>
              <div className="rounded-[20px] p-10 flex flex-col gap-6 h-full" style={{ backgroundColor: "rgba(255,255,255,0.11)" }}>
                <h3 className="body-h3 font-semibold" style={{ color: "#fff" }}>Traditional Funding Types</h3>
                <div className="flex flex-col gap-3">
                  {[
                    "Bank Loans: High interest rates, Conflicts of interest",
                    "Venture Capital: Debt-ridden, Variable payback, Conflicts of interest",
                    "RBF / Lending Platforms: High interest rates, Rigid use (mostly inventory), Misaligned Values",
                    "Credit Cards / LOC: High interest rates, Variable payback, Rigid use, Conflicts of interest",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1 w-5 h-5">
                        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.799 2.161C18.067 2.431 18.067 2.867 17.799 3.137L12.422 8.514C12.154 8.784 12.154 9.221 12.422 9.491L17.796 14.869C18.064 15.14 18.064 15.576 17.796 15.847L15.839 17.799C15.567 18.067 15.132 18.067 14.86 17.799L9.488 12.422C9.217 12.154 8.781 12.154 8.51 12.422L3.133 17.796C2.863 18.065 2.426 18.065 2.156 17.796L0.201 15.841C-0.067 15.57-0.067 15.134 0.201 14.863L5.579 9.488C5.847 9.217 5.847 8.781 5.579 8.51L0.205 3.131C-0.064 2.861-0.064 2.424 0.205 2.154L2.162 0.2C2.433-0.067 2.869-0.067 3.14 0.201L8.512 5.578C8.782 5.847 9.219 5.847 9.489 5.579L14.866 0.205C15.137-0.063 15.573-0.063 15.844 0.205Z" fill="rgb(255,89,89)"/>
                        </svg>
                      </div>
                      <p className="body-p" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "-0.04em" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO LOGOS ── */}
      <section
        className="border-b border-black/8"
        data-testid="portfolio-section"
        style={{ padding: "100px 50px" }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <ScrollReveal>
            <p className="section-label text-[#787777] mb-4">Portfolio</p>
            <p className="step-h4 text-[#14181A] mb-16">
              $5M Invested | 13 Companies | 17 Investments
            </p>
          </ScrollReveal>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {PORTFOLIO_LOGOS.map((src, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <img
                  src={src}
                  alt={`Portfolio company ${i + 1}`}
                  className="h-8 md:h-10 object-contain grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  data-testid={`portfolio-logo-${i}`}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENT REVIEWS ── */}
      <section
        className="border-b border-black/8"
        data-testid="reviews-section"
        style={{ padding: "100px 50px" }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <ScrollReveal>
            <div className="flex flex-col gap-2 mb-12">
              <p className="section-label text-[#787777]">[ Testimonials ]</p>
              <h2 className="section-h2 text-[#14181A]">Client Reviews</h2>
            </div>
          </ScrollReveal>

          {/* Desktop 2×2 grid */}
          <div className="hidden md:grid grid-cols-2 gap-6">
            {REVIEWS.map((review, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div
                  className="border border-black/8 rounded-2xl p-10 bg-white hover:shadow-md transition-shadow duration-300 flex flex-col gap-4"
                  data-testid={`review-card-${i}`}
                >
                  <p className="body-h3 font-medium text-[#14181A] leading-snug">
                    "{review.quote}"
                  </p>
                  <p className="body-p text-[#666] leading-relaxed">{review.story}</p>
                  <div className="flex items-center gap-3 mt-auto pt-6 border-t border-black/6">
                    <img
                      src={review.img}
                      alt={review.company}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="section-label font-semibold text-[#14181A]">{review.company}</p>
                      <p className="section-label text-[#787777]">{review.founder}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Mobile carousel */}
          <div className="md:hidden">
            <div
              className="border border-black/8 rounded-2xl p-8 bg-white"
              data-testid="review-mobile-card"
            >
              <p className="body-p font-medium text-[#14181A] leading-snug mb-3">
                "{REVIEWS[activeReview].quote}"
              </p>
              <p className="body-p text-[#666] leading-relaxed mb-4">
                {REVIEWS[activeReview].story}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-black/6">
                <img
                  src={REVIEWS[activeReview].img}
                  alt={REVIEWS[activeReview].company}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="section-label font-semibold text-[#14181A]">{REVIEWS[activeReview].company}</p>
                  <p className="section-label text-[#787777]">{REVIEWS[activeReview].founder}</p>
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
      <section
        id="team"
        data-testid="team-section"
        className="border-b border-black/8"
        style={{ padding: "100px 50px" }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <ScrollReveal>
            <div className="flex flex-col gap-2 mb-16">
              <p className="section-label text-[#787777]">[ Team ]</p>
              <h2 className="section-h2 text-[#14181A]">The team behind Souq</h2>
              <p className="body-p text-[#666]">
                10+ years experience | 10 investment funds | 6 completed | $40M+ raised | 300+ investors
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="flex flex-col" data-testid={`team-member-${i}`}>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-black/5 mb-5">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      style={{ objectPosition: member.objectPosition }}
                    />
                  </div>
                  <p className="section-label text-[#787777] mb-1">{member.role}</p>
                  <h3 className="step-h4 text-[#14181A]">{member.name}</h3>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section
        data-testid="faq-section"
        className="border-b border-black/8"
        style={{ padding: "100px 50px" }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <ScrollReveal>
            <div className="flex flex-col gap-2 mb-12">
              <p className="section-label text-[#787777]">[ FAQs ]</p>
              <h2 className="section-h2 text-[#14181A]">Frequently Ask Questions</h2>
              <p className="body-p text-[#666]">
                Find answers to common questions about our services, process, and how Souq can help you achieve your goals.
              </p>
            </div>
          </ScrollReveal>

          <div
            style={{ backgroundColor: "rgb(242,242,242)", borderRadius: "20px", overflow: "hidden" }}
          >
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} last={i === FAQS.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        data-testid="cta-section"
        style={{ padding: "100px 50px" }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <ScrollReveal>
            <div
              className="rounded-[40px] bg-white border border-black/8 flex flex-col items-start gap-6 p-16"
              style={{ backgroundImage: "url(https://framerusercontent.com/images/PyLlmV1BoQoNCsiIPcTDPuDRja8.jpeg)", backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <p className="section-label" style={{ color: "rgb(48,48,48)" }}>[ WORK WITH US ]</p>
              <div className="bg-white rounded-[40px] p-12 flex flex-col gap-6 max-w-xl">
                <h2 className="section-h2 text-[#14181A]">Ready to grow your business with Souq? Apply today.</h2>
                <p className="body-p text-[#666]">Souq helps founders unlock growth without losing ownership or taking on risky loans.</p>
                <Link href="/apply" data-testid="cta-apply-btn">
                  <button className="bg-[#14181A] text-white font-medium px-6 py-3 hover:bg-black/80 transition-all duration-200 text-sm" style={{ borderRadius: "99px" }}>
                    Apply
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
