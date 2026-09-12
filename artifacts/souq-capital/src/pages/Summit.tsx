import { useEffect, useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import SouqLogo from "@/components/SouqLogo";
import staticSummitDetails from "@/data/summit";
import type { SummitDetails } from "@/data/summit";

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
  const [ready, setReady] = useState(false);
  const details: SummitDetails = staticSummitDetails;

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

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

        <section className="summit-agenda">
          <div className="summit-section-label">{details.agenda.label}</div>
          <div className="summit-agenda-content">
            <h2>{details.agenda.heading}</h2>
            <div className="summit-agenda-groups">
              {details.agenda.groups.map((group, groupIndex) => (
                <section className="summit-agenda-group" key={group.label}>
                  {groupIndex > 0 ? (
                    <header className="summit-agenda-group-heading">
                      <div>
                        <span className="summit-card-index">
                          {String(groupIndex).padStart(2, "0")}
                        </span>
                        <h3>{group.label}</h3>
                      </div>
                      <p>{group.time}</p>
                    </header>
                  ) : null}
                  <div className="summit-agenda-items">
                    {group.items.map((item) =>
                      item.kind === "break" ? (
                        <div className="summit-agenda-break" key={`${group.label}-${item.segment}`}>
                          <span>{item.segment}</span>
                          <time>
                            {item.start}–{item.end}
                          </time>
                        </div>
                      ) : (
                        <article
                          className="summit-agenda-item"
                          key={`${group.label}-${item.start}-${item.segment}`}
                        >
                          <time>
                            <span>{item.start}</span>
                            <span>{item.end}</span>
                          </time>
                          <div className="summit-agenda-item-main">
                            <div className="summit-agenda-item-heading">
                              <h4>{item.segment}</h4>
                            </div>
                            {item.speakers ? (
                              <p className="summit-agenda-meta">
                                <strong>Featuring</strong>
                                {item.speakers}
                              </p>
                            ) : null}
                            {item.description ? (
                              <p
                                className={`summit-agenda-description${
                                  item.singleLineDescription ? " summit-agenda-description-single-line" : ""
                                }`}
                              >
                                {item.description}
                              </p>
                            ) : null}
                          </div>
                        </article>
                      ),
                    )}
                  </div>
                </section>
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

                  // Keep each guest card readable while making only the
                  // person's name the LinkedIn target. A multi-person company
                  // gets one card with a stacked list so the company isn't
                  // repeated.
                  if (guest.people.length === 1) {
                    const person = guest.people[0];
                    const inner = (
                      <>
                        {logo}
                        {guest.company ? <strong>{guest.company}</strong> : null}
                        <span>
                          {person.linkedin ? (
                            <a
                              className="summit-guest-name-link"
                              href={person.linkedin}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {person.name}
                            </a>
                          ) : (
                            person.name
                          )}
                          {person.role ? ` · ${person.role}` : ""}
                        </span>
                      </>
                    );
                    return (
                      <li key={key}>
                        <div className="summit-guest-card">{inner}</div>
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
                                  <span className="summit-guest-name-link">{person.name}</span>
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
        .summit-title em {
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
        .summit-agenda {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 3rem;
          padding: clamp(4rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3.5rem);
          border-bottom: 1px solid oklch(0.27 0.005 285);
        }
        .summit-agenda-content {
          min-width: 0;
        }
        .summit-agenda-content h2 {
          max-width: 18ch;
          margin: 0 0 1.8rem;
          font-size: clamp(2rem, 4.6vw, 4.1rem);
          font-weight: 400;
          line-height: .98;
          letter-spacing: -.055em;
        }
        .summit-agenda-groups {
          display: grid;
          gap: 2.8rem;
          margin-top: 3.5rem;
        }
        .summit-agenda-group {
          min-width: 0;
          border-top: 1px solid oklch(0.27 0.005 285);
        }
        .summit-agenda-group-heading {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.1rem 0;
        }
        .summit-agenda-group-heading > div {
          display: flex;
          align-items: baseline;
          gap: .75rem;
          min-width: 0;
        }
        .summit-agenda-group-heading h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 500;
          letter-spacing: -.035em;
        }
        .summit-agenda-group-heading p {
          flex: none;
          margin: 0;
          color: oklch(0.58 0.006 285);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: .7rem;
          letter-spacing: .06em;
          text-transform: uppercase;
        }
        .summit-agenda-items {
          border-top: 1px solid oklch(0.27 0.005 285);
        }
        .summit-agenda-item {
          display: grid;
          grid-template-columns: 6.5rem minmax(0, 1fr);
          gap: 1.5rem;
          padding: 1.3rem 0;
          border-bottom: 1px solid oklch(0.27 0.005 285);
        }
        .summit-agenda-item > time {
          display: grid;
          align-content: start;
          gap: .2rem;
          color: var(--souq-coral);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: .72rem;
          letter-spacing: .03em;
          line-height: 1.35;
        }
        .summit-agenda-item > time span:last-child {
          color: oklch(0.5 0.006 285);
        }
        .summit-agenda-item-main {
          min-width: 0;
        }
        .summit-agenda-item-heading {
          display: block;
        }
        .summit-agenda-item-heading h4 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 500;
          line-height: 1.25;
          letter-spacing: -.025em;
        }
        .summit-agenda-meta,
        .summit-agenda-description {
          margin: .55rem 0 0;
          color: oklch(0.62 0.006 285);
          font-size: .88rem;
          line-height: 1.45;
        }
        .summit-agenda-meta strong {
          margin-right: .45rem;
          color: oklch(0.47 0.006 285);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: .64rem;
          font-weight: 400;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .summit-agenda-description {
          max-width: 48ch;
          color: oklch(0.72 0.006 285);
        }
        @media (min-width: 721px) {
          .summit-agenda-description-single-line {
            max-width: none;
            white-space: nowrap;
          }
        }
        .summit-agenda-break {
          display: flex;
          align-items: center;
          gap: .8rem;
          padding: .8rem 0;
          border-bottom: 1px solid oklch(0.27 0.005 285);
          color: oklch(0.52 0.006 285);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: .7rem;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .summit-agenda-break span:first-child {
          color: var(--souq-coral);
        }
        .summit-agenda-break time {
          margin-left: auto;
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
          grid-template-columns: repeat(3, minmax(0, 1fr));
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
        .summit-guest-name-link {
          color: inherit;
          text-decoration: underline;
          text-decoration-color: color-mix(in srgb, currentColor 35%, transparent);
          text-underline-offset: .16em;
          transition: color .2s ease, text-decoration-color .2s ease;
        }
        .summit-guest-name-link:hover {
          color: var(--souq-coral);
          text-decoration-color: var(--souq-coral);
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
        .summit-logo-image {
          width: 8rem;
          height: auto;
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
        @media (max-width: 1040px) {
          .summit-guests-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
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
           .summit-agenda,
          .summit-experience,
          .summit-guests { display: block; padding: 4.5rem 1.25rem; }
          .summit-intro-copy,
           .summit-agenda-content,
          .summit-experience-grid,
          .summit-guests-content { margin-top: 2rem; }
          .summit-intro-copy h2 { font-size: 2.55rem; }
           .summit-agenda-content h2 { font-size: 2.55rem; }
          .summit-guests-content h2 { font-size: 2.55rem; }
          .summit-guests-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .summit-experience-grid { grid-template-columns: 1fr; }
           .summit-agenda-group-heading {
             display: block;
           }
           .summit-agenda-group-heading p {
             margin-top: .55rem;
           }
           .summit-agenda-item {
             grid-template-columns: 1fr;
             gap: .7rem;
           }
           .summit-agenda-item > time {
             display: flex;
             align-items: baseline;
             gap: .5rem;
           }
           .summit-agenda-item > time span + span::before {
             content: "—";
             margin-right: .5rem;
             color: oklch(0.42 0.006 285);
           }
          .summit-experience article { min-height: 12rem; }
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