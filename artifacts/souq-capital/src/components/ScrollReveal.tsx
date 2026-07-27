import { ReactNode, CSSProperties } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}

// Transparent pass-through — no opacity hiding.
// Scroll-based animations were causing content to be invisible on GitHub Pages
// (IntersectionObserver misfires on static deploys). All content renders
// immediately; animations can be re-added later if needed.
export default function ScrollReveal({ children, className = "", style }: Props) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
