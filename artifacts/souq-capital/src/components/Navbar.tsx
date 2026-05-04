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
        {/* Logo */}
        <Link href="/" data-testid="logo-link">
          <div className="flex items-center gap-0 cursor-pointer">
            <span className="bg-[#14181A] text-white font-heading font-bold text-sm px-3 py-1.5 rounded-lg tracking-tight">
              S<span className="inline-block w-2 h-2 bg-white rounded-full mx-0.5 align-middle" style={{ verticalAlign: "middle", display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "white", margin: "0 1px 2px 1px" }} />uq.Capital
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          <button
            onClick={() => scrollTo("about")}
            data-testid="nav-about"
            className="text-sm text-[#14181A] hover:text-black transition-colors font-normal"
          >
            About
          </button>
          <button
            onClick={() => scrollTo("how-it-works")}
            data-testid="nav-how-it-works"
            className="text-sm text-[#14181A] hover:text-black transition-colors font-normal"
          >
            How it works
          </button>
          <button
            onClick={() => scrollTo("team")}
            data-testid="nav-team"
            className="text-sm text-[#14181A] hover:text-black transition-colors font-normal"
          >
            Team
          </button>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link href="/apply" data-testid="nav-apply-btn">
            <button className="hidden md:block border border-[#14181A] text-[#14181A] text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#14181A] hover:text-white transition-all duration-200">
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
          <button onClick={() => scrollTo("how-it-works")} className="text-sm font-medium text-left">How it works</button>
          <button onClick={() => scrollTo("team")} className="text-sm font-medium text-left">Team</button>
          <Link href="/apply">
            <button className="w-full border border-[#14181A] text-[#14181A] text-sm font-medium px-5 py-2 rounded-lg">Apply</button>
          </Link>
        </div>
      )}
    </nav>
  );
}
