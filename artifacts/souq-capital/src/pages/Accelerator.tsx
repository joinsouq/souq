import { useState, useEffect } from "react";
import { Link } from "wouter";
import ScrollReveal from "@/components/ScrollReveal";

const AT_A_GLANCE_BEST_FOR = [
  "Have $1M+ in revenue",
  "Are led by a strong founder-operator",
  "Have a $75M+ addressable market",
  "Are scaling in the U.S. or entering the U.S. market",
  "Have clear product differentiation (apparel is highly selective)",
];

const AT_A_GLANCE_WHAT_YOU_GET = [
  "Monthly financial and cash flow reviews",
  "Marketing and ad spend calibration",
  "Manufacturing and supply chain guidance",
  "Dedicated advisor access via Slack",
  "Quarterly strategic reviews",
  "Access to a vetted execution network",
  "Private founder community + annual summit",
];

const FAQS = [
  {
    q: "What is the Souq Accelerator?",
    a: "The Souq Accelerator is a founder-first growth program designed to help consumer brands move from early traction to scalable, market-leading businesses.\n\nMany promising brands don't fail because of ambition — they fail because founders are forced to navigate growth, operations, and capital efficiency alone. Souq exists to close that gap with practical, hands-on support from experienced operators.\n\nThis is an advisory-led accelerator with real execution behind it — not generic advice or short-term tactics.",
  },
  {
    q: "Who is it for?",
    a: "We work with a small, selective group of consumer brands that show strong fundamentals and clear potential to scale.\n\nIdeal companies typically have $1M+ in existing revenue, an exceptional founder-operator, a large defensible market opportunity ($75M+), clear product differentiation, and are either global brands entering the U.S. or U.S.-based brands scaling further. Apparel brands are considered on a highly selective basis.",
  },
  {
    q: "How does the program work?",
    a: "Souq is designed to stay close to founders while respecting their time.\n\nProgram structure includes monthly check-in calls with async advisor access, quarterly comprehensive strategy reviews, a dedicated Slack channel with the advisory team, a private Slack community with other Accelerator founders, an annual Founder Summit for high-growth brand builders, and a 30 and 60-day execution roadmap with a lead partner.\n\nThis model is built for ongoing momentum, not one-off advice.",
  },
];

const CORE_AREAS = [
  {
    label: "Financial Operations",
    items: [
      "Monthly review of financials and cash flow",
      "Capital efficiency and forecasting support",
      "Accounting and finance guidance",
    ],
  },
  {
    label: "Marketing",
    items: [
      "Review of ad spend vs. results with industry benchmarks",
      "Paid acquisition and funnel optimization",
      "Strategic calibration for growth-stage brands",
    ],
  },
  {
    label: "Product & Manufacturing",
    items: [
      "Manufacturing strategy and supply chain guidance",
      "Inventory planning, forecasting, and management",
      "Support across sourcing and production decisions",
    ],
  },
  {
    label: "Business Strategy",
    items: [
      "Overall growth and operating strategy",
      "Quarterly deep-dive reviews with the Accelerator team",
      "Annual strategic kickoff to align goals and priorities",
    ],
  },
];

function AcceleratorNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
      } border-b border-black/8`}
    >
      <div className="mx-auto h-16 flex items-center justify-between" style={{ maxWidth: "1320px", padding: "0 50px" }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-[#14181A] no-underline">
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2.5 14.5V7.5a5.5 5.5 0 0 1 11 0v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "-0.035em" }}>Souq</span>
          </Link>
          <span className="text-[#ccc]" style={{ fontSize: "16px", fontWeight: 300 }}>/</span>
          <span className="text-[#14181A]" style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em" }}>Accelerator</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          <a href="#at-a-glance" className="text-[#666] hover:text-black transition-colors" style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em" }}>
            At a Glance
          </a>
          <a href="#details" className="text-[#666] hover:text-black transition-colors" style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em" }}>
            Details
          </a>
          <a href="#join" className="text-[#666] hover:text-black transition-colors" style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em" }}>
            Join
          </a>
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <a href="#join">
            <button className="hidden md:block bg-[#14181A] text-white text-sm font-medium px-5 py-2 hover:bg-black/80 transition-all" style={{ borderRadius: "99px" }}>
              Apply
            </button>
          </a>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-[#14181A] mb-1" />
            <div className="w-5 h-0.5 bg-[#14181A] mb-1" />
            <div className="w-5 h-0.5 bg-[#14181A]" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-black/8 px-6 py-4 flex flex-col gap-4">
          <a href="#at-a-glance" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>At a Glance</a>
          <a href="#details" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Details</a>
          <a href="#join" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Join</a>
          <a href="#join">
            <button className="w-full border border-[#14181A] text-[#14181A] text-sm font-medium px-5 py-2 rounded-lg">Apply</button>
          </a>
        </div>
      )}
    </nav>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-black/8 cursor-pointer"
      onClick={() => setOpen((o) => !o)}
    >
      <div className="flex items-center justify-between py-6">
        <p style={{ fontSize: "17px", fontWeight: 600, letterSpacing: "-0.02em" }}>{q}</p>
        <span className="text-[#666] text-xl flex-shrink-0 ml-4">{open ? "−" : "+"}</span>
      </div>
      {open && (
        <div className="pb-6">
          {a.split("\n\n").map((para, i) => (
            <p key={i} className="text-[#555] mb-3 last:mb-0" style={{ fontSize: "16px", lineHeight: 1.7 }}>
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Accelerator() {
  return (
    <div className="min-h-screen bg-white text-[#14181A]">
      <AcceleratorNavbar />

      {/* Hero — dark full bleed */}
      <section className="bg-[#14181A] text-white" style={{ padding: "180px 50px 120px" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 700,
              letterSpacing: "-2px",
              lineHeight: 1.1,
              fontFamily: "Inter, sans-serif",
            }}
          >
            2026 Souq Accelerator Program
          </h1>
          <p
            className="mt-5 text-white/60"
            style={{
              fontSize: "clamp(18px, 2.5vw, 26px)",
              fontFamily: "monospace",
              letterSpacing: "0.02em",
              lineHeight: 1.4,
            }}
          >
            Accelerating consumer brands to market leaders
          </p>

          {/* Tab pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {[
              { label: "At a Glance", href: "#at-a-glance" },
              { label: "Give Me the Details", href: "#details" },
              { label: "Join the Accelerator", href: "#join" },
            ].map((tab) => (
              <a
                key={tab.label}
                href={tab.href}
                className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2.5 transition-colors"
                style={{ borderRadius: "99px" }}
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* At a Glance */}
      <section id="at-a-glance" style={{ padding: "100px 50px" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <ScrollReveal>
            <p className="section-label text-[#787777] mb-6">[ At a Glance ]</p>
            <p style={{ fontSize: "20px", lineHeight: 1.6, maxWidth: "680px", marginBottom: "64px", color: "#555" }}>
              Souq Accelerator is a high-touch, advisory-led program for consumer brand founders who are ready to scale.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ScrollReveal>
              <h3 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "24px" }}>
                Best for brands that:
              </h3>
              <ul className="flex flex-col gap-3" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {AT_A_GLANCE_BEST_FOR.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#14181A]" style={{ marginTop: "7px" }} />
                    <span style={{ fontSize: "17px", lineHeight: 1.6, color: "#444" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h3 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "24px" }}>
                What you get:
              </h3>
              <ul className="flex flex-col gap-3" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {AT_A_GLANCE_WHAT_YOU_GET.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#14181A]" style={{ marginTop: "7px" }} />
                    <span style={{ fontSize: "17px", lineHeight: 1.6, color: "#444" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <p
              className="mt-16 text-[#14181A]"
              style={{ fontSize: "18px", fontWeight: 600, letterSpacing: "-0.3px", maxWidth: "600px" }}
            >
              Souq is built for founders who want real execution, aligned incentives, and long-term brand growth.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Give me the Details */}
      <section id="details" style={{ padding: "100px 50px", background: "rgb(242,242,242)" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <ScrollReveal>
            <p className="section-label text-[#787777] mb-4">[ Give me the Details ]</p>
            <p style={{ fontSize: "20px", color: "#555", marginBottom: "56px", maxWidth: "580px", lineHeight: 1.6 }}>
              Everything you need to know about the Accelerator Program, and then some.
            </p>
          </ScrollReveal>

          {/* FAQ accordion */}
          <ScrollReveal>
            <div className="bg-white rounded-2xl px-10 mb-16" style={{ paddingTop: "8px", paddingBottom: "8px" }}>
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} {...faq} />
              ))}
            </div>
          </ScrollReveal>

          {/* Core Areas */}
          <ScrollReveal>
            <h3 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "32px" }}>
              Core Areas of Support
            </h3>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CORE_AREAS.map((area, i) => (
              <ScrollReveal key={area.label} delay={i * 80}>
                <div className="bg-white rounded-2xl p-8">
                  <p className="section-label text-[#787777] mb-3">{area.label}</p>
                  <ul className="flex flex-col gap-2.5 mt-4" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {area.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#14181A]" style={{ marginTop: "7px" }} />
                        <span style={{ fontSize: "16px", lineHeight: 1.6, color: "#444" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <p className="mt-12 text-[#555]" style={{ fontSize: "17px", lineHeight: 1.6 }}>
              Founders are supported by a trusted network that can execute at every stage of growth.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Join the Accelerator */}
      <section id="join" style={{ padding: "120px 50px", background: "#14181A" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto", textAlign: "center" }}>
          <ScrollReveal>
            <p className="section-label text-white/40 mb-6">[ Join the Accelerator ]</p>
            <h2
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 700,
                letterSpacing: "-2px",
                lineHeight: 1.1,
                color: "white",
                maxWidth: "640px",
                margin: "0 auto 24px",
              }}
            >
              Ready to scale?
            </h2>
            <p className="text-white/60 mb-10" style={{ fontSize: "18px", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto 40px" }}>
              If you're ready to move from traction to scale — with real support behind you — we'd love to learn more.
            </p>
            <a href="https://forms.fillout.com/t/gTxTHeoSKwus" target="_blank" rel="noopener noreferrer">
              <button
                className="bg-white text-[#14181A] font-semibold px-8 py-4 hover:bg-white/90 transition-colors"
                style={{ borderRadius: "99px", fontSize: "16px" }}
              >
                Apply to Accelerator →
              </button>
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/8 py-8" style={{ padding: "32px 50px" }}>
        <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4" style={{ maxWidth: "1320px" }}>
          <span className="section-label text-[#787777]">© {new Date().getFullYear()} Souq. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/"><span className="section-label text-[#787777] hover:text-[#14181A] transition-colors cursor-pointer">Home</span></Link>
            <Link href="/capital"><span className="section-label text-[#787777] hover:text-[#14181A] transition-colors cursor-pointer">Capital</span></Link>
            <Link href="/apply"><span className="section-label text-[#787777] hover:text-[#14181A] transition-colors cursor-pointer">Apply</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
