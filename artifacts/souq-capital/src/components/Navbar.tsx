import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
      } border-b border-black/8`}
      style={{ padding: "0 50px" }}
    >
      <div className="mx-auto h-16 flex items-center justify-between" style={{ maxWidth: "1320px" }}>
        {/* Logo / breadcrumb */}
        <div className="flex items-center gap-2">
          <Link href="/" data-testid="logo-link">
            <div className="flex items-center cursor-pointer">
              <span className="bg-[#14181A] text-white font-bold text-sm px-3 py-1.5 rounded-lg tracking-tight inline-flex items-center">
                S<svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="inline-block flex-shrink-0 mx-[1px]" aria-hidden="true"><circle cx="6.5" cy="6.5" r="5.5" stroke="white" strokeWidth="1"/><ellipse cx="6.5" cy="6.5" rx="2.8" ry="5.5" stroke="white" strokeWidth="1"/><line x1="1" y1="6.5" x2="12" y2="6.5" stroke="white" strokeWidth="1"/></svg>uq
              </span>
            </div>
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
