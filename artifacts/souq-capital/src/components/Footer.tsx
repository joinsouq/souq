import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-black/8 bg-white" data-testid="footer" style={{ padding: "32px 50px" }}>
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4" style={{ maxWidth: "1320px" }}>
        <span className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Souq Capital. All rights reserved.
        </span>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-[#14181A] transition-colors">Home</Link>
          <Link href="/apply" className="text-sm text-muted-foreground hover:text-[#14181A] transition-colors">Apply</Link>
        </div>
      </div>
    </footer>
  );
}
