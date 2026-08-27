import { useEffect, useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
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
  guests?: {
    label: string;
    heading: string;
    body: string;
    list: Array<{
      company?: string;
      logo?: string;
      people: Array<{ name: string; role?: string; linkedin?: string }>;
    }>;
  };
  logistics: {
    label: string;
    date: string;
    rsvpDeadline: string;
    lumaHref: string;
    hotels?: Array<{ name: string; rate: string; href: string }>;
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
        <Navbar tone="dark" />
        <div className="summit-atmosphere" aria-hidden="true" />
        <div className="summit-grain" aria-hidden="true" />
        <div className="summit-content-rules" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="summit-shell summit-loading-shell">
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
      <Navbar tone="dark" />
      <div className="summit-atmosphere" aria-hidden="true" />
      <div className="summit-grain" aria-hidden="true" />
      <div className="summit-content-rules" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="summit-shell">
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

        {details.guests?.list.length ? (
          <section className="summit-guests">
            <div className="summit-section-label">{details.guests.label}</div>
            <div className="summit-guests-content">
              <h2>{details.guests.heading}</h2>
              <p className="summit-guests-intro">{details.guests.body}</p>
              <ul className="summit-guests-grid">
                {details.guests.list.map((guest, index) => {
                  const logo = guest.logo ? (
                    <span className="summit-guest-logo">
                      <img
                        src={`${import.meta.env.BASE_URL}${guest.logo}`}
                        alt=""
                        loading="lazy"
                      />
                    </span>
                  ) : null;
                  const key = `${guest.company ?? guest.people[0]?.name}-${index}`;

                  // A single-person group renders as one clickable card, same
                  // as before. A multi-person company gets one card with a
                  // stacked list so the company isn't repeated.
                  if (guest.people.length === 1) {
                    const person = guest.people[0];
                    const inner = (
                      <>
                        {logo}
                        {guest.company ? <strong>{guest.company}</strong> : null}
                        <span>
                          {person.name}
                          {person.role ? ` · ${person.role}` : ""}
                        </span>
                      </>
                    );
                    return (
                      <li key={key}>
                        {person.linkedin ? (
                          <a
                            className="summit-guest-card"
                            href={person.linkedin}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {inner}
                            <Arrow />
                          </a>
                        ) : (
                          <div className="summit-guest-card">{inner}</div>
                        )}
                      </li>
                    );
                  }

                  return (
                    <li key={key}>
                      <div className="summit-guest-card summit-guest-card--group">
                        {logo}
                        {guest.company ? <strong>{guest.company}</strong> : null}
                        <ul className="summit-guest-people">
                          {guest.people.map((person) => (
                            <li key={person.name}>
                              {person.linkedin ? (
                                <a href={person.linkedin} target="_blank" rel="noreferrer">
                                  {person.name}
                                  {person.role ? ` · ${person.role}` : ""}
                                  <Arrow />
                                </a>
                              ) : (
                                <span>
                                  {person.name}
                                  {person.role ? ` · ${person.role}` : ""}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ) : null}

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
                <span className="summit-card-index">LOGISTICS</span>
                <h3>
                  <a href={details.logistics.lumaHref} target="_blank" rel="noreferrer">
                    Full details on Luma
                    <Arrow />
                  </a>
                </h3>
                <p>Location, timing, and invitation details live on the Luma event page.</p>
              </article>
              {details.logistics.hotels?.length ? (
                <article className="summit-hotels-card">
                  <span className="summit-card-index">STAY NEARBY</span>
                  <h3>🏨 Recommended Hotels</h3>
                  <p>If you are traveling in for the event, here are three nearby options:</p>
                  <ul className="summit-hotel-list">
                    {details.logistics.hotels.map((hotel) => (
                      <li key={hotel.name}>
                        <span className="summit-hotel-name">
                          <strong>{hotel.name}</strong>
                          <span>{hotel.rate}</span>
                        </span>
                        <a href={hotel.href} target="_blank" rel="noreferrer">
                          Open in Google Maps
                          <Arrow />
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="summit-hotels-note">We recommend locking in your room as soon as possible.</p>
                </article>
              ) : null}
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
            radial-gradient(32vmax 32vmax at 72% 15%, color-mix(in srgb, var(--souq-coral) 14%, transparent), transparent 70%),
            radial-gradient(38vmax 32vmax at 12% 84%, color-mix(in srgb, var(--souq-blue-deep) 16%, transparent), transparent 72%);
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
           font-size: .78rem;
        }
        .summit-kicker {
          margin: 0 0 1rem;
          color: var(--souq-coral);
        }
        .summit-primary-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: .55rem;
          border: 1px solid var(--souq-coral);
          background: var(--souq-coral);
          color: oklch(0.16 0.004 285);
          font: inherit;
          font-size: .9rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: transform .2s cubic-bezier(.22,1,.36,1), background .2s ease, color .2s ease;
        }
        .summit-primary-link:hover {
          background: var(--souq-peach);
          transform: translateY(-2px);
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
           color: var(--souq-coral);
          font-style: italic;
          font-weight: 350;
        }
        .summit-hero-description {
          max-width: 35ch;
          margin: 2.4rem 0 2rem;
          color: oklch(0.66 0.006 285);
          font-size: clamp(1.15rem, 1.6vw, 1.4rem);
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
           color: var(--souq-coral);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: .75rem;
        }
        .summit-hero-aside p {
          margin: 0;
          font-size: 1.1rem;
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
        .summit-experience > .summit-section-label {
          align-self: start;
          color: oklch(0.72 0.006 285);
          font-family: 'Inter', ui-sans-serif, sans-serif;
          font-size: clamp(1.2rem, 1.75vw, 1.65rem);
          font-weight: 500;
          letter-spacing: -.045em;
          line-height: 1;
          text-transform: none;
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
          font-size: 1.15rem;
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
          border-top: 1px solid oklch(0.23 0.006 285 / .22);
        }
        .summit-program article {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1rem;
          align-items: start;
          padding: 1.35rem 0;
          border-bottom: 1px solid oklch(0.23 0.006 285 / .22);
        }
        .summit-program-block-heading {
          display: flex;
          align-items: baseline;
          gap: .75rem;
          margin-bottom: 1.25rem;
        }
        .summit-program .summit-card-index { color: var(--souq-coral); }
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
          font-size: 1rem;
          line-height: 1.5;
        }
        .summit-program li {
          display: flex;
          align-items: flex-start;
          gap: .6rem;
        }
        .summit-program li::before {
          content: "—";
          color: var(--souq-coral);
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
        .summit-card-index { color: var(--souq-coral); }
        .summit-experience h3 {
          margin: auto 0 .75rem;
          font-size: clamp(1.5rem, 2vw, 1.9rem);
          font-weight: 500;
          letter-spacing: -.035em;
        }
        .summit-experience article p {
          margin: 0;
          color: oklch(0.6 0.006 285);
          font-size: 1rem;
          line-height: 1.5;
        }
        .summit-guests {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 3rem;
          padding: clamp(4rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3.5rem);
          border-bottom: 1px solid oklch(0.27 0.005 285);
        }
        .summit-guests-content h2 {
          max-width: 22ch;
          margin: 0 0 1.2rem;
          font-size: clamp(2rem, 4.6vw, 4.1rem);
          font-weight: 400;
          line-height: .98;
          letter-spacing: -.055em;
        }
        .summit-guests-intro {
          max-width: 46rem;
          margin: 0 0 2.4rem;
          color: oklch(0.66 0.006 285);
          font-size: 1.05rem;
          line-height: 1.6;
        }
        .summit-guests-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(13.5rem, 1fr));
          gap: .75rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .summit-guest-card {
          display: flex;
          flex-direction: column;
          gap: .3rem;
          height: 100%;
          padding: .95rem 1.05rem;
          border: 1px solid oklch(0.27 0.005 285);
          background: oklch(0.18 0.004 285 / .55);
          color: inherit;
          text-decoration: none;
          transition: border-color .2s ease, background .2s ease, transform .2s cubic-bezier(.22,1,.36,1);
        }
        a.summit-guest-card {
          cursor: pointer;
        }
        a.summit-guest-card:hover {
          border-color: var(--souq-coral);
          background: oklch(0.2 0.005 285 / .7);
          transform: translateY(-2px);
        }
        .summit-guest-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.1rem;
          height: 2.1rem;
          margin-bottom: .3rem;
          border-radius: .4rem;
          background: oklch(0.965 0.002 285);
          overflow: hidden;
        }
        .summit-guest-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: .3rem;
        }
        .summit-guest-card strong {
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: -.02em;
          line-height: 1.3;
        }
        .summit-guest-card span {
          color: oklch(0.58 0.006 285);
          font-size: .82rem;
          line-height: 1.3;
        }
        a.summit-guest-card svg {
          align-self: flex-end;
          margin-top: -.9rem;
          width: .7rem;
          height: .7rem;
          color: oklch(0.5 0.006 285);
        }
        a.summit-guest-card:hover svg {
          color: var(--souq-coral);
        }
        .summit-guest-card--group {
          gap: .55rem;
        }
        .summit-guest-people {
          display: flex;
          flex-direction: column;
          gap: .3rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .summit-guest-people span,
        .summit-guest-people a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: .4rem;
          color: oklch(0.58 0.006 285);
          font-size: .82rem;
          line-height: 1.3;
        }
        .summit-guest-people a {
          color: oklch(0.72 0.006 285);
          text-decoration: none;
          transition: color .2s ease;
        }
        .summit-guest-people a svg {
          flex-shrink: 0;
          width: .65rem;
          height: .65rem;
          color: oklch(0.5 0.006 285);
        }
        .summit-guest-people a:hover {
          color: var(--souq-coral);
          text-decoration: underline;
          text-underline-offset: .15em;
        }
        .summit-guest-people a:hover svg {
          color: var(--souq-coral);
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
          grid-template-columns: repeat(2, 1fr);
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
           color: var(--souq-coral);
        }
        .summit-logistics h3 svg {
          width: .8rem;
          height: .8rem;
        }
        .summit-hotels-card {
          grid-column: 1 / -1;
          min-height: 0 !important;
        }
        .summit-hotels-card h3 {
          margin: .8rem 0 .7rem;
          font-size: clamp(1.4rem, 2.2vw, 2rem);
        }
        .summit-hotels-card > p {
          max-width: 42rem;
        }
        .summit-hotel-list {
          display: grid;
          gap: 0;
          margin: 1.2rem 0 0;
          padding: 0;
          list-style: none;
        }
        .summit-hotel-list li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: .9rem 0;
          border-top: 1px solid oklch(0.27 0.005 285);
        }
        .summit-hotel-list li:last-child {
          border-bottom: 1px solid oklch(0.27 0.005 285);
        }
        .summit-hotel-name {
          display: inline-flex;
          align-items: baseline;
          gap: .8rem;
          color: oklch(0.86 0.006 285);
        }
        .summit-hotel-name strong {
          font-size: 1.05rem;
          font-weight: 500;
        }
        .summit-hotel-name > span {
          color: var(--souq-coral);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: .8rem;
        }
        .summit-hotel-list a {
          flex: none;
          color: oklch(0.72 0.006 285);
          font-size: .95rem;
        }
        .summit-hotel-list a:hover {
          color: var(--souq-coral);
        }
        .summit-hotels-note {
          margin-top: 1.1rem !important;
          color: oklch(0.72 0.006 285) !important;
        }
        .summit-logistics p {
          margin: 0;
          color: oklch(0.6 0.006 285);
          font-size: .95rem;
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
        .summit-logistics .summit-hotel-list {
          gap: 0;
          margin: 1.2rem 0 0;
          font-size: 1rem;
        }
        .summit-logistics .summit-hotel-list li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: .9rem 0;
          border-top: 1px solid oklch(0.27 0.005 285);
          border-bottom: 0;
        }
        .summit-logistics .summit-hotel-list li:last-child {
          border-bottom: 1px solid oklch(0.27 0.005 285);
          padding-bottom: .9rem;
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
          font-size: .72rem;
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
          .summit-guests,
          .summit-logistics { display: block; padding: 4.5rem 1.25rem; }
          .summit-intro-copy,
          .summit-program-content,
          .summit-experience-grid,
          .summit-guests-content,
          .summit-logistics-grid { margin-top: 2rem; }
          .summit-intro-copy h2 { font-size: 2.55rem; }
          .summit-program-content h2 { font-size: 2.55rem; }
          .summit-guests-content h2 { font-size: 2.55rem; }
          .summit-guests-grid { grid-template-columns: repeat(2, 1fr); }
          .summit-program-grid,
          .summit-experience-grid,
          .summit-logistics-grid { grid-template-columns: 1fr; }
          .summit-hotels-card { grid-column: auto; }
          .summit-logistics .summit-hotel-list li { align-items: flex-start; flex-direction: column; gap: .5rem; }
          .summit-logistics .summit-hotel-list a { font-size: 1rem; }
          .summit-program article {
            display: block;
            min-height: 0;
          }
          .summit-program-block-heading { margin-bottom: 1rem; }
          .summit-program article,
          .summit-logistics article { min-height: 0; }
          .summit-experience article { min-height: 12rem; }
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