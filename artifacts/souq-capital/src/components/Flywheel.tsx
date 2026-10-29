import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { SERVICES, type Service } from "@/data/offerings";

/**
 * The founder's brand in the middle, ringed by Souq's services as numbered
 * segments, with Capital noted underneath. Drawn in code from SERVICES, so a
 * new service adds a segment. Each segment and label opens its service's
 * detail panel through onSelect.
 *
 * Motion: "YOUR BRAND" decodes into place the first time the ring scrolls
 * into view (and again on hover), and the segments light up one at a time
 * while it's on screen. Hovering or focusing a service holds it lit. Anyone
 * with reduced motion turned on sees it still.
 */

const W = 1200, H = 700, CX = 600, CY = 350;
const R_IN = 150, R_OUT = 230, R_NUM = 190, R_LABEL = 266, GAP_DEG = 3;
const TARGET = "YOUR BRAND";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+#";

const pt = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};
const f = (n: number) => n.toFixed(1);
function sector(a1: number, a2: number) {
  const [x1, y1] = pt(R_OUT, a1), [x2, y2] = pt(R_OUT, a2), [x3, y3] = pt(R_IN, a2), [x4, y4] = pt(R_IN, a1);
  return `M${f(x1)} ${f(y1)} A${R_OUT} ${R_OUT} 0 0 1 ${f(x2)} ${f(y2)} L${f(x3)} ${f(y3)} A${R_IN} ${R_IN} 0 0 0 ${f(x4)} ${f(y4)} Z`;
}

function useMedia(q: string) {
  const [on, setOn] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const h = () => setOn(m.matches);
    h();
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, [q]);
  return on;
}

/** Letters flicker through random characters and settle left to right. */
function useDecode(reduced: boolean) {
  const [text, setText] = useState(TARGET);
  const timer = useRef<number | undefined>(undefined);
  const run = () => {
    if (reduced) return;
    window.clearInterval(timer.current);
    let frame = 0;
    timer.current = window.setInterval(() => {
      frame += 1;
      const settled = Math.floor(frame / 2);
      setText(TARGET.split("").map((c, i) => (c === " " || i < settled ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(""));
      if (settled >= TARGET.length) {
        window.clearInterval(timer.current);
        setText(TARGET);
      }
    }, 45);
  };
  useEffect(() => () => window.clearInterval(timer.current), []);
  return { text, run };
}

export default function Flywheel({ onSelect }: { onSelect: (s: Service) => void }) {
  const narrow = useMedia("(max-width: 760px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [sweep, setSweep] = useState(-1);
  const [hover, setHover] = useState<number | null>(null);
  const { text, run } = useDecode(reduced);
  const decoded = useRef(false);

  // Only animate while the ring is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (inView && !decoded.current) {
      decoded.current = true;
      run();
    }
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (reduced || !inView || hover !== null) return;
    const t = window.setInterval(() => setSweep((i) => (i + 1) % SERVICES.length), 1300);
    return () => window.clearInterval(t);
  }, [reduced, inView, hover]);

  const n = SERVICES.length;
  const step = 360 / n;
  const lit = hover ?? sweep;
  const items = SERVICES.map((s, i) => {
    const c = -90 + step / 2 + step * i;
    const [nx, ny] = pt(R_NUM, c);
    const [lx, ly] = pt(R_LABEL, c);
    const cos = Math.cos((c * Math.PI) / 180), sin = Math.sin((c * Math.PI) / 180);
    const tx = cos >= 0 ? "0" : "-100%";
    const ty = sin < -0.5 ? "-100%" : sin > 0.5 ? "0" : "-50%";
    return {
      s, i, num: String(i + 1).padStart(2, "0"),
      d: sector(c - step / 2 + GAP_DEG / 2, c + step / 2 - GAP_DEG / 2),
      nx, ny,
      labelStyle: { left: `${(lx / W) * 100}%`, top: `${(ly / H) * 100}%`, transform: `translate(${tx}, ${ty})`, textAlign: cos >= 0 ? "left" : "right" } as const,
    };
  });
  const view = narrow ? `${CX - 250} ${CY - 250} 500 500` : `0 0 ${W} ${H}`;
  const hold = (i: number) => () => setHover(i);
  const release = () => setHover(null);

  return (
    <figure ref={ref} className={`sq-ring${narrow ? " sq-ring-narrow" : ""}`}>
      <div className="sq-ring-stage" style={{ aspectRatio: narrow ? "1 / 1" : `${W} / ${H}` }}>
        <svg viewBox={view} aria-hidden="true" focusable="false">
          {items.map(({ s, i, d, nx, ny, num }) => (
            <g key={s.id} className={`sq-ring-seg${lit === i ? " is-lit" : ""}`}
              onMouseEnter={hold(i)} onMouseLeave={release} onClick={() => onSelect(s)}>
              <path d={d} />
              <text x={f(nx)} y={f(ny)} textAnchor="middle" dominantBaseline="central">{num}</text>
            </g>
          ))}
          <circle cx={CX} cy={CY} r={R_IN - 18} className="sq-ring-core" />
        </svg>

        <div className="sq-ring-center" onMouseEnter={run}>
          <span className="sq-ring-name">{text}<span className="sq-ring-cursor" aria-hidden="true">_</span></span>
          <span className="sq-ring-sub">You keep the final say</span>
        </div>

        {!narrow && items.map(({ s, i, labelStyle }) => (
          <button key={s.id} type="button" className={`sq-ring-label${lit === i ? " is-lit" : ""}`} style={labelStyle}
            onMouseEnter={hold(i)} onMouseLeave={release} onFocus={hold(i)} onBlur={release}
            onClick={() => onSelect(s)} aria-haspopup="dialog">
            {s.name}
          </button>
        ))}
      </div>

      {narrow && (
        <ol className="sq-ring-list" role="list">
          {items.map(({ s, i, num }) => (
            <li key={s.id}>
              <button type="button" className={lit === i ? "is-lit" : undefined} onFocus={hold(i)} onBlur={release}
                onClick={() => onSelect(s)} aria-haspopup="dialog">
                <span className="sq-ring-list-num">{num}</span>{s.name}
              </button>
            </li>
          ))}
        </ol>
      )}

      <Link href="/capital" className="sq-ring-capital">
        <span className="sq-ring-capital-tag">CAPITAL</span> runs alongside all of it
      </Link>

      <figcaption className="sr-only">
        Your brand at the center, ringed by Souq's services: {SERVICES.map((s) => s.name).join(", ")}.
        Capital runs alongside all of them.
      </figcaption>
    </figure>
  );
}
