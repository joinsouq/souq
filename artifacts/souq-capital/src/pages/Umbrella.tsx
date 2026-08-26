import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import SouqLogo from "@/components/SouqLogo";

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

const TRIAD = [
  {
    idx: "01", label: "Capital", href: "/capital",
    desc: "Fuel your growth, without debt or dilution. We fund what drives your business — and only win when you do.",
  },
  {
    idx: "02", label: "The Operating Stack", href: "/accelerator",
    desc: "Operations, fulfillment, media buying, and finance — we advise or fractionally operate your business across everything it takes to go from 6 to 7 figures.",
  },
  {
    idx: "03", label: "Summit", href: "/summit",
    desc: "Industry veterans at your disposal — senior operators who bring CMO, COO, CFO, and CEO-level judgment to the moments that matter.",
  },
];

export default function Umbrella() {
  const [ready,     setReady]     = useState(false);
  const [wordIdx,   setWordIdx]   = useState(0);
  const [prevIdx,   setPrevIdx]   = useState<number | null>(null);
  const washRef = useRef<HTMLDivElement>(null);

  /* entrance */
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* ambient wash tracks pointer */
  useEffect(() => {
    const wash = washRef.current;
    if (!wash || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let tx = 50, ty = 22, cx = 50, cy = 22, raf: number | null = null;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth)  * 100;
      ty = (e.clientY / window.innerHeight) * 100;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    function tick() {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      wash!.style.setProperty("--mx", cx.toFixed(2) + "%");
      wash!.style.setProperty("--my", cy.toFixed(2) + "%");
      raf = (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1)
        ? requestAnimationFrame(tick) : null;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  /* word rotator */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setWordIdx(prev => {
        const next = (prev + 1) % WORDS.length;
        setPrevIdx(prev);
        setTimeout(() => setPrevIdx(null), 650);
        return next;
      });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      data-ready={ready}
      className="u-page"
    >
      {/* ── ambient wash ── */}
      <div
        ref={washRef}
        aria-hidden="true"
        className="u-wash"
        style={{ opacity: ready ? 1 : 0 }}
      />

      {/* ── film grain ── */}
      <div aria-hidden="true" className="u-grain" />

      {/* ── Swiss column rules ── */}
      <div aria-hidden="true" className="u-rules">
        <span /><span /><span /><span />
      </div>

      {/* ── shell ── */}
      <div className="u-shell">

        {/* header */}
        <header className="u-pad u-header">
          <a href="/" className="u-mark">
            <SouqLogo variant="white" className="u-logo-image" />
          </a>
          <div className={`u-triad u-header-nav u-reveal${ready ? " u-vis" : ""}`} style={{ "--d": "340ms" } as React.CSSProperties}>
            {TRIAD.map((item, i) =>
              <Link key={item.idx} href={item.href} className={`u-triad-item${i > 0 ? " u-triad-border" : ""}`}>
                <span className="u-triad-lbl">{item.label}</span>
                <svg className="u-triad-arrow" width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            )}
          </div>
        </header>

        {/* hero */}
        <main className="u-pad u-main">
          <h1 className={`u-h1 u-reveal${ready ? " u-vis" : ""}`} style={{ "--d": "85ms" } as React.CSSProperties}>
            One place to build a{" "}
            {/* rotator */}
            <span style={{ whiteSpace: "nowrap" }}>
              <span className="u-rotator" aria-hidden="true">
                {/* outgoing word */}
                {prevIdx !== null && (
                  <span key={`out-${prevIdx}`} className="u-word u-word-out">
                    {WORDS[prevIdx]}
                  </span>
                )}
                {/* current word */}
                <span key={`in-${wordIdx}`} className="u-word u-word-in">
                  {WORDS[wordIdx]}
                </span>
                <span className="u-underline" />
              </span>
              <span className="sr-only">{WORDS[wordIdx]}</span>.
            </span>
          </h1>

          <p className={`u-sub u-reveal${ready ? " u-vis" : ""}`} style={{ "--d": "170ms" } as React.CSSProperties}>
            Souq is the one-stop shop for CPG and SMB businesses — growth
            capital, the operating stack, and industry veterans at your
            disposal.
          </p>

        </main>

      </div>


      <style>{`
        /* ── dark base ── */
        .u-page {
          min-height: 100svh;
          background: oklch(0.155 0.004 285);
          color: oklch(0.965 0.002 285);
          font-family: 'Inter', ui-sans-serif, -apple-system, sans-serif;
          font-feature-settings: "cv02" 1,"cv03" 1,"cv04" 1,"ss01" 1;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          position: relative;
        }

        /* ── ambient layers ── */
        .u-wash {
          position: fixed; inset: -20vmax; z-index: 0; pointer-events: none;
          background:
            radial-gradient(38vmax 38vmax at var(--mx,50%) var(--my,22%), color-mix(in srgb, var(--souq-coral) 12%, transparent), transparent 68%),
            radial-gradient(30vmax 30vmax at 12% 84%, color-mix(in srgb, var(--souq-blue) 10%, transparent), transparent 70%);
          transition: opacity .8s ease; will-change: background;
        }
        .u-grain {
          position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: .03;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .u-rules {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          display: grid; grid-template-columns: repeat(4,1fr);
          width: min(calc(100% - 3rem), 76rem); margin-inline: auto;
        }
        .u-rules span { border-left: 1px solid oklch(0.27 0.005 285); opacity: .55; }
        .u-rules span:first-child { border-left-color: oklch(0.36 0.006 285); opacity: .8; }
        @media (max-width:720px) { .u-rules { display:none; } }

        /* shell */
        .u-shell {
          position: relative; z-index: 2;
          width: min(calc(100% - 3rem), 76rem); margin-inline: auto;
          min-height: 100svh; display: flex; flex-direction: column;
          border-inline: 1px solid oklch(0.36 0.006 285);
        }
        @media (max-width:720px) { .u-shell { width:100%; border-inline:0; } }
        .u-pad { padding-inline: clamp(1.25rem, 4vw, 3.5rem); }

        /* header */
        .u-header {
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding-block: 1.4rem;
          border-bottom: 1px solid oklch(0.27 0.005 285);
        }
        .u-mark {
          display: inline-flex; align-items: center;
          text-decoration: none; color: inherit;
        }
        .u-logo-image {
          display: inline-flex;
          align-items: center;
          width: clamp(6.5rem, 8vw, 7.5rem);
          height: auto;
        }
        .u-status {
          display: inline-flex; align-items: center; gap: .5rem;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: .78rem; letter-spacing: .08em; text-transform: uppercase;
          color: oklch(0.66 0.006 285); white-space: nowrap;
        }
        .u-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--souq-coral); position: relative; flex: none;
        }
        .u-dot::after {
          content: ""; position: absolute; inset: 0; border-radius: 50%;
          background: var(--souq-coral);
          animation: u-pulse 2.6s cubic-bezier(.22,1,.36,1) infinite;
        }
        @keyframes u-pulse { 0%{transform:scale(1);opacity:.7} 70%,100%{transform:scale(3.2);opacity:0} }

        /* main */
        .u-main {
          flex: 1; display: flex; flex-direction: column; justify-content: center;
          padding-block: clamp(2rem, 6vh, 5rem);
        }
        .u-eyebrow {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: .78rem; letter-spacing: .14em; text-transform: uppercase;
          color: oklch(0.45 0.006 285); margin: 0 0 clamp(1.5rem,4vh,2.5rem);
        }
        .u-h1 {
          margin: 0;
          font-size: clamp(2.6rem, 7.4vw, 5.9rem);
          line-height: .96; letter-spacing: -0.045em; font-weight: 400; max-width: 22ch;
        }
        .u-sub {
          margin: clamp(1.25rem,3vh,1.75rem) 0 0; max-width: 46ch;
           font-size: clamp(1.2rem, 1.55vw, 1.35rem);
          line-height: 1.55; color: oklch(0.66 0.006 285); letter-spacing: -0.011em;
        }
        .u-sub strong { color: oklch(0.965 0.002 285); font-weight: 500; }

        /* rotator */
        .u-rotator {
          position: relative; display: inline-block; vertical-align: bottom;
          overflow: hidden; padding-bottom: .24em; margin-bottom: -.24em;
        }
        .u-word {
          display: inline-block; white-space: nowrap; font-style: italic; font-weight: 400;
        }
        .u-word-in  { animation: u-word-in  .52s cubic-bezier(.32,.72,0,1) both; }
        .u-word-out {
          position: absolute; left: 0; top: 0;
          animation: u-word-out .52s cubic-bezier(.32,.72,0,1) both;
        }
        @keyframes u-word-in  { from { transform: translateY(140%); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes u-word-out { from { transform: none; opacity: 1; } to { transform: translateY(-140%); opacity: 0; } }
        .u-underline {
          position: absolute; left: 0; right: 0; bottom: .06em; height: 2px;
          background: var(--souq-coral); opacity: .8;
        }

        /* triad */
        .u-triad {
          display: grid; grid-template-columns: repeat(3,1fr);
          border-top: 1px solid oklch(0.27 0.005 285);
        }
        @media (max-width:600px) { .u-triad { grid-template-columns: 1fr; } }
        .u-triad-item {
          position: relative; padding: 1.25rem 0;
          display: flex; align-items: center;
          text-decoration: none; color: inherit; cursor: pointer;
          overflow: hidden;
        }
        .u-triad-border { border-left: 1px solid oklch(0.27 0.005 285); padding-left: 1.15rem; }
        @media (max-width:600px) {
          .u-triad-border { border-left: 0; padding-left: 0; border-top: 1px solid oklch(0.27 0.005 285); }
        }
        .u-triad-item::after {
          content: ""; position: absolute; left: 0; bottom: -1px; height: 1px; width: 100%;
          background: oklch(0.965 0.002 285);
          transform: scaleX(0); transform-origin: left;
          transition: transform .55s cubic-bezier(.22,1,.36,1);
        }
        .u-triad-item:hover::after { transform: scaleX(1); }
        .u-triad-lbl { font-size: 1.2rem; letter-spacing: -0.012em; color: oklch(0.66 0.006 285); transition: color .3s ease; flex: 1; }
        .u-triad-item:hover .u-triad-lbl { color: oklch(0.965 0.002 285); }
        .u-triad-arrow { flex: none; color: oklch(0.45 0.006 285); opacity: 0; transform: translateX(-4px); transition: opacity .3s ease, transform .3s cubic-bezier(.22,1,.36,1), color .3s ease; }
        .u-triad-item:hover .u-triad-arrow { opacity: 1; transform: none; color: oklch(0.965 0.002 285); }
        .u-header-nav {
          grid-template-columns: repeat(3, auto);
          border-top: 0;
          width: auto;
          flex: none;
        }
        .u-header-nav .u-triad-item {
          min-width: 5rem;
          padding: .35rem 0 .35rem 1.2rem;
        }
        .u-header-nav .u-triad-item:first-child {
          padding-left: 0;
        }
        .u-header-nav .u-triad-border {
          padding-left: 1.2rem;
        }
        @media (max-width:720px) {
          .u-triad-arrow { opacity: 1; transform: none; }
          .u-main { padding-block: clamp(1.5rem, 4vh, 2.5rem); }
          .u-header {
            display: block;
          }
          .u-header-nav {
            width: 100%;
            grid-template-columns: 1fr;
            margin-top: 1.25rem;
            padding-top: .25rem;
            border-top: 1px solid oklch(0.27 0.005 285);
          }
          .u-header-nav .u-triad-item,
          .u-header-nav .u-triad-item:first-child,
          .u-header-nav .u-triad-border {
            min-width: 0;
            padding: .8rem 0;
          }
          .u-header-nav .u-triad-border {
            border-left: 0;
            border-top: 1px solid oklch(0.27 0.005 285);
          }
        }

        /* entrance */
        .u-reveal { opacity: 0; transform: translateY(14px); }
        .u-vis { animation: u-reveal .95s cubic-bezier(.22,1,.36,1) both; animation-delay: var(--d, 0ms); }
        @keyframes u-reveal { to { opacity: 1; transform: none; } }

        /* utils */
        .sr-only { position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0; }

        /* reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .u-reveal, .u-vis { opacity:1 !important; transform:none !important; animation:none !important; }
          .u-wash { display:none; }
          .u-word-in, .u-word-out { animation:none !important; }
        }
      `}</style>
    </div>
  );
}
