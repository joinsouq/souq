import { useState, useEffect } from "react";
import { Link } from "wouter";
import ScrollReveal from "@/components/ScrollReveal";
import SouqLogo from "@/components/SouqLogo";

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
    <nav className={`accelerator-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="accelerator-nav-inner">
        {/* Breadcrumb */}
        <div className="accelerator-breadcrumb">
          <Link href="/" className="accelerator-logo-link">
            <SouqLogo variant="white" className="accelerator-logo" />
          </Link>
          <span className="accelerator-slash">/</span>
          <span className="accelerator-current">Operating Stack</span>
        </div>

        {/* Desktop nav */}
        <div className="accelerator-desktop-links">
          <a href="#at-a-glance">
            At a Glance
          </a>
          <a href="#details">
            Details
          </a>
          <a href="#join">
            Join
          </a>
        </div>

        {/* CTA + mobile toggle */}
        <div className="accelerator-nav-actions">
          <a href="#join" className="accelerator-nav-apply">
            Apply
          </a>
          <button className="accelerator-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="accelerator-mobile-menu">
          <a href="#at-a-glance" onClick={() => setMenuOpen(false)}>At a Glance</a>
          <a href="#details" onClick={() => setMenuOpen(false)}>Details</a>
          <a href="#join" onClick={() => setMenuOpen(false)}>Join</a>
          <a href="#join" onClick={() => setMenuOpen(false)} className="accelerator-mobile-apply">Apply</a>
        </div>
      )}
    </nav>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="accelerator-faq-item"
      onClick={() => setOpen((o) => !o)}
    >
      <div className="accelerator-faq-question">
        <p>{q}</p>
        <span>{open ? "−" : "+"}</span>
      </div>
      {open && (
        <div className="accelerator-faq-answer">
          {a.split("\n\n").map((para, i) => (
            <p key={i}>
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
    <div className="accelerator-page">
      <AcceleratorNavbar />

      {/* Hero — dark full bleed */}
      <section className="accelerator-hero">
        <div className="accelerator-container accelerator-hero-inner">
          <div>
            <p className="accelerator-eyebrow">Souq · Operating Stack · 2026</p>
            <h1>2026 Souq Accelerator Program</h1>
          </div>
          <div className="accelerator-hero-side">
            <p>Accelerating consumer brands to market leaders.</p>
            <span>Advisory-led support, built around the work.</span>
          </div>

          {/* Tab pills */}
          <div className="accelerator-hero-links">
            {[
              { label: "At a Glance", href: "#at-a-glance" },
              { label: "Give Me the Details", href: "#details" },
              { label: "Join the Accelerator", href: "#join" },
            ].map((tab) => (
              <a
                key={tab.label}
                href={tab.href}
              >
                {tab.label}
                <span>↘</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* At a Glance */}
      <section id="at-a-glance" className="accelerator-section accelerator-glance">
        <div className="accelerator-container">
          <ScrollReveal>
            <p className="accelerator-label">At a Glance</p>
            <p className="accelerator-lede">
              Souq Accelerator is a high-touch, advisory-led program for consumer brand founders who are ready to scale.
            </p>
          </ScrollReveal>

          <div className="accelerator-columns">
            <ScrollReveal>
              <h3>
                Best for brands that:
              </h3>
              <ul>
                {AT_A_GLANCE_BEST_FOR.map((item) => (
                  <li key={item}>
                    <span />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h3>
                What you get:
              </h3>
              <ul>
                {AT_A_GLANCE_WHAT_YOU_GET.map((item) => (
                  <li key={item}>
                    <span />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <p className="accelerator-callout">
              Souq is built for founders who want real execution, aligned incentives, and long-term brand growth.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Give me the Details */}
      <section id="details" className="accelerator-section accelerator-details">
        <div className="accelerator-container">
          <ScrollReveal>
            <p className="accelerator-label">The details</p>
            <p className="accelerator-lede">
              How the Accelerator works, where we focus, and what founders can expect.
            </p>
          </ScrollReveal>

          {/* FAQ accordion */}
          <ScrollReveal>
            <div className="accelerator-faq">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} {...faq} />
              ))}
            </div>
          </ScrollReveal>

          {/* Core Areas */}
          <ScrollReveal>
            <h3 className="accelerator-subheading">
              Core Areas of Support
            </h3>
          </ScrollReveal>
          <div className="accelerator-core-grid">
            {CORE_AREAS.map((area, i) => (
              <ScrollReveal key={area.label} delay={i * 80}>
                <div className="accelerator-core-card">
                  <p className="accelerator-label">{area.label}</p>
                  <ul>
                    {area.items.map((item) => (
                      <li key={item}>
                        <span />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <p className="accelerator-network-note">
              Founders are supported by a trusted network that can execute at every stage of growth.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Join the Accelerator */}
      <section id="join" className="accelerator-section accelerator-join">
        <div className="accelerator-container">
          <ScrollReveal>
            <p className="accelerator-label">For high-growth companies</p>
            <h2>
              Ready to become a market leader?
            </h2>
            <p className="accelerator-join-copy">
              The Souq Accelerator works with a selective group of high-growth consumer companies ready to scale with real support behind them. If that's your company, apply to start the conversation.
            </p>
            <a href="https://forms.fillout.com/t/gTxTHeoSKwus" target="_blank" rel="noopener noreferrer">
              <button className="accelerator-primary-button">
                Apply to the Accelerator →
              </button>
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="accelerator-footer">
        <div className="accelerator-container accelerator-footer-inner">
          <span>© {new Date().getFullYear()} Souq. All rights reserved.</span>
          <div>
            <Link href="/">Home</Link>
            <Link href="/capital">Capital</Link>
            <Link href="/apply">Apply</Link>
          </div>
        </div>
      </footer>
      <style>{`
        .accelerator-page {
          min-height: 100svh;
          overflow-x: hidden;
          background: oklch(0.155 0.004 285);
          color: oklch(0.965 0.002 285);
          font-family: 'Inter', ui-sans-serif, -apple-system, sans-serif;
          font-feature-settings: "cv02" 1, "cv03" 1, "cv04" 1, "ss01" 1;
          -webkit-font-smoothing: antialiased;
        }
        .accelerator-container {
          width: min(100% - 2.5rem, 82.5rem);
          margin: 0 auto;
        }
        .accelerator-nav {
          position: fixed;
          inset: 0 0 auto;
          z-index: 50;
          color: oklch(0.965 0.002 285);
          background: oklch(0.155 0.004 285 / .94);
          border-bottom: 1px solid oklch(0.27 0.005 285);
          backdrop-filter: blur(14px);
        }
        .accelerator-nav-inner {
          width: min(100% - 2.5rem, 82.5rem);
          min-height: 5.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          margin: 0 auto;
        }
        .accelerator-breadcrumb,
        .accelerator-nav-actions,
        .accelerator-desktop-links {
          display: flex;
          align-items: center;
        }
        .accelerator-breadcrumb { gap: .65rem; }
        .accelerator-logo-link { display: inline-flex; color: inherit; text-decoration: none; }
        .accelerator-logo { width: 7rem; }
        .accelerator-slash { color: oklch(0.5 0.006 285); font-size: 1rem; }
        .accelerator-current { color: oklch(0.72 0.006 285); font-size: .82rem; letter-spacing: -.02em; }
        .accelerator-desktop-links { gap: 2.5rem; margin-left: auto; margin-right: 2.75rem; }
        .accelerator-desktop-links a,
        .accelerator-mobile-menu a,
        .accelerator-footer a {
          color: oklch(0.68 0.006 285);
          font-size: .78rem;
          text-decoration: none;
          transition: color .2s ease;
        }
        .accelerator-desktop-links a:hover,
        .accelerator-mobile-menu a:hover,
        .accelerator-footer a:hover { color: oklch(0.965 0.002 285); }
        .accelerator-nav-actions { gap: 1rem; }
        .accelerator-nav-apply,
        .accelerator-primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: oklch(0.18 0.006 285);
          background: var(--souq-coral);
          border: 0;
          text-decoration: none;
          font-size: .8rem;
          font-weight: 600;
          transition: transform .2s ease, background .2s ease;
        }
        .accelerator-nav-apply { min-height: 2.35rem; padding: 0 1rem; }
        .accelerator-nav-apply:hover,
        .accelerator-primary-button:hover { background: var(--souq-peach); transform: translateY(-2px); }
        .accelerator-menu-button { display: none; padding: .45rem; border: 0; background: transparent; }
        .accelerator-menu-button span { display: block; width: 1.2rem; height: 1px; margin: .28rem 0; background: oklch(0.88 0.002 285); }
        .accelerator-mobile-menu { display: none; }
        .accelerator-hero {
          position: relative;
          padding: clamp(9rem, 18vh, 13rem) 0 clamp(5rem, 10vh, 8rem);
          border-bottom: 1px solid oklch(0.27 0.005 285);
          background:
            linear-gradient(90deg, transparent 24.9%, oklch(0.27 0.005 285 / .4) 25%, transparent 25.1%, transparent 74.9%, oklch(0.27 0.005 285 / .4) 75%, transparent 75.1%),
            radial-gradient(circle at 88% 18%, color-mix(in srgb, var(--souq-coral) 22%, transparent), transparent 30rem);
        }
        .accelerator-hero-inner {
          display: grid;
          grid-template-columns: 1.4fr .6fr;
          gap: 3rem;
          align-items: end;
        }
        .accelerator-eyebrow,
        .accelerator-label {
          margin: 0 0 1.5rem;
          color: var(--souq-coral);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: .78rem;
          letter-spacing: .1em;
          line-height: 1.4;
          text-transform: uppercase;
        }
        .accelerator-hero h1 {
          max-width: 11ch;
          margin: 0;
          font-size: clamp(4rem, 8.6vw, 8rem);
          font-weight: 400;
          letter-spacing: -.08em;
          line-height: .88;
        }
        .accelerator-hero-side { max-width: 20rem; padding-bottom: .3rem; }
        .accelerator-hero-side p {
          margin: 0 0 1rem;
          color: oklch(0.9 0.002 285);
          font-size: clamp(1.1rem, 1.8vw, 1.45rem);
          letter-spacing: -.045em;
          line-height: 1.1;
        }
        .accelerator-hero-side span { color: oklch(0.58 0.006 285); font-size: 1rem; line-height: 1.5; }
        .accelerator-hero-links {
          grid-column: 1 / -1;
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-top: 3rem;
          padding-top: 1rem;
          border-top: 1px solid oklch(0.27 0.005 285);
        }
        .accelerator-hero-links a {
          display: inline-flex;
          align-items: center;
          gap: .55rem;
          color: oklch(0.68 0.006 285);
          font-size: .92rem;
          text-decoration: none;
          transition: color .2s ease;
        }
        .accelerator-hero-links a:hover { color: oklch(0.965 0.002 285); }
        .accelerator-hero-links span { color: var(--souq-coral); }
        .accelerator-section { border-bottom: 1px solid oklch(0.27 0.005 285); }
        .accelerator-glance { padding: clamp(5rem, 10vw, 8rem) 0; }
        .accelerator-lede {
          max-width: 38rem;
          margin: 0 0 4.5rem;
          color: oklch(0.73 0.006 285);
          font-size: clamp(1.4rem, 2.8vw, 2.25rem);
          letter-spacing: -.055em;
          line-height: 1.05;
        }
        .accelerator-columns {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3rem;
        }
        .accelerator-columns > div { padding-top: 1.25rem; border-top: 1px solid oklch(0.27 0.005 285); }
        .accelerator-columns h3,
        .accelerator-subheading {
          margin: 0 0 1.5rem;
          color: oklch(0.94 0.002 285);
          font-size: 1.1rem;
          font-weight: 500;
          letter-spacing: -.035em;
        }
        .accelerator-columns ul,
        .accelerator-core-card ul {
          display: grid;
          gap: .8rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .accelerator-columns li,
        .accelerator-core-card li {
          display: flex;
          align-items: flex-start;
          gap: .65rem;
          color: oklch(0.68 0.006 285);
          font-size: 1rem;
          line-height: 1.45;
        }
        .accelerator-columns li > span:first-child,
        .accelerator-core-card li > span:first-child {
          flex: none;
          width: .32rem;
          height: .32rem;
          margin-top: .45rem;
          border-radius: 50%;
          background: var(--souq-coral);
        }
        .accelerator-callout {
          max-width: 34rem;
          margin: 4.5rem 0 0;
          color: oklch(0.9 0.002 285);
          font-size: 1rem;
          line-height: 1.5;
        }
        .accelerator-details { padding: clamp(5rem, 10vw, 8rem) 0; background: oklch(0.18 0.004 285); }
        .accelerator-details .accelerator-lede { margin-bottom: 3.5rem; }
        .accelerator-faq { margin-bottom: 5rem; border-top: 1px solid oklch(0.27 0.005 285); }
        .accelerator-faq-item { border-bottom: 1px solid oklch(0.27 0.005 285); cursor: pointer; }
        .accelerator-faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.35rem 0;
        }
        .accelerator-faq-question p { margin: 0; color: oklch(0.92 0.002 285); font-size: 1.1rem; letter-spacing: -.025em; }
        .accelerator-faq-question span { color: var(--souq-coral); font-size: 1.35rem; }
        .accelerator-faq-answer { max-width: 46rem; padding: 0 3rem 1.5rem 0; color: oklch(0.65 0.006 285); }
        .accelerator-faq-answer p { margin: 0 0 .9rem; font-size: 1rem; line-height: 1.65; }
        .accelerator-faq-answer p:last-child { margin-bottom: 0; }
        .accelerator-subheading { margin-bottom: 1.75rem; }
        .accelerator-core-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          border-top: 1px solid oklch(0.27 0.005 285);
          border-left: 1px solid oklch(0.27 0.005 285);
        }
        .accelerator-core-card {
          min-height: 15rem;
          padding: 1.5rem;
          border-right: 1px solid oklch(0.27 0.005 285);
          border-bottom: 1px solid oklch(0.27 0.005 285);
        }
        .accelerator-core-card .accelerator-label { margin-bottom: 2.5rem; color: oklch(0.58 0.006 285); }
        .accelerator-network-note { margin: 2.5rem 0 0; color: oklch(0.62 0.006 285); font-size: 1rem; line-height: 1.5; }
        .accelerator-join { padding: clamp(6rem, 13vw, 10rem) 0; text-align: center; }
        .accelerator-join .accelerator-label { color: var(--souq-coral); }
        .accelerator-join h2 { margin: 0 auto 1.5rem; font-size: clamp(3.5rem, 8vw, 7rem); font-weight: 400; letter-spacing: -.08em; line-height: .9; }
        .accelerator-join-copy { max-width: 31rem; margin: 0 auto 2.5rem; color: oklch(0.65 0.006 285); font-size: 1.15rem; line-height: 1.6; }
        .accelerator-primary-button { padding: 1rem 1.25rem; cursor: pointer; }
        .accelerator-footer { color: oklch(0.48 0.006 285); font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: .72rem; letter-spacing: .04em; text-transform: uppercase; }
        .accelerator-footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.5rem 0 2rem; }
        .accelerator-footer-inner > div { display: flex; gap: 1.5rem; }
        .accelerator-footer a { font-family: 'Inter', sans-serif; font-size: .88rem; letter-spacing: -.02em; text-transform: none; }
        @media (max-width: 720px) {
          .accelerator-container,
          .accelerator-nav-inner { width: calc(100% - 2.5rem); }
          .accelerator-nav-inner { min-height: 4.5rem; }
          .accelerator-current { font-size: .75rem; }
          .accelerator-desktop-links,
          .accelerator-nav-apply { display: none; }
          .accelerator-menu-button { display: block; }
          .accelerator-mobile-menu { display: grid; gap: 1rem; padding: 1.25rem; border-top: 1px solid oklch(0.27 0.005 285); background: oklch(0.155 0.004 285); }
          .accelerator-mobile-menu a { color: oklch(0.78 0.006 285); }
          .accelerator-mobile-menu .accelerator-mobile-apply { color: oklch(0.18 0.006 285); background: var(--souq-coral); padding: .8rem 1rem; text-align: center; }
          .accelerator-hero { padding: 7.5rem 0 4rem; }
          .accelerator-hero-inner { display: block; }
          .accelerator-hero h1 { max-width: 8ch; font-size: clamp(3.6rem, 16vw, 5rem); }
          .accelerator-hero-side { margin-top: 3rem; }
          .accelerator-hero-links { margin-top: 3rem; gap: 1rem 1.4rem; }
          .accelerator-glance,
          .accelerator-details { padding: 4.5rem 0; }
          .accelerator-lede { margin-bottom: 3rem; font-size: 2.2rem; }
          .accelerator-columns,
          .accelerator-core-grid { grid-template-columns: 1fr; }
          .accelerator-columns { gap: 2.5rem; }
          .accelerator-core-card { min-height: 0; padding: 1.25rem; }
          .accelerator-core-card .accelerator-label { margin-bottom: 1.75rem; }
          .accelerator-faq { margin-bottom: 4rem; }
          .accelerator-faq-answer { padding-right: 0; }
          .accelerator-join { padding: 6rem 0; }
          .accelerator-footer-inner { align-items: flex-start; flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
