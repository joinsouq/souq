import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (location !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
      } border-b border-black/8`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / breadcrumb */}
        <div className="flex items-center gap-2">
          <Link href="/" data-testid="logo-link" className="flex items-center gap-2 text-[#14181A] no-underline">
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2.5 14.5V7.5a5.5 5.5 0 0 1 11 0v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
                style={ready ? { strokeDasharray: 40, strokeDashoffset: 0, animation: "nav-draw 1.4s cubic-bezier(.22,1,.36,1) .15s both" } : { strokeDasharray: 40, strokeDashoffset: 40 }}
              />
            </svg>
            <style>{`@keyframes nav-draw { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }`}</style>
            <span style={{ fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "-0.035em" }}>Souq</span>
          </Link>
          <span className="text-[#ccc]" style={{ fontSize: "16px", fontWeight: 300 }}>/</span>
          <span className="text-[#14181A]" style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em" }}>Capital</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-[84px]">
          <button
            onClick={() => scrollTo("about")}
            data-testid="nav-about"
            className="text-[#666666] hover:text-black transition-colors"
            style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: "2em" }}
          >
            About
          </button>
          <button
            onClick={() => scrollTo("how-it-works")}
            data-testid="nav-how-it-works"
            className="text-[#666666] hover:text-black transition-colors"
            style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: "2em" }}
          >
            How it Works?
          </button>
          <button
            onClick={() => scrollTo("team")}
            data-testid="nav-team"
            className="text-[#666666] hover:text-black transition-colors"
            style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: "2em" }}
          >
            Team
          </button>
          <Link href="/accelerator">
            <span
              data-testid="nav-accelerator"
              className="text-[#666666] hover:text-black transition-colors cursor-pointer"
              style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: "2em" }}
            >
              Accelerator
            </span>
          </Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link href="/apply" data-testid="nav-apply-btn">
            <button className="hidden md:block bg-[#14181A] text-white text-sm font-medium px-5 py-2 transition-all duration-200 hover:bg-black/80" style={{ borderRadius: "99px" }}>
              Apply
            </button>
          </Link>
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="nav-mobile-menu"
          >
            <div className="w-5 h-0.5 bg-[#14181A] mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-[#14181A] mb-1" />
            <div className="w-5 h-0.5 bg-[#14181A]" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-black/8 px-6 py-4 flex flex-col gap-4">
          <button onClick={() => scrollTo("about")} className="text-sm font-medium text-left">About</button>
          <button onClick={() => scrollTo("how-it-works")} className="text-sm font-medium text-left">How it Works?</button>
          <button onClick={() => scrollTo("team")} className="text-sm font-medium text-left">Team</button>
          <button onClick={() => scrollTo("accelerator")} className="text-sm font-medium text-left">Accelerator</button>
          <Link href="/apply">
            <button className="w-full border border-[#14181A] text-[#14181A] text-sm font-medium px-5 py-2 rounded-lg">Apply</button>
          </Link>
        </div>
      )}
    </nav>
  );
}
