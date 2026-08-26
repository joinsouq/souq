import { useEffect, useState } from "react";
import { Link } from "wouter";
import SouqLogo from "@/components/SouqLogo";

type SummitDetails = {
  header: { gathering: string; year: string };
  hero: {
    eyebrow: string;
    title: string;
    emphasis: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    asideNumber: string;
    aside: string;
  };
  invitation: { label: string; heading: string; body: string };
  program: {
    label: string;
    heading: string;
    blocks: Array<{ title: string; items: string[] }>;
  };
  evening: {
    label: string;
    items: Array<{ index: string; title: string; description: string }>;
  };
  logistics: {
    label: string;
    date: string;
    rsvpDeadline: string;
    venue: string;
    venueNote: string;
    venueHref: string;
    hotels: Array<{ name: string; rate: string; href: string }>;
  };
  closing: {
    eyebrow: string;
    title: string;
    emphasis: string;
    ctaLabel: string;
    ctaHref: string;
  };
  footer: { pillars: string; copyright: string };
};

function Arrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Summit() {
  const [details, setDetails] = useState<SummitDetails | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  async function loadDetails() {
    try {
      const response = await fetch("/api/summit", { cache: "no-store" });
      if (!response.ok) throw new Error("failed");
      setDetails((await response.json()) as SummitDetails);
    } catch {
      setError("Summit is temporarily unavailable. Try again soon.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDetails();
  }, []);

  if (!details) {
    return (
      <main className={`summit-page summit-content${ready ? " summit-ready" : ""}`}>
        <div className="summit-atmosphere" aria-hidden="true" />
        <div className="summit-grain" aria-hidden="true" />
        <div className="summit-content-rules" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="summit-shell summit-loading-shell">
          <header className="summit-header">
            <Link href="/" className="summit-wordmark">
              <SouqLogo variant="white" className="summit-logo-image" />
            </Link>
          </header>
          <section className="summit-loading-state" aria-live="polite">
            <p className="summit-kicker">Souq / Summit</p>
            <h1>{error ? "Summit is unavailable." : "Loading Summit."}</h1>
            <p>{error || "Preparing the room…"}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={`summit-page summit-content${ready ? " summit-ready" : ""}`}>
      <div className="summit-atmosphere" aria-hidden="true" />
      <div className="summit-grain" aria-hidden="true" />
      <div className="summit-content-rules" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="summit-shell">
        <header className="summit-header">
          <Link href="/" className="summit-wordmark">
            <SouqLogo variant="white" className="summit-logo-image" />
          </Link>
          <div className="summit-header-meta">
            <span>{details.header.gathering}</span>
            <span className="summit-header-dot" />
            <span>{details.header.year}</span>
          </div>
        </header>

        <section className="summit-hero">
          <div className="summit-hero-copy">
            <p className="summit-kicker summit-reveal">{details.hero.eyebrow}</p>
            <h1 className="summit-title summit-reveal">
              {details.hero.title}
              <em>{details.hero.emphasis}</em>
            </h1>
            <p className="summit-hero-description summit-reveal">{details.hero.description}</p>
            <a className="summit-primary-link summit-reveal" href={details.hero.ctaHref}>
              {details.hero.ctaLabel}
              <Arrow />
            </a>
          </div>
          <div className="summit-hero-aside summit-reveal">
            <span className="summit-aside-number">{details.hero.asideNumber}</span>
            <p>{details.hero.aside}</p>
          </div>
        </section>

        <section className="summit-intro-section">
          <div className="summit-section-label">{details.invitation.label}</div>
          <div className="summit-intro-copy">
            <h2>{details.invitation.heading}</h2>
            <p>{details.invitation.body}</p>
          </div>
        </section>

        <section className="summit-program">
          <div className="summit-section-label">{details.program.label}</div>
          <div className="summit-program-content">
            <h2>{details.program.heading}</h2>
            <div className="summit-program-grid">
              {details.program.blocks.map((block, index) => (
                <article key={block.title}>
                  <div className="summit-program-block-heading">
                    <span className="summit-card-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{block.title}</h3>
                  </div>
                  <ul>
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="summit-experience">
          <div className="summit-section-label">{details.evening.label}</div>
          <div className="summit-experience-grid">
            {details.evening.items.map((item) => (
              <article key={item.index}>
                <span className="summit-card-index">{item.index}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {details.logistics && (
          <section className="summit-logistics">
            <div className="summit-section-label">{details.logistics.label}</div>
            <div className="summit-logistics-grid">
              <article>
                <span className="summit-card-index">DATE</span>
                <h3>{details.logistics.date}</h3>
                <p>{details.logistics.rsvpDeadline}</p>
              </article>
              <article>
                <span className="summit-card-index">VENUE</span>
                <h3>
                  <a href={details.logistics.venueHref} target="_blank" rel="noreferrer">
                    {details.logistics.venue}
                    <Arrow />
                  </a>
                </h3>
                <p>{details.logistics.venueNote}</p>
              </article>
              <article>
                <span className="summit-card-index">STAY NEARBY</span>
                <ul>
                  {details.logistics.hotels.map((hotel) => (
                    <li key={hotel.name}>
                      <a href={hotel.href} target="_blank" rel="noreferrer">
                        <span>{hotel.name}</span>
                        <span>{hotel.rate}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>
        )}

        <section className="summit-closing">
          <p className="summit-kicker">{details.closing.eyebrow}</p>
          <h2>{details.closing.title}<br /><em>{details.closing.emphasis}</em></h2>
          <a className="summit-primary-link" href={details.closing.ctaHref}>
            {details.closing.ctaLabel}
            <Arrow />
          </a>
        </section>

        <footer className="summit-footer">
          <Link href="/" className="summit-wordmark">
            <SouqLogo variant="white" className="summit-logo-image" />
          </Link>
          <span>{details.footer.pillars}</span>
          <span>{details.footer.copyright}</span>
        </footer>
      </div>

      <style>{`
        .summit-page {
          min-height: 100svh;
          background: oklch(0.155 0.004 285);
          color: oklch(0.965 0.002 285);
          font-family: 'Inter', ui-sans-serif, -apple-system, sans-serif;
          font-feature-settings: "cv02" 1, "cv03" 1, "cv04" 1, "ss01" 1;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          position: relative;
        }
        .summit-atmosphere {
          position: fixed;
          inset: -25vmax;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(32vmax 32vmax at 72% 15%, oklch(0.72 0.11 55 / .12), transparent 70%),
            radial-gradient(38vmax 32vmax at 12% 84%, oklch(0.32 0.06 210 / .14), transparent 72%);
        }
        .summit-grain {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: .035;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .summit-content-rules {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          width: min(calc(100% - 3rem), 76rem);
          margin-inline: auto;
        }
        .summit-content-rules span {
          border-left: 1px solid oklch(0.36 0.006 285);
          opacity: .45;
        }
        .summit-content-rules span:first-child {
          border-left-color: oklch(0.48 0.006 285);
          opacity: .7;
        }
        .summit-shell {
          position: relative;
          z-index: 2;
          width: min(calc(100% - 3rem), 76rem);
          margin-inline: auto;
        }
        .summit-wordmark {
          display: inline-flex;
          align-items: center;
          gap: .6rem;
          color: inherit;
          text-decoration: none;
        }
        .summit-kicker,
        .summit-section-label,
        .summit-header-meta,
        .summit-card-index {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          text-transform: uppercase;
          letter-spacing: .14em;
          font-size: .66rem;
        }
        .summit-kicker {
          margin: 0 0 1rem;
          color: oklch(0.76 0.14 55);
        }
        .summit-primary-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: .55rem;
          border: 1px solid oklch(0.76 0.14 55);
          background: oklch(0.76 0.14 55);
          color: oklch(0.16 0.004 285);
          font: inherit;
          font-size: .9rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: transform .2s cubic-bezier(.22,1,.36,1), background .2s ease, color .2s ease;
        }
        .summit-primary-link:hover {
          background: oklch(0.87 0.12 72);
          transform: translateY(-2px);
        }
        .summit-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 5.25rem;
          border-bottom: 1px solid oklch(0.27 0.005 285);
        }
        .summit-wordmark { font-size: 1.06rem; font-weight: 600; letter-spacing: -.035em; }
        .summit-logo-image {
          display: inline-flex;
          align-items: center;
          width: 7.5rem;
          height: auto;
        }
        .summit-header-meta {
          display: inline-flex;
          align-items: center;
          gap: .7rem;
          color: oklch(0.55 0.006 285);
        }
        .summit-header-dot {
          width: .3rem;
          height: .3rem;
          border-radius: 50%;
          background: oklch(0.76 0.14 55);
        }
        .summit-hero {
          min-height: min(46rem, 72svh);
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
          align-items: end;
          padding: clamp(5rem, 14vh, 10rem) clamp(1.25rem, 4vw, 3.5rem) clamp(4rem, 9vh, 7rem);
          border-bottom: 1px solid oklch(0.27 0.005 285);
        }
        .summit-hero-copy { max-width: 47rem; }
        .summit-title {
          margin: 0;
          max-width: 9ch;
          font-size: clamp(4.4rem, 10.8vw, 9.2rem);
          font-weight: 400;
          line-height: .87;
          letter-spacing: -.075em;
        }
        .summit-title em,
        .summit-closing em {
          display: block;
          color: oklch(0.76 0.14 55);
          font-style: italic;
          font-weight: 350;
        }
        .summit-hero-description {
          max-width: 35ch;
          margin: 2.4rem 0 2rem;
          color: oklch(0.66 0.006 285);
          font-size: clamp(1rem, 1.4vw, 1.2rem);
          line-height: 1.55;
        }
        .summit-primary-link {
          padding: .85rem 1.1rem;
          border-radius: .25rem;
        }
        .summit-hero-aside {
          max-width: 15rem;
          padding-bottom: .25rem;
          color: oklch(0.66 0.006 285);
        }
        .summit-aside-number {
          display: block;
          margin-bottom: 1.1rem;
          color: oklch(0.76 0.14 55);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: .75rem;
        }
        .summit-hero-aside p {
          margin: 0;
          font-size: .95rem;
          line-height: 1.55;
        }
        .summit-intro-section,
        .summit-experience {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 3rem;
          padding: clamp(4rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3.5rem);
          border-bottom: 1px solid oklch(0.27 0.005 285);
        }
        .summit-section-label {
          color: oklch(0.55 0.006 285);
        }
        .summit-intro-copy { max-width: 45rem; }
        .summit-intro-copy h2 {
          max-width: 18ch;
          margin: 0 0 1.8rem;
          font-size: clamp(2rem, 4.6vw, 4.1rem);
          font-weight: 400;
          line-height: .98;
          letter-spacing: -.055em;
        }
        .summit-intro-copy p {
          max-width: 49ch;
          margin: 0;
          color: oklch(0.66 0.006 285);
          font-size: 1.05rem;
          line-height: 1.65;
        }
        .summit-experience-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .summit-program {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 3rem;
          padding: clamp(4rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3.5rem);
          background: oklch(0.95 0.008 80);
          color: oklch(0.19 0.006 285);
        }
        .summit-program .summit-section-label { color: oklch(0.48 0.008 285); }
        .summit-program-content h2 {
          max-width: 21ch;
          margin: 0 0 2.4rem;
          font-size: clamp(2rem, 4.6vw, 4.1rem);
          font-weight: 400;
          line-height: .98;
          letter-spacing: -.055em;
        }
        .summit-program-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .summit-program article {
          padding: 1.35rem 0 0;
          border-top: 1px solid oklch(0.23 0.006 285 / .22);
        }
        .summit-program article:last-child {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1rem;
        }
        .summit-program-block-heading {
          display: flex;
          align-items: baseline;
          gap: .75rem;
          margin-bottom: 1.25rem;
        }
        .summit-program .summit-card-index { color: oklch(0.58 0.13 55); }
        .summit-program article h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 500;
          letter-spacing: -.035em;
        }
        .summit-program ul {
          display: grid;
          gap: .7rem;
          margin: 0;
          padding: 0;
          list-style: none;
          color: oklch(0.38 0.008 285);
          font-size: .92rem;
          line-height: 1.5;
        }
        .summit-program li {
          display: flex;
          align-items: flex-start;
          gap: .6rem;
        }
        .summit-program li::before {
          content: "—";
          color: oklch(0.58 0.13 55);
          flex: none;
        }
        .summit-experience article {
          min-height: 15rem;
          display: flex;
          flex-direction: column;
          padding: 1.35rem;
          border: 1px solid oklch(0.27 0.005 285);
          background: oklch(0.18 0.004 285 / .55);
        }
        .summit-card-index { color: oklch(0.76 0.14 55); }
        .summit-experience h3 {
          margin: auto 0 .75rem;
          font-size: 1.35rem;
          font-weight: 500;
          letter-spacing: -.035em;
        }
        .summit-experience article p {
          margin: 0;
          color: oklch(0.6 0.006 285);
          font-size: .9rem;
          line-height: 1.5;
        }
        .summit-logistics {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 3rem;
          padding: clamp(4rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3.5rem);
          border-bottom: 1px solid oklch(0.27 0.005 285);
        }
        .summit-logistics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .summit-logistics article {
          min-height: 11rem;
          display: flex;
          flex-direction: column;
          padding: 1.35rem;
          border: 1px solid oklch(0.27 0.005 285);
          background: oklch(0.18 0.004 285 / .55);
        }
        .summit-logistics h3 {
          margin: auto 0 .75rem;
          font-size: 1.15rem;
          font-weight: 500;
          line-height: 1.15;
          letter-spacing: -.035em;
        }
        .summit-logistics h3 a,
        .summit-logistics li a {
          display: inline-flex;
          align-items: center;
          gap: .45rem;
          color: inherit;
          text-decoration: none;
        }
        .summit-logistics h3 a:hover,
        .summit-logistics li a:hover {
          color: oklch(0.76 0.14 55);
        }
        .summit-logistics h3 svg {
          width: .8rem;
          height: .8rem;
        }
        .summit-logistics p {
          margin: 0;
          color: oklch(0.6 0.006 285);
          font-size: .85rem;
          line-height: 1.5;
        }
        .summit-logistics ul {
          display: grid;
          gap: .6rem;
          margin: auto 0 0;
          padding: 0;
          list-style: none;
          color: oklch(0.72 0.006 285);
          font-size: .85rem;
        }
        .summit-logistics li {
          border-bottom: 1px solid oklch(0.27 0.005 285);
          padding-bottom: .45rem;
        }
        .summit-logistics li:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }
        .summit-logistics li a {
          justify-content: space-between;
          width: 100%;
        }
        .summit-closing {
          padding: clamp(6rem, 15vw, 12rem) clamp(1.25rem, 4vw, 3.5rem);
          text-align: center;
        }
        .summit-closing h2 {
          margin: 0 auto 2.3rem;
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 400;
          line-height: .9;
          letter-spacing: -.07em;
        }
        .summit-closing .summit-primary-link { display: inline-flex; }
        .summit-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.5rem 0 2rem;
          border-top: 1px solid oklch(0.27 0.005 285);
          color: oklch(0.45 0.006 285);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: .62rem;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .summit-footer .summit-wordmark {
          color: oklch(0.66 0.006 285);
          font-family: 'Inter', sans-serif;
          font-size: .95rem;
          text-transform: none;
          letter-spacing: -.035em;
        }
        .summit-reveal {
          opacity: 0;
          transform: translateY(1rem);
        }
        .summit-ready .summit-reveal {
          animation: summit-rise .8s cubic-bezier(.22,1,.36,1) both;
        }
        .summit-ready .summit-kicker { animation-delay: 80ms; }
        .summit-ready .summit-title { animation-delay: 150ms; }
        .summit-ready .summit-hero-description { animation-delay: 230ms; }
        .summit-ready .summit-primary-link { animation-delay: 310ms; }
        .summit-ready .summit-hero-aside { animation-delay: 410ms; }
        @keyframes summit-rise {
          to { opacity: 1; transform: none; }
        }
        .summit-sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        @media (max-width: 720px) {
          .summit-content-rules { display: none; }
          .summit-shell { width: 100%; }
          .summit-header { min-height: 4.5rem; padding-inline: 1.25rem; }
          .summit-header-meta span:first-child,
          .summit-header-dot { display: none; }
          .summit-hero {
            min-height: auto;
            display: block;
            padding: 5rem 1.25rem 4.5rem;
          }
          .summit-title { font-size: clamp(3.9rem, 17vw, 6rem); }
          .summit-hero-aside { margin-top: 4rem; }
          .summit-intro-section,
          .summit-program,
          .summit-experience,
          .summit-logistics { display: block; padding: 4.5rem 1.25rem; }
          .summit-intro-copy,
          .summit-program-content,
          .summit-experience-grid,
          .summit-logistics-grid { margin-top: 2rem; }
          .summit-intro-copy h2 { font-size: 2.55rem; }
          .summit-program-content h2 { font-size: 2.55rem; }
          .summit-program-grid,
          .summit-experience-grid,
          .summit-logistics-grid { grid-template-columns: 1fr; }
          .summit-program article:last-child { display: block; }
          .summit-program article,
          .summit-experience article,
          .summit-logistics article { min-height: 12rem; }
          .summit-closing { padding: 6rem 1.25rem; }
          .summit-closing h2 { font-size: 3.7rem; }
          .summit-footer { flex-wrap: wrap; padding-inline: 1.25rem; }
          .summit-footer > span:nth-last-child(2) { display: none; }
        }
        @media (max-width: 480px) {
        }
        @media (prefers-reduced-motion: reduce) {
          .summit-ready .summit-reveal { animation: none; }
          .summit-reveal { opacity: 1; transform: none; }
        }
      `}</style>
    </main>
  );
}