import { useLayoutEffect, useEffect, useRef, ReactNode, CSSProperties } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}

export default function ScrollReveal({ children, className = "", delay = 0, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // useLayoutEffect fires synchronously before the browser paints, so elements
  // already in the viewport get .visible added before the first paint — no blank flash.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      // In viewport: reveal before paint (delay still honoured via CSS transition)
      if (delay) {
        setTimeout(() => el.classList.add("visible"), delay);
      } else {
        el.classList.add("visible");
      }
      return;
    }
  }, [delay]);

  // IntersectionObserver for elements below the fold — useEffect is fine here
  // because those elements are already hidden and out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.classList.contains("visible")) return; // already revealed above

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
