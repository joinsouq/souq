import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "wouter";
import SitePage from "@/components/SitePage";
import { CAPITAL, LEVELS, SERVICES } from "@/data/offerings";

const WORDS = [
  "natural haircare brand",
  "modestwear brand",
  "ice cream brand",
  "specialty coffee brand",
  "clean skincare brand",
  "fine fragrance brand",
  "home goods brand",
  "wellness brand",
  "jewelry brand",
  "activewear brand",
];

function Rotator() {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setIdx((p) => {
        setPrev(p);
        setTimeout(() => setPrev(null), 650);
        return (p + 1) % WORDS.length;
      });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="home-rot-wrap">
      <span className="home-rot" aria-hidden="true">
        {prev !== null && <span key={`o${prev}`} className="home-word home-word-out">{WORDS[prev]}.</span>}
        <span key={`i${idx}`} className="home-word home-word-in">{WORDS[idx]}.</span>
        <span className="home-rot-line" />
      </span>
      <span className="sr-only">{WORDS[idx]}.</span>
    </span>
  );
}

export default function Umbrella() {
  return (
    <SitePage>
      <div className="sq-wrap">
        {/* Hero */}
        <section className="home-hero">
          <h1 className="sq-display home-title">
            One place to build a <Rotator />
          </h1>
          <p className="sq-lede home-sub">
            Souq gives consumer brands growth capital, an operating team for hire, and operators who
            have scaled brands before. Use one piece or all of it.
          </p>
          <div className="sq-actions home-cta">
            <Link href="/apply" className="sq-btn sq-btn-primary">Apply</Link>
            <Link href="/community" className="sq-btn sq-btn-ghost">Join the community</Link>
          </div>
        </section>

        {/* Levels, drawn as a staircase: each step is a deeper engagement */}
        <section className="sq-section" aria-labelledby="levels-title">
          <div className="sq-head">
            <h2 id="levels-title" className="sq-h2">Work with Souq as closely as you need.</h2>
            <p className="sq-body">
              Start in the community, hire us for a single job, or bring us in to run the back end.
              Each step goes deeper, and you can start at whichever one fits.
            </p>
          </div>

          <ol className="home-stairs">
            {LEVELS.map((level, i) => (
              <li key={level.id} className="home-step" style={{ "--depth": i + 1 } as CSSProperties}>
                <h3 className="sq-h3">{level.name}</h3>
                <p className="home-step-summary">{level.summary}</p>
                <p className="sq-small">{level.forWho}</p>
                <Link href={level.href} className="sq-link home-step-link">{level.cta}</Link>
              </li>
            ))}
          </ol>

          <div className="home-capital">
            <div>
              <h3 className="sq-h3">{CAPITAL.name}</h3>
              <p className="sq-small" style={{ marginTop: ".5rem" }}>Runs alongside every level</p>
            </div>
            <p className="sq-body">{CAPITAL.summary} {CAPITAL.forWho}</p>
            <Link href={CAPITAL.href} className="sq-link">{CAPITAL.cta}</Link>
          </div>
        </section>

        {/* Services */}
        <section className="sq-section" aria-labelledby="services-title">
          <div className="sq-head">
            <h2 id="services-title" className="sq-h2">Hire us for one job.</h2>
            <div>
              <p className="sq-body">
                Each service has a set scope, an owner on our side, and a price you see before you start.
                Pass-through costs like ad spend and postage are always listed separately.
              </p>
              <p style={{ marginTop: "1.5rem" }}>
                <Link href="/services" className="sq-link">See all services</Link>
              </p>
            </div>
          </div>
          <ul className="sq-service-grid" role="list">
            {SERVICES.map((s) => (
              <li key={s.id} className="sq-service">
                <h3 className="sq-h3">{s.name}</h3>
                <p>{s.summary}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Close */}
        <section className="sq-section home-close">
          <h2 className="sq-h2">Not sure where you fit?</h2>
          <p className="sq-lede" style={{ marginTop: "1.25rem" }}>
            Tell us what is going on in the business. We read every application and point you to the right place.
          </p>
          <div className="sq-actions" style={{ marginTop: "2rem" }}>
            <Link href="/apply" className="sq-btn sq-btn-primary">Apply</Link>
            <Link href="/team" className="sq-btn sq-btn-ghost">Meet the team</Link>
          </div>
        </section>
      </div>

      <style>{`
        .home-hero {
          min-height: calc(100svh - 4rem);
          display: flex; flex-direction: column; justify-content: center;
          padding: clamp(3rem, 8vh, 6rem) var(--sq-pad);
        }
        @media (max-width: 1023px) { .home-hero { min-height: 0; padding-block: 4.5rem; } }
        .home-title { max-width: 15ch; }
        .home-sub { margin-top: clamp(1.5rem, 3vh, 2rem); }
        .home-cta { margin-top: clamp(2rem, 4vh, 2.75rem); }

        .home-rot-wrap { white-space: nowrap; }
        .home-rot {
          position: relative; display: inline-block; vertical-align: bottom;
          overflow: hidden; padding-bottom: .22em; margin-bottom: -.22em;
        }
        .home-word { display: inline-block; white-space: nowrap; font-style: italic; }
        .home-word-in { animation: home-in .52s cubic-bezier(.32,.72,0,1) both; }
        .home-word-out { position: absolute; left: 0; top: 0; animation: home-out .52s cubic-bezier(.32,.72,0,1) both; }
        @keyframes home-in { from { transform: translateY(140%); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes home-out { to { transform: translateY(-140%); opacity: 0; } }
        .home-rot-line { position: absolute; left: 0; right: .35em; bottom: .05em; height: 2px; background: var(--souq-coral); }
        @media (max-width: 640px) { .home-rot-wrap { white-space: normal; } .home-word { white-space: normal; } }

        /* Staircase: spans the full grid width so steps sit exactly on the column rules */
        .home-stairs {
          list-style: none; padding: 0; margin: 0 calc(-1 * var(--sq-pad));
          display: grid; grid-template-columns: repeat(4, 1fr); align-items: end;
        }
        .home-step {
          --h: calc(15rem + var(--depth) * 3.25rem);
          min-height: var(--h);
          display: flex; flex-direction: column; gap: .9rem;
          padding: 1.5rem clamp(1rem, 1.8vw, 1.75rem) 1.6rem;
          border-top: 2px solid color-mix(in srgb, var(--souq-coral) calc(var(--depth) * 24%), var(--sq-line));
          background: linear-gradient(to bottom,
            color-mix(in srgb, var(--souq-coral) calc(var(--depth) * 3.5%), transparent),
            transparent 85%);
        }
        .home-step-summary { margin: 0; color: var(--sq-muted); font-size: .975rem; line-height: 1.55; }
        .home-step-link { margin-top: auto; align-self: flex-start; }

        .home-capital {
          margin: 0 calc(-1 * var(--sq-pad));
          display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 1.5rem;
          align-items: center;
          padding: 1.75rem clamp(1rem, 1.8vw, 1.75rem);
          border-top: 1px solid color-mix(in srgb, var(--souq-blue) 45%, var(--sq-line));
          border-bottom: 1px solid var(--sq-line);
          background: color-mix(in srgb, var(--souq-blue) 5%, transparent);
        }
        .home-capital .sq-link { justify-self: end; }

        .home-close { padding-bottom: clamp(5rem, 12vw, 9rem); }

        @media (max-width: 900px) {
          .home-stairs { grid-template-columns: 1fr 1fr; row-gap: 0; }
          .home-step { --h: auto; }
          .home-capital { grid-template-columns: 1fr; }
          .home-capital .sq-link { justify-self: start; }
        }
        @media (max-width: 560px) {
          .home-stairs { grid-template-columns: 1fr; }
          .home-step { gap: .7rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .home-word-in, .home-word-out { animation: none; }
        }
      `}</style>
    </SitePage>
  );
}
