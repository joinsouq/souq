import { Link } from "wouter";
import SitePage from "@/components/SitePage";
import { SERVICES } from "@/data/offerings";

const HOW_IT_WORKS = [
  { title: "Tell us what you need", body: "Pick the service and share a few numbers about the business. It takes about five minutes." },
  { title: "Scoping call", body: "The lead for that service walks through your setup and what good looks like for you." },
  { title: "Quote", body: "You get a defined scope, the owner on our side, and a price. Pass-through costs are listed separately." },
  { title: "Work starts", body: "We check in on a regular cadence. If you need more than one service, we can bring it under one plan." },
];

export default function Services() {
  return (
    <SitePage>
      <div className="sq-wrap">
        <section className="sq-page-hero">
          <h1 className="sq-display" style={{ maxWidth: "13ch" }}>Hire Souq for one part of the business.</h1>
          <p className="sq-lede">
            No program to join first. Choose the service you need, and work with the team that runs it
            for brands like yours.
          </p>
          <div className="sq-actions">
            <Link href="/apply/service" className="sq-btn sq-btn-primary">Request a service</Link>
            <Link href="/accelerator" className="sq-btn sq-btn-ghost">Need more than one?</Link>
          </div>
        </section>

        <section className="sq-section" aria-labelledby="svc-list" style={{ paddingTop: 0, borderTop: 0 }}>
          <h2 id="svc-list" className="sr-only">Services</h2>
          <ul className="sq-service-grid" role="list">
            {SERVICES.map((s) => (
              <li key={s.id} id={s.id} className="sq-service">
                <h3 className="sq-h3">{s.name}</h3>
                <p>{s.summary}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* A real sequence, so it is numbered */}
        <section className="sq-section" aria-labelledby="svc-how">
          <div className="sq-head">
            <h2 id="svc-how" className="sq-h2">How a service gets started.</h2>
            <p className="sq-body">Four steps from request to work starting, with a named owner on our side from the first call.</p>
          </div>
          <ol className="svc-steps">
            {HOW_IT_WORKS.map((s, i) => (
              <li key={s.title}>
                <span className="svc-num">{i + 1}</span>
                <h3 className="sq-h3">{s.title}</h3>
                <p className="sq-body">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <style>{`
        .svc-steps {
          list-style: none; padding: 0; margin: 0 calc(-1 * var(--sq-pad));
          display: grid; grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--sq-line);
        }
        .svc-steps li { display: flex; flex-direction: column; gap: .75rem; padding: 1.5rem clamp(1rem, 1.8vw, 1.75rem); }
        .svc-steps li + li { border-left: 1px solid var(--sq-line); }
        .svc-num {
          font-size: 2.5rem; line-height: 1; font-weight: 300; letter-spacing: -0.04em;
          color: var(--souq-coral); font-variant-numeric: tabular-nums;
        }
        @media (max-width: 900px) {
          .svc-steps { grid-template-columns: 1fr 1fr; }
          .svc-steps li:nth-child(3) { border-left: 0; }
          .svc-steps li:nth-child(n+3) { border-top: 1px solid var(--sq-line); }
        }
        @media (max-width: 560px) {
          .svc-steps { grid-template-columns: 1fr; }
          .svc-steps li + li { border-left: 0; border-top: 1px solid var(--sq-line); }
        }
      `}</style>
    </SitePage>
  );
}
