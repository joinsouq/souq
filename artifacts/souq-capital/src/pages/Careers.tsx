import SitePage from "@/components/SitePage";

// Roles are listed here as plain data, so a new opening is one entry in ROLES.
// Applications go through each role's LinkedIn posting.
type Role = {
  title: string;
  team: string;
  location: string;
  summary: string;
  about: string;
  responsibilities: string[];
  qualifications: string[];
  applyUrl: string;
};

const ROLES: Role[] = [
  {
    title: "Merchandise Planner",
    team: "Retail Accelerator",
    location: "Remote",
    summary: "Plan sales and inventory across the jewelry and apparel brands in our Retail Accelerator portfolio.",
    about:
      "Souq is seeking a Merchandise Planner to support sales and inventory decisions across its Retail Accelerator " +
      "portfolio, including jewelry and apparel brands. This fully remote role works with brand, product, ecommerce, " +
      "marketing, finance, operations and logistics teams to keep assortments aligned with customer demand and business goals.",
    responsibilities: [
      "Review weekly sales and inventory performance by brand, channel, category, style and SKU. Identify opportunities, risks and actions for the team.",
      "Work with Open to Buy to maintain sales forecasts, inventory plans, seasonal receipt plans and buy plans as demand and business priorities change.",
      "Develop assortment and SKU count plans using sales history, product attributes, style rankings and appropriate depth by category and size.",
      "Plan allocation and replenishment for core and seasonal items. Monitor stock levels, sell through, inventory turn and weeks of supply by location and SKU.",
      "Track product deliveries and reconcile receipts with operations, logistics and production. Coordinate product availability for launches with ecommerce and marketing.",
      "Identify slow moving and excess inventory. Recommend transfers, consolidation, promotions and markdowns that support sell through and profitability.",
      "Prepare regular reporting and focused analyses, including season end recaps, to inform future assortment, inventory and pricing decisions.",
      "Maintain accurate product and SKU data used in planning and reporting. Help improve reporting processes and team workflows.",
      "Create ad hoc analysis in line with business needs.",
    ],
    qualifications: [
      "3-5 years of experience in retail planning, buying or a related analytical role.",
      "Experience with direct-to-consumer ecommerce.",
      "Experience working with a digitally native DTC brand a plus.",
      "Experience with sized categories is helpful.",
      "Advanced Excel skills and a strong grasp of retail math, forecasting and inventory measures.",
      "Working knowledge of Open to Buy planning, including sales, receipts and inventory.",
      "Familiarity with Shopify or a similar commerce platform.",
      "Clear communication, sound judgment and attention to detail.",
      "Comfortable working autonomously across teams and managing changing priorities.",
      "Agile and thrives in a fast paced environment with a start up mentality.",
      "Resourceful and able to work with both manual and automated processes.",
      "Bachelor's degree or equivalent relevant experience.",
    ],
    applyUrl: "https://www.linkedin.com/jobs/view/4488028038/",
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
                  <div className="car-row">
                    <h3 className="sq-h3">{r.title}</h3>
                    <p className="sq-small">{r.team} · {r.location}</p>
                    <p className="sq-body">{r.summary}</p>
                    <a className="sq-btn sq-btn-primary car-apply" href={r.applyUrl} target="_blank" rel="noopener noreferrer">
                      Apply on LinkedIn
                    </a>
                  </div>
                  <details className="car-details">
                    <summary className="sq-link">Full description</summary>
                    <div className="car-body">
                      <p className="sq-body">{r.about}</p>
                      <h4 className="sq-small car-label">Responsibilities</h4>
                      <ul className="sq-body car-points">
                        {r.responsibilities.map((x) => <li key={x}>{x}</li>)}
                      </ul>
                      <h4 className="sq-small car-label">Qualifications</h4>
                      <ul className="sq-body car-points">
                        {r.qualifications.map((x) => <li key={x}>{x}</li>)}
                      </ul>
                      <a className="sq-btn sq-btn-primary" href={r.applyUrl} target="_blank" rel="noopener noreferrer">
                        Apply on LinkedIn
                      </a>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <style>{`
        .car-list { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--sq-line); }
        .car-list > li { padding: 1.5rem 0; border-bottom: 1px solid var(--sq-line); }
        .car-row {
          display: grid; grid-template-columns: 1.2fr .8fr 1.8fr auto; gap: 1rem 2rem; align-items: baseline;
        }
        .car-apply { justify-self: end; white-space: nowrap; }
        .car-details { margin-top: 1rem; }
        .car-details summary { display: inline-block; cursor: pointer; list-style: none; }
        .car-details summary::-webkit-details-marker { display: none; }
        .car-body { max-width: 68ch; padding-top: 1.25rem; }
        .car-label { margin: 1.75rem 0 .5rem; text-transform: uppercase; letter-spacing: .08em; }
        .car-points { list-style: disc; padding-left: 1.1rem; margin: 0 0 1.5rem; }
        .car-points li { margin: .4rem 0; }
        @media (max-width: 860px) {
          .car-row { grid-template-columns: 1fr; gap: .5rem; }
          .car-apply { justify-self: start; margin-top: .5rem; }
        }
      `}</style>
    </SitePage>
  );
}
