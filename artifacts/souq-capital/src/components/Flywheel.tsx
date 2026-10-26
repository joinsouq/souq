import { useEffect, useState } from "react";
import { Link } from "wouter";
import { SERVICES, type Service } from "@/data/offerings";

/**
 * The founder's company in the center, every Souq service feeding into it,
 * and Capital as the outer ring that runs alongside all of it. Drawn in code
 * from SERVICES, so adding a service adds a spoke. Each service opens its
 * detail panel through onSelect.
 */

const WIDE = { w: 1200, h: 660, rx: 440, ry: 232, ringRx: 560, ringRy: 300, core: 98 };
const NARROW = { w: 600, h: 800, rx: 205, ry: 285, ringRx: 272, ringRy: 372, core: 66 };

// Shorter labels for phones, where the pills sit closer together.
const SHORT: Record<string, string> = {
  "3pl": "3PL and returns",
  "customer-service": "Customer service",
  finance: "Finance and CFO",
  content: "Content",
  "media-buying": "Media buying",
  merchandising: "Merchandising",
  "inventory-planning": "Inventory planning",
  "commerce-systems": "Commerce systems",
};

function useNarrow() {
  const q = "(max-width: 760px)";
  const [narrow, setNarrow] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setNarrow(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return narrow;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return reduced;
}

export default function Flywheel({ onSelect }: { onSelect: (s: Service) => void }) {
  const narrow = useNarrow();
  const reduced = useReducedMotion();
  const L = narrow ? NARROW : WIDE;
  const cx = L.w / 2;
  const cy = L.h / 2 - (narrow ? 4 : 10);
  const n = SERVICES.length;

  // Spokes go clockwise from the top. On wide screens they're offset half a
  // step so none sit dead on the axes; on phones one sits at each compass point.
  const offset = narrow ? 0 : 180 / n;
  const nodes = SERVICES.map((s, i) => {
    const a = (-90 + offset + (360 / n) * i) * (Math.PI / 180);
    return { s, x: cx + L.rx * Math.cos(a), y: cy + L.ry * Math.sin(a) };
  });
  const pct = (x: number, y: number) => ({ left: `${(x / L.w) * 100}%`, top: `${(y / L.h) * 100}%` });

  return (
    <figure className={`sq-fly${narrow ? " sq-fly-narrow" : ""}`} style={{ aspectRatio: `${L.w} / ${L.h}` }}>
      <svg viewBox={`0 0 ${L.w} ${L.h}`} aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="fly-glow">
            <stop offset="0" stopColor="var(--souq-coral)" stopOpacity=".32" />
            <stop offset="1" stopColor="var(--souq-coral)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Capital: the outer ring */}
        <ellipse cx={cx} cy={cy} rx={L.ringRx} ry={L.ringRy} className="sq-fly-ring" />
        {/* The orbit the services sit on */}
        <ellipse cx={cx} cy={cy} rx={L.rx} ry={L.ry} className="sq-fly-orbit" />

        {nodes.map(({ s, x, y }, i) => {
          const d = `M${x.toFixed(1)},${y.toFixed(1)} L${cx},${cy}`;
          return (
            <g key={s.id}>
              <path d={d} className="sq-fly-spoke" />
              {!reduced && <path d={d} className="sq-fly-flow" style={{ animationDelay: `${-i * 0.35}s` }} />}
              {!reduced && (
                <circle r={narrow ? 2.5 : 3.5} className="sq-fly-pulse" opacity="0">
                  <animateMotion dur="3.2s" begin={`${(i * 0.4).toFixed(1)}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                  <animate attributeName="opacity" dur="3.2s" begin={`${(i * 0.4).toFixed(1)}s`} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;.15;.8;1" />
                </circle>
              )}
            </g>
          );
        })}

        <circle cx={cx} cy={cy} r={L.core * 2.1} fill="url(#fly-glow)" className={reduced ? undefined : "sq-fly-breathe"} />
        <circle cx={cx} cy={cy} r={L.core} className="sq-fly-core" />
        <circle cx={cx} cy={cy} r={L.core + 10} className="sq-fly-core-ring" />
      </svg>

      <div className="sq-fly-center" style={pct(cx, cy)}>
        <span className="sq-fly-center-title">Your brand</span>
        <span className="sq-fly-center-sub">You keep the final say</span>
      </div>

      {nodes.map(({ s, x, y }) => (
        <button key={s.id} type="button" className="sq-fly-node" style={pct(x, y)} onClick={() => onSelect(s)} aria-haspopup="dialog">
          {narrow ? SHORT[s.id] ?? s.name : s.name}
        </button>
      ))}

      <Link href="/capital" className="sq-fly-capital" style={pct(cx, cy + L.ringRy)}>
        <span className="sq-fly-capital-dot" aria-hidden="true" />
        Capital runs alongside all of it
      </Link>

      <figcaption className="sr-only">
        Your brand at the center, with Souq's services feeding into it: {SERVICES.map((s) => s.name).join(", ")}.
        Capital runs alongside all of them.
      </figcaption>
    </figure>
  );
}
