import { FormEvent, useEffect, useState } from "react";
import { Link } from "wouter";
import "./Summit.css";

const ENTRY_PASSWORD = "OneWell2026";

function ArchMark({ small = false }: { small?: boolean }) {
  const size = small ? 18 : 26;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="summit-arch"
    >
      <path
        d="M2.5 14.5V7.5a5.5 5.5 0 0 1 11 0v7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
  const [unlocked, setUnlocked] = useState(false);
  const [entry, setEntry] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function handleEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (entry.trim() !== ENTRY_PASSWORD) {
      setError("That entry phrase doesn't match.");
      return;
    }
    setError("");
    setUnlocked(true);
  }

  if (!unlocked) {
    return (
      <main className={`summit-page summit-gate${ready ? " summit-ready" : ""}`}>
        <div className="summit-atmosphere" aria-hidden="true" />
        <div className="summit-grain" aria-hidden="true" />
        <div className="summit-gate-rules" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="summit-gate-shell">
          <Link href="/" className="summit-gate-logo">
            <ArchMark small />
            <span>Souq</span>
          </Link>
          <section className="summit-gate-card" aria-labelledby="summit-gate-title">
            <div className="summit-gate-mark">
              <ArchMark />
            </div>
            <p className="summit-kicker">A private gathering</p>
            <h1 id="summit-gate-title">Souq Summit</h1>
            <p className="summit-gate-intro">
              For the founders building what comes next.
            </p>
            <form onSubmit={handleEntry} className="summit-entry-form" noValidate>
              <label className="summit-sr-only" htmlFor="summit-entry">
                Entry phrase
              </label>
              <input
                id="summit-entry"
                type="password"
                autoComplete="off"
                placeholder="the entry phrase"
                value={entry}
                onChange={(event) => {
                  setEntry(event.target.value);
                  if (error) setError("");
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "summit-entry-error" : undefined}
                autoFocus
              />
              <button type="submit">
                Enter
                <Arrow />
              </button>
            </form>
            <p
              id="summit-entry-error"
              className={`summit-entry-note${error ? " summit-entry-error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {error || "This page is for invited guests."}
            </p>
          </section>
          <p className="summit-gate-footer">Souq / Summit 2026</p>
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
            <ArchMark small />
            <span>Souq</span>
          </Link>
          <div className="summit-header-meta">
            <span>Private gathering</span>
            <span className="summit-header-dot" />
            <span>2026</span>
          </div>
        </header>

        <section className="summit-hero">
          <div className="summit-hero-copy">
            <p className="summit-kicker summit-reveal">Souq / Summit</p>
            <h1 className="summit-title summit-reveal">
              Make room for
              <em>what’s next.</em>
            </h1>
            <p className="summit-hero-description summit-reveal">
              An intimate gathering for the founders, operators, and people
              shaping the next generation of consumer brands.
            </p>
            <a className="summit-primary-link summit-reveal" href="mailto:yaser@joinsouq.com?subject=Souq%20Summit%20invitation">
              Request your invitation
              <Arrow />
            </a>
          </div>
          <div className="summit-hero-aside summit-reveal">
            <span className="summit-aside-number">03</span>
            <p>
              The third pillar of Souq is a room of founders who actually
              care — about the work, the details, and each other.
            </p>
          </div>
        </section>

        <section className="summit-intro-section">
          <div className="summit-section-label">The invitation</div>
          <div className="summit-intro-copy">
            <h2>Good companies are built in public. Great ones are built together.</h2>
            <p>
              Summit is a private space to step away from the dashboard and
              spend time with the people who understand the journey. No panels,
              no pitch decks — just generous conversation, a considered table,
              and a little room to think further.
            </p>
          </div>
        </section>

        <section className="summit-experience">
          <div className="summit-section-label">The evening</div>
          <div className="summit-experience-grid">
            <article>
              <span className="summit-card-index">01</span>
              <h3>Arrive curious</h3>
              <p>Bring the question you haven’t had time to ask out loud.</p>
            </article>
            <article>
              <span className="summit-card-index">02</span>
              <h3>Stay awhile</h3>
              <p>A thoughtful table, good food, and conversations with range.</p>
            </article>
            <article>
              <span className="summit-card-index">03</span>
              <h3>Leave with more</h3>
              <p>New perspective, useful connections, and momentum for the next move.</p>
            </article>
          </div>
        </section>

        <section className="summit-closing">
          <p className="summit-kicker">A room for builders</p>
          <h2>Come as you are.<br /><em>Build what matters.</em></h2>
          <a className="summit-primary-link" href="mailto:yaser@joinsouq.com?subject=Souq%20Summit%20invitation">
            Request your invitation
            <Arrow />
          </a>
        </section>

        <footer className="summit-footer">
          <Link href="/" className="summit-wordmark">
            <ArchMark small />
            <span>Souq</span>
          </Link>
          <span>Capital / Operating Stack / Summit</span>
          <span>© {new Date().getFullYear()} Souq</span>
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
        .summit-gate-rules,
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
        .summit-gate-rules span,
        .summit-content-rules span {
          border-left: 1px solid oklch(0.36 0.006 285);
          opacity: .45;
        }
        .summit-gate-rules span:first-child,
        .summit-content-rules span:first-child {
          border-left-color: oklch(0.48 0.006 285);
          opacity: .7;
        }
        .summit-gate-shell,
        .summit-shell {
          position: relative;
          z-index: 2;
          width: min(calc(100% - 3rem), 76rem);
          margin-inline: auto;
        }
        .summit-gate-shell {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .summit-gate-logo,
        .summit-wordmark {
          display: inline-flex;
          align-items: center;
          gap: .6rem;
          color: inherit;
          text-decoration: none;
        }
        .summit-gate-logo {
          position: absolute;
          top: 2rem;
          left: 2rem;
          font-size: 1.06rem;
          font-weight: 600;
          letter-spacing: -.035em;
        }
        .summit-gate-card {
          width: min(100%, 31rem);
          padding: clamp(2.25rem, 5vw, 4rem);
          border: 1px solid oklch(0.76 0.14 55 / .28);
          background: oklch(0.13 0.004 285 / .76);
          box-shadow: 0 30px 100px oklch(0 0 0 / .28);
          text-align: center;
          animation: summit-rise .8s cubic-bezier(.22,1,.36,1) both;
        }
        .summit-gate-mark {
          width: 3rem;
          height: 3rem;
          display: grid;
          place-items: center;
          margin: 0 auto 1.6rem;
          border: 1px solid oklch(0.76 0.14 55 / .6);
          border-radius: 50%;
          color: oklch(0.76 0.14 55);
        }
        .summit-kicker,
        .summit-section-label,
        .summit-header-meta,
        .summit-entry-note,
        .summit-gate-footer,
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
        .summit-gate-card h1 {
          margin: 0;
          font-size: clamp(2.25rem, 5vw, 3.5rem);
          font-weight: 400;
          line-height: .98;
          letter-spacing: -.055em;
        }
        .summit-gate-intro {
          margin: 1.2rem auto 2rem;
          max-width: 23ch;
          color: oklch(0.66 0.006 285);
          font-size: 1rem;
          line-height: 1.5;
        }
        .summit-entry-form {
          display: flex;
          gap: .5rem;
        }
        .summit-entry-form input {
          min-width: 0;
          flex: 1;
          height: 3rem;
          padding: 0 1rem;
          color: oklch(0.965 0.002 285);
          background: oklch(0.19 0.004 285);
          border: 1px solid oklch(0.36 0.006 285);
          border-radius: .35rem;
          outline: none;
          font: inherit;
          transition: border-color .2s ease, box-shadow .2s ease;
        }
        .summit-entry-form input::placeholder { color: oklch(0.48 0.006 285); }
        .summit-entry-form input:focus-visible {
          border-color: oklch(0.76 0.14 55);
          box-shadow: 0 0 0 3px oklch(0.76 0.14 55 / .13);
        }
        .summit-entry-form input[aria-invalid="true"] { border-color: oklch(0.7 0.16 25); }
        .summit-entry-form button,
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
        .summit-entry-form button {
          height: 3rem;
          padding: 0 1.15rem;
          border-radius: .35rem;
        }
        .summit-entry-form button:hover,
        .summit-primary-link:hover {
          background: oklch(0.87 0.12 72);
          transform: translateY(-2px);
        }
        .summit-entry-note {
          min-height: 1rem;
          margin: 1rem 0 0;
          color: oklch(0.48 0.006 285);
          letter-spacing: .05em;
          text-transform: none;
        }
        .summit-entry-error { color: oklch(0.72 0.16 25); }
        .summit-gate-footer {
          position: absolute;
          bottom: 2rem;
          margin: 0;
          color: oklch(0.45 0.006 285);
        }
        .summit-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 5.25rem;
          border-bottom: 1px solid oklch(0.27 0.005 285);
        }
        .summit-wordmark { font-size: 1.06rem; font-weight: 600; letter-spacing: -.035em; }
        .summit-arch { flex: none; }
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
          .summit-gate-rules,
          .summit-content-rules { display: none; }
          .summit-gate-shell,
          .summit-shell { width: 100%; }
          .summit-gate-shell { padding: 1.25rem; }
          .summit-gate-logo { top: 1.25rem; left: 1.25rem; }
          .summit-gate-footer { bottom: 1.25rem; }
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
          .summit-experience { display: block; padding: 4.5rem 1.25rem; }
          .summit-intro-copy,
          .summit-experience-grid { margin-top: 2rem; }
          .summit-intro-copy h2 { font-size: 2.55rem; }
          .summit-experience-grid { grid-template-columns: 1fr; }
          .summit-experience article { min-height: 12rem; }
          .summit-closing { padding: 6rem 1.25rem; }
          .summit-closing h2 { font-size: 3.7rem; }
          .summit-footer { flex-wrap: wrap; padding-inline: 1.25rem; }
          .summit-footer > span:nth-last-child(2) { display: none; }
        }
        @media (max-width: 480px) {
          .summit-entry-form { flex-direction: column; }
          .summit-entry-form button { width: 100%; }
          .summit-gate-card { padding: 2rem 1.25rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .summit-gate-card,
          .summit-ready .summit-reveal { animation: none; }
          .summit-reveal { opacity: 1; transform: none; }
        }
      `}</style>
    </main>
  );
}