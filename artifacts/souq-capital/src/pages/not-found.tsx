import { Link } from "wouter";
import SouqLogo from "@/components/SouqLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#14181A]">
      <header className="h-16 border-b border-black/8 px-6 flex items-center">
        <Link href="/" aria-label="Souq home">
          <SouqLogo variant="black" className="w-[92px] h-auto" />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground mb-8">Page not found</p>
          <Link href="/" className="underline">Go home</Link>
        </div>
      </main>
    </div>
  );
}
