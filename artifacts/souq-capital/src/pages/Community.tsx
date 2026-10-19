import { Link } from "wouter";
import SitePage from "@/components/SitePage";

const WHAT_YOU_GET = [
  { title: "Programming", body: "Working sessions and talks from operators on growth, fulfillment, finance, and fundraising." },
  { title: "The Summit", body: "An annual day for Muslim founders, operators, and creators, with members on the invite list." },
  { title: "Resources", body: "Templates, benchmarks, and introductions the Souq team uses with its own brands." },
];

export default function Community() {
  return (
    <SitePage>
      <div className="sq-wrap">
        <section className="sq-page-hero">
          <h1 className="sq-display" style={{ maxWidth: "12ch" }}>Build alongside founders like you.</h1>
          <p className="sq-lede">
            The Souq community is free. Join for programming, resources, and the people building the
            same kind of company you are.
          </p>
          <div className="sq-actions">
            <Link href="/apply" className="sq-btn sq-btn-primary">Join the community</Link>
            <Link href="/summit" className="sq-btn sq-btn-ghost">See the 2026 Summit</Link>
          </div>
        </section>

        <section className="sq-section" aria-labelledby="com-what">
          <div className="sq-head">
            <h2 id="com-what" className="sq-h2">What members get.</h2>
            <p className="sq-body">
              Membership does not include one-on-one support, services, or funding. Those are separate,
              and members can apply for any of them.
            </p>
          </div>
          <ul className="com-grid" role="list">
            {WHAT_YOU_GET.map((w) => (
              <li key={w.title}>
                <h3 className="sq-h3">{w.title}</h3>
                <p className="sq-body">{w.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <style>{`
        .com-grid {
          list-style: none; padding: 0; margin: 0 calc(-1 * var(--sq-pad));
          display: grid; grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid var(--sq-line); border-bottom: 1px solid var(--sq-line);
        }
        .com-grid li { display: flex; flex-direction: column; gap: .75rem; padding: 1.75rem clamp(1rem, 1.8vw, 1.75rem) 2.25rem; }
        .com-grid li + li { border-left: 1px solid var(--sq-line); }
        @media (max-width: 760px) {
          .com-grid { grid-template-columns: 1fr; }
          .com-grid li + li { border-left: 0; border-top: 1px solid var(--sq-line); }
        }
      `}</style>
    </SitePage>
  );
}
