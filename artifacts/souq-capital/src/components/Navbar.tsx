import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import SouqLogo from "./SouqLogo";

interface NavbarProps {
  tone?: "light" | "dark";
}

const NAV_LINKS = [
  { label: "Capital", href: "/capital" },
  { label: "Operating Stack", href: "/accelerator" },
  { label: "Summit", href: "/summit" },
  { label: "Team", href: "/team" },
];

export default function Navbar({ tone = "light" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  const isLinkActive = (href: string) => location === href;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isDark = tone === "dark";

  // Use sticky to prevent content from sitting underneath, consistent across all routes
  const navBgClass = isDark
    ? scrolled ? "bg-[#14181A]/95 backdrop-blur-md shadow-sm" : "bg-transparent"
    : scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white";
  const borderClass = isDark ? "border-white/10" : "border-black/8";
  const logoVariant = isDark ? "white" : "black";

  const linkBaseStyle = { fontSize: "13px", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: "1.6em" };

  const getDesktopLinkClass = (active: boolean) => {
    if (isDark) {
      return `transition-colors cursor-pointer ${active ? "text-white font-semibold" : "text-white/60 hover:text-white"}`;
    } else {
      return `transition-colors cursor-pointer ${active ? "text-black font-semibold" : "text-[#666666] hover:text-black"}`;
    }
  };

  const getMobileLinkClass = (active: boolean) => {
    if (isDark) {
      return `text-[13px] font-medium text-left block py-2 ${active ? "text-white font-semibold" : "text-white/60"}`;
    } else {
      return `text-[13px] font-medium text-left block py-2 ${active ? "text-black font-semibold" : "text-[#666666]"}`;
    }
  };

  const btnDesktopClass = isDark
    ? "hidden md:inline-flex items-center justify-center bg-white text-[#14181A] text-sm font-medium px-5 py-2 transition-all duration-200 hover:bg-white/90 rounded-full cursor-pointer"
    : "hidden md:inline-flex items-center justify-center bg-[#14181A] text-white text-sm font-medium px-5 py-2 transition-all duration-200 hover:bg-black/80 rounded-full cursor-pointer";

  const btnMobileClass = isDark
    ? "inline-flex w-full items-center justify-center bg-white text-[#14181A] rounded-full text-sm font-medium px-5 py-2 cursor-pointer mt-2"
    : "inline-flex w-full items-center justify-center border border-[#14181A] text-[#14181A] rounded-full text-sm font-medium px-5 py-2 cursor-pointer mt-2";

  const hamburgerBarClass = isDark ? "bg-white" : "bg-[#14181A]";
  const mobileMenuBgClass = isDark ? "bg-[#14181A] border-white/10" : "bg-white border-black/8";

  return (
    <nav
      data-testid="navbar"
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${navBgClass} ${borderClass}`}
    >
      <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" data-testid="logo-link" className="flex items-center text-inherit no-underline">
          <SouqLogo variant={logoVariant} className="w-[110px]" />
        </Link>

        <div className="hidden md:flex items-center gap-[40px] lg:gap-[60px]">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}>
              <span
                data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={getDesktopLinkClass(isLinkActive(link.href))}
                style={linkBaseStyle}
                aria-current={isLinkActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/apply" data-testid="nav-apply-btn">
            <span className={btnDesktopClass}>
              Apply
            </span>
          </Link>
          <button
            className="md:hidden p-2 flex flex-col justify-center items-center w-8 h-8"
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="nav-mobile-menu"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <div className={`w-5 h-0.5 mb-1 transition-all ${hamburgerBarClass} ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <div className={`w-5 h-0.5 mb-1 transition-all ${hamburgerBarClass} ${menuOpen ? "opacity-0" : ""}`} />
            <div className={`w-5 h-0.5 transition-all ${hamburgerBarClass} ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={`md:hidden border-t px-6 py-4 flex flex-col gap-2 ${mobileMenuBgClass}`}>
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}>
              <span className={getMobileLinkClass(isLinkActive(link.href))} aria-current={isLinkActive(link.href) ? "page" : undefined}>
                {link.label}
              </span>
            </Link>
          ))}
          <Link href="/apply" className="block w-full">
            <span className={btnMobileClass}>Apply</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
