import { useLayoutEffect, useEffect, useRef, useState, ReactNode, CSSProperties } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}

export default function ScrollReveal({ children, className = "", delay = 0, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // null = not yet measured, false = in viewport (skip animation), true = below fold
  const [belowFold, setBelowFold] = useState<boolean | null>(null);
  const [revealed, setRevealed] = useState(false);

  // Runs synchronously before first paint — hides below-fold elements without
  // ever touching elements already in the viewport.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setBelowFold(rect.top >= window.innerHeight);
  }, []);

  // IntersectionObserver to reveal below-fold elements on scroll.
  useEffect(() => {
    if (belowFold !== true) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [belowFold, delay]);

  const hidden = belowFold === true && !revealed;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        // Transition is always set when below-fold so it's active when revealed=true fires.
        // No transition for in-viewport elements (belowFold false/null) — they just appear.
        transition: belowFold ? "opacity 0.6s ease, transform 0.6s ease" : undefined,
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(24px)" : "translateY(0)",
      }}
    >
      {children}
    </div>
  );
}
