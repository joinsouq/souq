import { useEffect, useState } from "react";
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
  const [location] = useLocation();

  const isLinkActive = (href: string) => location === href;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const btnDesktopClass = isDark
    ? "inline-flex min-h-11 items-center justify-center bg-white text-[#14181A] text-sm font-medium px-5 py-2 transition-all duration-200 hover:bg-white/90 rounded-full cursor-pointer"
    : "inline-flex min-h-11 items-center justify-center bg-[#14181A] text-white text-sm font-medium px-5 py-2 transition-all duration-200 hover:bg-black/80 rounded-full cursor-pointer";

  const pageMenuClass = isDark
    ? "text-white/60 hover:text-white"
    : "text-[#666666] hover:text-black";
  const activePageMenuClass = isDark ? "text-white font-semibold" : "text-black font-semibold";

  return (
    <nav
      data-testid="navbar"
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${navBgClass} ${borderClass}`}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-6 min-h-16 flex items-center justify-between">
        <Link href="/" data-testid="logo-link" className="flex items-center text-inherit no-underline">
          <SouqLogo variant={logoVariant} className="h-[30px] w-auto md:h-[32px]" />
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
        </div>
      </div>

      <div
        data-testid="page-menu"
        aria-label="Page menu"
        className={`md:hidden flex items-center gap-7 overflow-x-auto border-t px-4 py-0 whitespace-nowrap ${borderClass}`}
        style={{ scrollbarWidth: "none" }}
      >
        {NAV_LINKS.map(link => (
          <Link key={link.href} href={link.href} className="inline-flex min-h-11 min-w-11 items-center justify-center px-2">
            <span
              data-testid={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center px-2 text-[12px] font-medium transition-colors ${isLinkActive(link.href) ? activePageMenuClass : pageMenuClass}`}
              aria-current={isLinkActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
