import { Link } from "wouter";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#14181A]">
      <Navbar tone="light" />
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
