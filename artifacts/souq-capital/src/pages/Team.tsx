import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { CAPITAL_TEAM, OS_TEAM } from "@/data/team";
import { useLocation } from "wouter";

export default function Team() {
  const [location] = useLocation();

  useEffect(() => {
    // Handle hash navigation
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white text-[#14181A]">
      <Navbar tone="light" />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden flex flex-col border-b border-black/8"
        style={{ padding: "180px 50px 100px" }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto", width: "100%" }}>
          <ScrollReveal>
            <h1 className="hero-title text-[#14181A] leading-none mb-6">Team</h1>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="body-h3 font-medium text-[#666] max-w-2xl">
              We are a collective of founders, operators, and investors building the tools we wished we had.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SOUQ CAPITAL TEAM ── */}
      <section id="capital" className="border-b border-black/8" style={{ padding: "100px 50px", scrollMarginTop: "96px" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <ScrollReveal>
            <div className="flex flex-col gap-2 mb-16">
              <p className="section-label text-[#787777]">[ Souq Capital ]</p>
              <h2 className="section-h2 text-[#14181A]">Investment Team</h2>
              <p className="body-p text-[#666] max-w-2xl">
                10+ years experience | 10 investment funds | 6 completed | $40M+ raised | 300+ investors
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAPITAL_TEAM.map((member, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="flex flex-col group cursor-pointer">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#F2F2F2] mb-5">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      style={{ objectPosition: member.objectPosition }}
                    />
                  </div>
                  <p className="section-label text-[#787777] mb-1">{member.role}</p>
                  <h3 className="step-h4 text-[#14181A]">{member.name}</h3>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPERATING STACK TEAM ── */}
      <section
        id="operating-stack"
        style={{
          padding: "100px 50px",
          backgroundColor: "oklch(0.155 0.004 285)",
          scrollMarginTop: "96px",
        }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <ScrollReveal>
            <div className="flex flex-col gap-2 mb-16">
              <p className="section-label" style={{ color: "var(--souq-coral)" }}>[ Operating Stack ]</p>
              <h2 className="section-h2" style={{ color: "oklch(0.965 0.002 285)" }}>Advisory & Growth</h2>
              <p className="body-p max-w-2xl" style={{ color: "oklch(0.73 0.006 285)" }}>
                Operators scaling consumer brands to market leaders with hands-on expertise in operations and growth.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {OS_TEAM.map((member, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="flex flex-col group cursor-pointer">
                  <div
                    className="aspect-[3/4] rounded-2xl overflow-hidden flex items-center justify-center mb-5 transition-colors duration-500"
                    style={{
                      backgroundColor: "oklch(0.18 0.004 285)",
                      border: "1px solid oklch(0.27 0.005 285)",
                    }}
                  >
                    <span className="text-4xl font-medium font-mono tracking-wider" style={{ color: "oklch(0.6 0.006 285)" }}>
                      {member.initials}
                    </span>
                  </div>
                  <p className="section-label mb-1" style={{ color: "oklch(0.65 0.006 285)" }}>{member.role}</p>
                  <h3 className="step-h4" style={{ color: "oklch(0.965 0.002 285)" }}>{member.name}</h3>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
