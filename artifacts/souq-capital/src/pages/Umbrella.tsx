import { Link } from "wouter";
import ScrollReveal from "@/components/ScrollReveal";

const PILLARS = [
  {
    tag: "Working Capital",
    name: "Capital",
    description:
      "Non-dilutive, interest-free funding aligned to your revenue cycle. We pay your suppliers — you pay us back as you sell.",
    stats: ["Interest Free", "Equity Free", "Payback when you sell"],
    href: "/capital",
    cta: "Apply for capital",
  },
  {
    tag: "Growth Program",
    name: "Accelerator",
    description:
      "A structured program for early-stage founders. Capital, mentorship, and a community built on shared values — without compromise.",
    stats: ["Mentorship", "Network", "Community"],
    href: "/capital#accelerator",
    cta: "Learn more",
  },
  {
    tag: "Fulfillment",
    name: "3PL",
    description:
      "Fulfillment run by operators, not middlemen. 1.2M+ orders shipped per year. Same-day by 12pm ET. Built for DTC brands in fashion, supplements, and beverage.",
    stats: ["1.2M+ orders per year", "<0.3% pick error", "Same-day by 12pm ET"],
    href: "/3pl",
    cta: "Get a quote",
  },
];

export default function Umbrella() {
  return (
    <div className="min-h-screen bg-white text-[#14181A]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/8">
        <div
          className="mx-auto h-16 flex items-center justify-between"
          style={{ maxWidth: "1320px", padding: "0 50px" }}
        >
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <span className="bg-[#14181A] text-white font-bold text-sm px-3 py-1.5 rounded-lg tracking-tight">
                S
                <span
                  style={{
                    display: "inline-block",
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    margin: "0 1px 2px 1px",
                    verticalAlign: "middle",
                  }}
                />
                uq
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link href="/capital">
              <span
                className="text-[#666] hover:text-black transition-colors cursor-pointer"
                style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em" }}
              >
                Capital
              </span>
            </Link>
            <Link href="/capital#accelerator">
              <span
                className="text-[#666] hover:text-black transition-colors cursor-pointer"
                style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em" }}
              >
                Accelerator
              </span>
            </Link>
            <Link href="/3pl">
              <span
                className="text-[#666] hover:text-black transition-colors cursor-pointer"
                style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em" }}
              >
                3PL
              </span>
            </Link>
          </div>

          <Link href="/apply">
            <button
              className="hidden md:block bg-[#14181A] text-white text-sm font-medium px-5 py-2 hover:bg-black/80 transition-all"
              style={{ borderRadius: "99px" }}
            >
              Apply
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "160px 50px 80px" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <ScrollReveal>
            <p className="section-label text-[#787777] mb-6">[ Souq ]</p>
            <h1
              style={{
                fontSize: "80px",
                fontWeight: 600,
                letterSpacing: "-3px",
                lineHeight: 1.05,
                fontFamily: "Inter, sans-serif",
              }}
            >
              Capital.<br />Accelerator.<br />Fulfillment.
            </h1>
            <p className="body-p text-[#666] mt-8" style={{ maxWidth: "480px" }}>
              Souq builds the infrastructure Muslim-aligned brands need to grow —
              without debt, without dilution, without compromise.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Three pillars */}
      <section style={{ padding: "0 50px 140px" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PILLARS.map((pillar, i) => (
              <ScrollReveal key={pillar.name} delay={i * 100}>
                <div className="border border-black/8 rounded-2xl p-10 flex flex-col gap-8 h-full hover:border-black/20 transition-colors duration-200">
                  <div className="flex flex-col gap-2">
                    <p className="section-label text-[#787777]">{pillar.tag}</p>
                    <h2
                      style={{
                        fontSize: "32px",
                        fontWeight: 600,
                        letterSpacing: "-1px",
                        lineHeight: 1.2,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Souq {pillar.name}
                    </h2>
                  </div>

                  <p className="body-p text-[#666]" style={{ fontSize: "16px" }}>
                    {pillar.description}
                  </p>

                  <div className="flex flex-col gap-2 mt-auto">
                    {pillar.stats.map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <div
                          className="flex-shrink-0 w-1 h-1 rounded-full"
                          style={{ backgroundColor: "#14181A" }}
                        />
                        <p className="section-label text-[#14181A]">{s}</p>
                      </div>
                    ))}
                  </div>

                  <Link href={pillar.href}>
                    <button
                      className="bg-[#14181A] text-white text-sm font-medium px-5 py-2.5 hover:bg-black/80 transition-colors w-full"
                      style={{ borderRadius: "99px" }}
                    >
                      {pillar.cta} →
                    </button>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/8 py-8" style={{ padding: "32px 50px" }}>
        <div
          className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ maxWidth: "1320px" }}
        >
          <span className="section-label text-[#787777]">
            © {new Date().getFullYear()} Souq. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link href="/capital">
              <span className="section-label text-[#787777] hover:text-[#14181A] transition-colors cursor-pointer">
                Capital
              </span>
            </Link>
            <Link href="/capital#accelerator">
              <span className="section-label text-[#787777] hover:text-[#14181A] transition-colors cursor-pointer">
                Accelerator
              </span>
            </Link>
            <Link href="/3pl">
              <span className="section-label text-[#787777] hover:text-[#14181A] transition-colors cursor-pointer">
                3PL
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
