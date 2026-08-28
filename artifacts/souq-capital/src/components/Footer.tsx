import { Link } from "wouter";

interface FooterProps {
  tone?: "light" | "dark";
}

export default function Footer({ tone = "light" }: FooterProps) {
  const isDark = tone === "dark";
  const bgClass = isDark ? "bg-transparent" : "bg-white";
  const borderClass = isDark ? "border-white/10" : "border-black/8";
  
  return (
    <footer className={`border-t py-8 px-6 ${bgClass} ${borderClass}`} data-testid="footer">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className={`text-sm ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}>
          © {new Date().getFullYear()} Souq Capital. All rights reserved.
        </span>
        <div className="flex items-center gap-6">
          <Link href="/" className={`text-sm transition-colors ${isDark ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-[#14181A]'}`}>Home</Link>
          <Link href="/team" className={`text-sm transition-colors ${isDark ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-[#14181A]'}`}>Team</Link>
          <Link href="/apply" className={`text-sm transition-colors ${isDark ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-[#14181A]'}`}>Apply</Link>
        </div>
      </div>
    </footer>
  );
}
