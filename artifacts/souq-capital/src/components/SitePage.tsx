import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import SouqLogo from "@/components/SouqLogo";

const FOOTER_LINKS = [
  { label: "Capital", href: "/capital" },
  { label: "Services", href: "/services" },
  { label: "Accelerator", href: "/accelerator" },
  { label: "Community", href: "/community" },
  { label: "Summit", href: "/summit" },
  { label: "Team", href: "/team" },
  { label: "Careers", href: "/careers" },
  { label: "Apply", href: "/apply" },
];

/** Dark page shell: navbar, the column-rule atmosphere, and the footer. */
export default function SitePage({ children }: { children: ReactNode }) {
  const washRef = useRef<HTMLDivElement>(null);

  // The ambient coral wash drifts toward the pointer on desktop only.
  useEffect(() => {
    const wash = washRef.current;
    if (!wash) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let tx = 50, ty = 18, cx = 50, cy = 18;
    let raf: number | null = null;
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      wash.style.setProperty("--mx", `${cx.toFixed(2)}%`);
      wash.style.setProperty("--my", `${cy.toFixed(2)}%`);
      raf = Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1 ? requestAnimationFrame(tick) : null;
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 100;
      ty = (e.clientY / window.innerHeight) * 100;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="sq">
      <div ref={washRef} className="sq-wash" aria-hidden="true" />
      <div className="sq-grain" aria-hidden="true" />
      <div className="sq-rules" aria-hidden="true"><span /><span /><span /><span /></div>

      <Navbar tone="dark" />
      <main>{children}</main>

      <footer className="sq-footer">
        <div className="sq-footer-inner">
          <div>
            <Link href="/" aria-label="Souq home">
              <SouqLogo variant="white" className="h-[26px] w-auto" />
            </Link>
            <p className="sq-small" style={{ marginTop: "1rem" }}>© {new Date().getFullYear()} Souq</p>
          </div>
          <nav aria-label="Footer">
            {FOOTER_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
