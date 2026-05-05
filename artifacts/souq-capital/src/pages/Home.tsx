import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const STEPS = [
  {
    num: "1",
    title: "Apply",
    sub: "Tell us your story",
    desc: "Share what your business does, what you're working toward, and how you plan to use the capital.",
  },
  {
    num: "2",
    title: "Review",
    sub: "We evaluate & align",
    desc: "We look at your trajectory and potential — then put together an offer built around your business.",
  },
  {
    num: "3",
    title: "Grow",
    sub: "Capital, deployed",
    desc: "Funds go directly to your vendor, contractor, or business — quickly and without friction.",
  },
];

const REVIEWS = [
  {
    quote: "Souq helped us scale without slowing down.",
    story:
      "Fith, a fast-growing fitness brand, used Souq to restock and launch new products — keeping full ownership throughout. Result: 3× revenue in 6 months.",
    company: "Fith",
    founder: "Rahim (Founder)",
    img: "https://framerusercontent.com/images/TKszLlD36vsYRwdnpx3i3GZrv0.png",
  },
  {
    quote: "We were able to fund our largest seasonal drop, on our terms.",
    story:
      "5Pillars used Souq to power a major Ramadan inventory run. The funding arrived fast and flexibly, helping them meet record demand while staying true to their values.",
    company: "5Pillars",
    founder: "Faruq (Founder)",
    img: "https://framerusercontent.com/images/0iklr3XneSnBaWuXShym3sAG5gA.jpeg",
  },
  {
    quote:
      "Working with Souq Capital has been one of the most transformative partnerships we've had.",
    story:
      "Souq helped Noun Naturals scale inventory for Q4 and stay true to their values — leading to 3× growth with confidence.",
    company: "Noun Naturals",
    founder: "Khaled (Founder)",
    img: "https://framerusercontent.com/images/TFkq9ylYIoCIrrstmwA8tANps.png",
  },
  {
    quote: "Souq gave us the confidence to say yes to a $100K+ contract.",
    story:
      "Skyward needed upfront capital to launch a major contract. Souq stepped in — the project was won, delivered, and everyone came out ahead.",
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
    q: "What kinds of businesses do you work with?",
    a: "We partner with product-based businesses and service businesses with contracts. If you have a clear path to revenue and need capital to move faster, we want to hear from you.",
  },
  {
    q: "How does Souq make money?",
    a: "We share in the profit when you sell — not before. We fund your inventory or contracts upfront, and we only get paid as your business earns.",
  },
  {
    q: "Do you take equity?",
    a: "No. You keep full ownership of your business. Always.",
  },
  {
    q: "Is this halal?",
    a: "Yes. Our model is built on profit-sharing — not interest. We're committed to funding that aligns with your values.",
  },
  {
    q: "How fast can I get funded?",
    a: "Once we've reviewed your application and agreed on terms, we move quickly. Most partners receive their capital within days, not weeks.",
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
        <span className="font-medium text-[#14181A] text-base pr-4">{q}</span>
        <span className="text-2xl text-muted-foreground group-hover:text-[#14181A] transition-colors flex-shrink-0">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p className="pb-6 text-muted-foreground leading-relaxed text-sm">{a}</p>
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
        className="relative min-h-screen grid-lines pt-20 overflow-hidden flex flex-col"
        data-testid="hero-section"
      >
        {/* Grid dividers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="max-w-7xl mx-auto h-full relative px-6">
            <div className="absolute left-[33.3%] top-0 bottom-0 w-px bg-black/6" />
            <div className="absolute left-[66.6%] top-0 bottom-0 w-px bg-black/6" />
          </div>
        </div>

        {/* Hero content */}
        <div className="flex-1 flex flex-col justify-end pb-24 px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Big word */}
              <div className="md:col-span-1 flex items-end">
                <h1
                  className="font-sans text-[#14181A] leading-none select-none hero-title"
                  data-testid="hero-title"
                >
                  Souq
                </h1>
              </div>

              {/* Tagline */}
              <div className="md:col-span-2 flex flex-col justify-end pb-4 md:pl-12">
                <p className="font-sans font-semibold leading-snug mb-3 hero-tagline">
                  Capital that moves at the speed of your ambition.
                </p>
                <p className="text-base text-[#14181A]/70 leading-relaxed max-w-lg">
                  We back founders who are building something worth backing — and we only win when you do.
                </p>
                <div className="mt-8 flex items-center gap-4">
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

        {/* Brand statement strip — replaces ticker */}
        <div className="border-t border-black/8 py-5 px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-x-12 gap-y-2 items-center">
            {["Built for founders", "Halal by design", "No equity taken", "Aligned incentives"].map((item, i) => (
              <span key={i} className="text-xs font-medium tracking-widest uppercase text-[#14181A]/40">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-32 px-6 border-b border-black/8" data-testid="about-section">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-16">About</p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="max-w-3xl">
              <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight text-[#14181A] mb-8">
                We partner with ambitious founders — and put our capital behind their vision.
              </h2>
              <p className="text-[#14181A]/60 text-lg leading-relaxed">
                Souq backs product and service businesses by funding what they need to grow. We move when you're ready, and we share in your success — not your stress.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-32 px-6 border-b border-black/8 bg-[#fafafa]" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">How it works</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#14181A] mb-4">Simple by design.</h2>
            <p className="text-muted-foreground mb-20 max-w-md">Three steps from application to funded — with no surprises in between.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-black/8 rounded-2xl overflow-hidden">
            {STEPS.map((step, i) => (
              <ScrollReveal key={i} delay={i * 100} className="border-b md:border-b-0 md:border-r border-black/8 last:border-r-0 p-10 bg-white">
                <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-xs font-bold text-[#14181A] mb-8">
                  {step.num}
                </div>
                <h3 className="font-heading font-bold text-xl text-[#14181A] mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground font-medium mb-4">{step.sub}</p>
                <p className="text-sm text-[#14181A]/70 leading-relaxed">{step.desc}</p>
              </ScrollReveal>
            ))}
            {/* Shared success step */}
            <ScrollReveal delay={300} className="p-10 bg-[#14181A] text-white">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold mb-8">
                ↗
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">We grow together</h3>
              <p className="text-xs text-white/50 font-medium mb-4">Shared success, no surprises</p>
              <p className="text-sm text-white/70 leading-relaxed">
                We earn a share of the upside as you sell — kept simple, transparent, and tied to your results.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO LOGOS ── */}
      <section className="py-20 px-6 border-b border-black/8 bg-white" data-testid="portfolio-section">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 text-center">Portfolio</p>
            <p className="text-center text-sm font-semibold text-[#14181A] mb-14">
              $5M Deployed · 13 Companies · Counting
            </p>
          </ScrollReveal>

          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {PORTFOLIO_LOGOS.map((src, i) => (
              <ScrollReveal key={i} delay={i * 60}>
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
      <section className="py-32 px-6 border-b border-black/8" data-testid="reviews-section">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Brand Stories</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#14181A] mb-4">
              From the founders we back.
            </h2>
            <p className="text-muted-foreground mb-16">
              Real businesses. Real results.
            </p>
          </ScrollReveal>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-2 gap-6">
            {REVIEWS.map((review, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div
                  className="border border-black/8 rounded-2xl p-10 bg-white hover:shadow-md transition-shadow duration-300 flex flex-col gap-4"
                  data-testid={`review-card-${i}`}
                >
                  <p className="text-[#14181A] font-medium text-base leading-snug">
                    "{review.quote}"
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{review.story}</p>
                  <div className="flex items-center gap-3 mt-auto pt-6 border-t border-black/6">
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
            <div
              className="border border-black/8 rounded-2xl p-8 bg-white"
              data-testid="review-mobile-card"
            >
              <p className="text-[#14181A] font-medium text-base leading-snug mb-3">
                "{REVIEWS[activeReview].quote}"
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {REVIEWS[activeReview].story}
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
      <section id="team" className="py-32 px-6 border-b border-black/8 bg-[#fafafa]" data-testid="team-section">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Team</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#14181A] mb-4">
              The people behind Souq.
            </h2>
            <p className="text-muted-foreground mb-20">
              10+ years experience · $40M+ raised · 300+ backers · 6 completed funds
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="flex flex-col" data-testid={`team-member-${i}`}>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-black/5 mb-5">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    {member.role}
                  </p>
                  <h3 className="font-heading font-bold text-[#14181A]">{member.name}</h3>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-32 px-6 border-b border-black/8" data-testid="faq-section">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">FAQs</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#14181A] mb-4">
              Common questions.
            </h2>
            <p className="text-muted-foreground mb-16">
              Straightforward answers to what founders ask us most.
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
      <section className="py-36 px-6 bg-[#14181A] text-white" data-testid="cta-section">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-8">Work With Us</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-10 leading-tight">
              Ready to build something bigger?
            </h2>
            <Link href="/apply" data-testid="cta-apply-btn">
              <button className="bg-white text-[#14181A] font-semibold px-10 py-4 rounded-xl hover:bg-white/90 transition-all duration-200 text-base">
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
