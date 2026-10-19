import SitePage from "@/components/SitePage";

// Roles are listed here as plain data so a new opening is a one-line change.
// The application form arrives with the Phase 2 forms work.
const ROLES: { title: string; team: string; summary: string }[] = [
  {
    title: "Junior Merchandising Planner",
    team: "Merchandising",
    summary: "Support assortment, inventory, and buy planning across Souq's portfolio brands.",
  },
];

export default function Careers() {
  return (
    <SitePage>
      <div className="sq-wrap">
        <section className="sq-page-hero">
          <h1 className="sq-display" style={{ maxWidth: "12ch" }}>Work on the brands we back.</h1>
          <p className="sq-lede">
            Souq is a small team of operators and investors. Everyone here works directly with the
            founders we support.
          </p>
        </section>

        <section className="sq-section" aria-labelledby="roles-title">
          <h2 id="roles-title" className="sq-h2" style={{ marginBottom: "2.5rem" }}>Open roles</h2>
          {ROLES.length === 0 ? (
            <p className="sq-body">No open roles right now. Check back soon.</p>
          ) : (
            <ul className="car-list" role="list">
              {ROLES.map((r) => (
                <li key={r.title}>
                  <h3 className="sq-h3">{r.title}</h3>
                  <p className="sq-small">{r.team}</p>
                  <p className="sq-body">{r.summary}</p>
                  <p className="sq-small">Applications open here shortly.</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <style>{`
        .car-list { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--sq-line); }
        .car-list li {
          display: grid; grid-template-columns: 1.2fr .6fr 1.8fr 1fr; gap: 1rem 2rem; align-items: baseline;
          padding: 1.5rem 0; border-bottom: 1px solid var(--sq-line);
        }
        @media (max-width: 860px) { .car-list li { grid-template-columns: 1fr; gap: .5rem; } }
      `}</style>
    </SitePage>
  );
}
