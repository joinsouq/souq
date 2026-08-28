import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { CAPITAL_TEAM, OS_TEAM } from "@/data/team";
import { useLocation } from "wouter";

export default function Team() {
  const [location] = useLocation();

  useEffect(() => {
    // Handle hash navigation
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <main className="team-page">
      <Navbar tone="dark" />
      <div className="team-atmosphere" aria-hidden="true" />
      <div className="team-grain" aria-hidden="true" />
      
      {/* ── HERO ── */}
      <section className="team-hero">
        <div className="team-container team-hero-inner">
          <div>
            <ScrollReveal>
              <p className="team-eyebrow">Souq · The Collective</p>
              <h1>The people behind<br/><em>the capital.</em></h1>
            </ScrollReveal>
          </div>
          <div className="team-hero-side">
            <ScrollReveal delay={100}>
              <p>We are a collective of founders, operators, and investors building the tools we wished we had.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── SOUQ CAPITAL TEAM ── */}
      <section id="capital" className="team-section">
        <div className="team-container">
          <div className="team-section-header">
            <ScrollReveal>
              <p className="team-label">Souq Capital + Accelerator</p>
              <h2>Investment & Accelerator</h2>
              <p className="team-lede">
                Investing in and working alongside the founders building the next generation of consumer brands.
              </p>
            </ScrollReveal>
          </div>

          <div className="team-grid">
            {CAPITAL_TEAM.map((member, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="team-card group">
                  <div className="team-card-image-wrap">
                    <img
                      src={member.img}
                      alt={member.name}
                      style={{ objectPosition: member.objectPosition }}
                    />
                    <div className="team-card-overlay"></div>
                  </div>
                  <div className="team-card-meta">
                    <div className="team-card-role">
                      <span className="team-card-role-text">{member.role}</span>
                      {member.programs?.includes("Accelerator") ? (
                        <span className="team-card-badge">Accelerator</span>
                      ) : null}
                    </div>
                    <h3>{member.name}</h3>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPERATING STACK TEAM ── */}
      <section id="operating-stack" className="team-section team-section-os">
        <div className="team-container">
          <div className="team-section-header">
            <ScrollReveal>
              <p className="team-label" style={{ color: "var(--souq-coral)" }}>Operating Stack</p>
              <h2>Advisory & Growth</h2>
              <p className="team-lede">
                Operators scaling consumer brands to market leaders with hands-on expertise in operations and growth.
              </p>
            </ScrollReveal>
          </div>

          <div className="team-grid">
            {OS_TEAM.map((member, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="team-card group">
                  {member.img ? (
                    <div className="team-card-image-wrap">
                      <img
                        src={`${import.meta.env.BASE_URL}${member.img}`}
                        alt={member.name}
                      />
                      <div className="team-card-overlay"></div>
                    </div>
                  ) : (
                    <div className="team-os-monogram">
                      <div className="team-os-monogram-inner">
                        {member.initials}
                      </div>
                    </div>
                  )}
                  <div className="team-card-meta">
                    <div className="team-card-role">
                      <span className="team-card-role-text">{member.role}</span>
                      {member.programs?.includes("Accelerator") ? (
                        <span className="team-card-badge">Accelerator</span>
                      ) : null}
                    </div>
                    <h3>{member.name}</h3>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="team-footer-wrap">
        <Footer tone="dark" />
      </div>

      <style>{`
        .team-page {
          min-height: 100svh;
          background: oklch(0.155 0.004 285);
          color: oklch(0.965 0.002 285);
          font-family: 'Inter', ui-sans-serif, -apple-system, sans-serif;
          font-feature-settings: "cv02" 1, "cv03" 1, "cv04" 1, "ss01" 1;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          position: relative;
        }

        .team-atmosphere {
          position: fixed;
          inset: -25vmax;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(40vmax 40vmax at 80% 10%, color-mix(in srgb, var(--souq-coral) 8%, transparent), transparent 70%),
            radial-gradient(40vmax 40vmax at 20% 90%, color-mix(in srgb, var(--souq-blue-deep) 8%, transparent), transparent 70%);
        }

        .team-grain {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: .035;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .team-container {
          width: min(100% - 2.5rem, 82.5rem);
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* HERO */
        .team-hero {
          position: relative;
          padding: clamp(5rem, 12vh, 9rem) 0 clamp(4rem, 8vh, 6rem);
          border-bottom: 1px solid oklch(0.27 0.005 285);
        }

        .team-hero-inner {
          display: grid;
          grid-template-columns: 1.4fr .6fr;
          gap: 3rem;
          align-items: end;
        }

        .team-eyebrow,
        .team-label {
          margin: 0 0 1.5rem;
          color: oklch(0.55 0.006 285);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: .78rem;
          letter-spacing: .1em;
          line-height: 1.4;
          text-transform: uppercase;
        }
        .team-hero .team-eyebrow {
          color: var(--souq-coral);
        }

        .team-hero h1 {
          max-width: 12ch;
          margin: 0;
          font-size: clamp(3.8rem, 8vw, 7.5rem);
          font-weight: 400;
          letter-spacing: -.07em;
          line-height: .9;
        }
        .team-hero h1 em {
          display: block;
          color: var(--souq-coral);
          font-style: italic;
          font-weight: 350;
        }

        .team-hero-side {
          max-width: 24rem;
          padding-bottom: .5rem;
        }

        .team-hero-side p {
          margin: 0;
          color: oklch(0.7 0.006 285);
          font-size: clamp(1.1rem, 1.8vw, 1.35rem);
          letter-spacing: -.03em;
          line-height: 1.4;
        }

        /* SECTIONS */
        .team-section {
          padding: clamp(5rem, 10vw, 8rem) 0;
          border-bottom: 1px solid oklch(0.27 0.005 285);
          scroll-margin-top: 5rem;
        }
        
        .team-section-os {
          background: oklch(0.18 0.004 285);
        }

        .team-section-header {
          margin-bottom: 4rem;
        }

        .team-section-header h2 {
          max-width: 18ch;
          margin: 0 0 1.5rem;
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 400;
          line-height: .95;
          letter-spacing: -.05em;
        }

        .team-lede {
          max-width: 38rem;
          margin: 0;
          color: oklch(0.66 0.006 285);
          font-size: clamp(1.1rem, 1.5vw, 1.25rem);
          line-height: 1.6;
        }

        /* GRID */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .team-card {
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .team-card-image-wrap {
          position: relative;
           width: min(100%, 12rem);
           aspect-ratio: 1;
           border-radius: 50%;
          overflow: hidden;
          background: #E8E8E8;
           margin-bottom: 1rem;
          border: 1px solid oklch(0.27 0.005 285);
        }

        .team-card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .7s cubic-bezier(.22,1,.36,1);
        }

        .team-card:hover .team-card-image-wrap img {
          transform: scale(1.05);
        }

        .team-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, oklch(0.155 0.004 285 / .25) 0%, transparent 40%);
          pointer-events: none;
        }

        /* OPERATING STACK MONOGRAMS */
        .team-os-monogram {
           width: min(100%, 12rem);
           aspect-ratio: 1;
           border-radius: 50%;
           margin-bottom: 1rem;
          background: oklch(0.155 0.004 285);
          border: 1px solid oklch(0.27 0.005 285);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: border-color .4s ease, background .4s ease;
        }

        .team-card:hover .team-os-monogram {
          border-color: oklch(0.48 0.006 285);
          background: oklch(0.22 0.005 285 / .4);
        }

        .team-os-monogram::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, oklch(0.27 0.005 285 / .6) 0%, transparent 70%);
          opacity: 0;
          transition: opacity .4s ease;
        }

        .team-card:hover .team-os-monogram::before {
          opacity: 1;
        }

        .team-os-monogram-inner {
          position: relative;
          z-index: 1;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: clamp(3rem, 5vw, 4.5rem);
          font-weight: 300;
          color: oklch(0.55 0.006 285);
          letter-spacing: -.05em;
          transition: color .4s ease, transform .4s cubic-bezier(.22,1,.36,1);
        }

        .team-card:hover .team-os-monogram-inner {
          color: var(--souq-coral);
          transform: scale(1.05);
        }

        /* CARD META */
        .team-card-meta {
          display: flex;
          flex-direction: column;
          gap: .5rem;
        }

        .team-card-role {
          display: flex;
          align-items: center;
          gap: .75rem;
          flex-wrap: wrap;
        }

        .team-card-role-text {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: .75rem;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: oklch(0.55 0.006 285);
        }

        .team-card-badge {
          display: inline-flex;
          align-items: center;
          padding: .15rem .45rem;
          border-radius: 1rem;
          background: color-mix(in srgb, var(--souq-coral) 15%, transparent);
          color: var(--souq-coral);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: .65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .team-card h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 500;
          letter-spacing: -.03em;
          color: oklch(0.965 0.002 285);
        }

        .team-footer-wrap {
          position: relative;
          z-index: 2;
        }

        @media (max-width: 1024px) {
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .team-hero {
            padding: 4.5rem 0 4rem;
          }
          .team-hero-inner {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .team-hero h1 {
            max-width: 10ch;
            font-size: clamp(3.2rem, 12vw, 4.5rem);
          }
          .team-hero-side {
            margin-top: 1rem;
          }
          .team-grid {
            grid-template-columns: repeat(1, 1fr);
            gap: 3rem;
          }
          .team-section {
            padding: 4.5rem 0;
          }
          .team-section-header {
            margin-bottom: 3rem;
          }
          .team-section-header h2 {
            font-size: clamp(2.2rem, 8vw, 3rem);
          }
        }
      `}</style>
    </main>
  );
}
