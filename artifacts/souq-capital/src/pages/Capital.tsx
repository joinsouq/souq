import { Link } from "wouter";
import SitePage from "@/components/SitePage";
import { CAPITAL_TEAM } from "@/data/team";
import { CRITERIA } from "@/data/offerings";
import TierCriteria, { CriteriaNote } from "@/components/TierCriteria";

const STATS = [
  { value: "$8M", label: "invested" },
  { value: "18", label: "investments" },
  { value: "0%", label: "interest, ever" },
];

const STEPS = [
  { title: "Apply", body: "About seven minutes. Tell us what you sell, your numbers, and what the funding would pay for." },
  { title: "Intro call", body: "If it looks like a fit, we set up a call to walk through the business and the buy." },
  { title: "Share documents", body: "You get a private link to upload financials and sales reports. We review them and send terms." },
  { title: "Get funded", body: "We pay your supplier, contractor, or business directly, so the money goes where it's needed." },
  { title: "Repay as you sell", body: "Each month you share a set percentage of the profit on the inventory we funded. No sales, no payment." },
];

const FUND = [
  {
    title: "Inventory",
    body: "Production runs, seasonal buys, and purchase orders for physical products. We fund the goods and share in the profit as they sell.",
    examples: ["A Q4 production run", "A Ramadan or Black Friday buy", "A first wholesale order"],
  },
  {
    title: "Service contracts",
    body: "Payroll and supplies to deliver a contract you've already won. We fund the cost of delivery and share in the profit on the work.",
    examples: ["A signed building or facilities contract", "Payroll for a new client", "Equipment and supplies for a job"],
  },
];

const COMPARE: { name: string; points: string[]; souq?: boolean }[] = [
  { name: "Souq Capital", souq: true, points: ["No interest", "No equity", "Repay only as you sell", "Inventory or services", "We only earn when you do"] },
  { name: "Bank loans", points: ["Interest", "Collateral and personal guarantees", "Fixed monthly payments"] },
  { name: "Venture capital", points: ["Equity dilution", "Loss of control", "Built for a few huge outcomes"] },
  { name: "Revenue-based lenders", points: ["Fees that work like interest", "Fixed payments, sold or not", "Usually inventory only"] },
  { name: "Credit cards and lines", points: ["High interest", "Variable payback", "Limits that don't grow with you"] },
];

const REVIEWS = [
  {
    quote: "Souq helped us scale inventory without selling equity or stressing over interest payments.",
    story: "Fith, a fast-growing fitness brand, used Souq to restock and launch new products while keeping full ownership. Revenue tripled in six months.",
    company: "Fith",
    who: "Rahim, Founder",
  },
  {
    quote: "We were able to fund our largest seasonal drop, on our terms.",
    story: "5Pillars financed a major Ramadan inventory run with Souq and met record demand.",
    company: "5Pillars",
    who: "Faruq, Founder",
  },
  {
    quote: "Working with Souq Capital has been one of the most transformative partnerships we've had.",
    story: "Six figures at a critical moment helped Noun Naturals refresh inventory, strengthen operations, and bring new life into the brand.",
    company: "Noun Naturals",
    who: "Khaled, Founder",
  },
  {
    quote: "Souq gave us the confidence to say yes to a $100K+ contract.",
    story: "Skyward needed upfront funds to start a large contract. Souq funded it without collateral, and the project was delivered.",
    company: "Skyward Building Services",
    who: "Rudwan, President",
  },
];

const FAQS = [
  {
    q: "Is this a loan?",
    a: "No. Souq Capital funds inventory or a service contract and shares in the profit as it sells. There's no interest rate and no fixed payment. If nothing sells in a month, you don't owe anything that month.",
  },
  {
    q: "Do you take equity?",
    a: "No. You keep 100% of your company. We're a capital partner, not an investor in your cap table.",
  },
  {
    q: "Is it halal?",
    a: "Yes. The model is built on profit sharing, not interest, so there's no riba.",
  },
  {
    q: "What does it cost?",
    a: "A percentage of the gross profit on the inventory or contract we fund, agreed up front and paid monthly as you sell. We set it per deal after reviewing your numbers.",
  },
  {
    q: "What kinds of businesses do you fund?",
    a: "US-based consumer product brands that need inventory, and service businesses with signed contracts, doing $200K or more a year with at least a year of sales history. The full list is under Who qualifies above.",
  },
  {
    q: "What will you ask for?",
    a: "The application takes about seven minutes. After the intro call, we send a private link for financial statements, bank statements, sales reports, and details on what the funding would buy.",
  },
  {
    q: "How fast can it happen?",
    a: "It depends on how quickly documents come in. Once we have everything, we review and come back with terms, and funds go straight to your supplier or contractor.",
  },
  {
    q: "Can I also get operating help?",
    a: "Yes. Capital runs alongside the Accelerator and our services. Many brands use both. You can say so on the application.",
  },
];

export default function Capital() {
  return (
    <SitePage>
      <div className="sq-wrap">
        <section className="sq-page-hero cap-hero">
          <p className="cap-kicker">Souq Capital</p>
          <h1 className="sq-display" style={{ maxWidth: "12ch" }}>Capital you repay as you sell.</h1>
          <p className="sq-lede">
            We fund inventory and service contracts for a share of the profit. No interest, no equity, and
            no fixed payments. We only earn when you do.
          </p>
          <div className="sq-actions">
            <Link href="/apply/funding" className="sq-btn sq-btn-primary">Apply for funding</Link>
            <Link href="/apply/talk" className="sq-btn sq-btn-ghost">Talk to us first</Link>
          </div>
          <dl className="cap-stats">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd><span className="cap-stat-value">{s.value}</span> <span className="cap-stat-label">{s.label}</span></dd>
              </div>
            ))}
          </dl>
        </section>

        {/* How it works: a real sequence, so it's numbered */}
        <section className="sq-section" aria-labelledby="cap-how">
          <div className="sq-head">
            <h2 id="cap-how" className="sq-h2">From application to funded.</h2>
            <p className="sq-body">
              Banks want fixed payments whether or not you've been paid. We match repayment to your sales, so
              a slow month costs you nothing extra.
            </p>
          </div>
          <ol className="cap-steps">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="cap-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="sq-h3">{s.title}</h3>
                <p className="sq-body">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="sq-section" aria-labelledby="cap-fund">
          <div className="sq-head">
            <h2 id="cap-fund" className="sq-h2">What we fund.</h2>
            <p className="sq-body">Two kinds of deals, each underwritten on its own numbers.</p>
          </div>
          <div className="cap-fund">
            {FUND.map((f) => (
              <article key={f.title}>
                <h3 className="sq-h3">{f.title}</h3>
                <p className="sq-body">{f.body}</p>
                <ul role="list">
                  {f.examples.map((e) => <li key={e}>{e}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="who-qualifies" className="sq-section" aria-labelledby="cap-who">
          <div className="sq-head">
            <h2 id="cap-who" className="sq-h2">Who qualifies.</h2>
            <p className="sq-body">
              Capital is for established brands that need working capital to grow, not startup money.
              Here's what we look for.
            </p>
          </div>
          <div className="cap-crit">
            <TierCriteria tier={CRITERIA.capital} wide />
          </div>
          <CriteriaNote />
        </section>

        <section className="sq-section" aria-labelledby="cap-compare">
          <div className="sq-head">
            <h2 id="cap-compare" className="sq-h2">How it compares.</h2>
            <p className="sq-body">Most funding is built around the lender getting paid on schedule. Ours is built around you selling.</p>
          </div>
          <ul className="cap-compare" role="list">
            {COMPARE.map((c) => (
              <li key={c.name} className={c.souq ? "cap-compare-souq" : undefined}>
                <h3 className="sq-h3">{c.name}</h3>
                <ul role="list">
                  {c.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section className="sq-section" aria-labelledby="cap-reviews">
          <div className="sq-head">
            <h2 id="cap-reviews" className="sq-h2">Founders on Souq.</h2>
          </div>
          <ul className="cap-reviews" role="list">
            {REVIEWS.map((r) => (
              <li key={r.company}>
                <figure>
                  <blockquote>"{r.quote}"</blockquote>
                  <p className="sq-body">{r.story}</p>
                  <figcaption>
                    <span className="cap-mono" aria-hidden="true">{r.company.slice(0, 1)}</span>
                    <span><strong>{r.company}</strong><br />{r.who}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        <section className="sq-section cap-team" aria-labelledby="cap-team">
          <div>
            <h2 id="cap-team" className="sq-h2">The Capital team.</h2>
            <p className="sq-body" style={{ marginTop: "1.25rem" }}>
              Founders, operators, and investors who have built, scaled, and exited consumer brands.
              More than ten years of investing, and $40M+ raised across ten funds.
            </p>
            <p style={{ marginTop: "1.75rem" }}><Link href="/team" className="sq-link">Meet the team</Link></p>
          </div>
          <ul className="cap-faces" role="list">
            {CAPITAL_TEAM.map((m) => (
              <li key={m.name}>
                <img src={`${import.meta.env.BASE_URL}${m.img}`} alt="" loading="lazy" style={{ objectPosition: m.objectPosition }} />
                <span className="sq-h3" style={{ fontSize: "1rem" }}>{m.name}</span>
                <span className="sq-small">{m.role}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="sq-section" aria-labelledby="cap-faq">
          <div className="sq-head">
            <h2 id="cap-faq" className="sq-h2">Questions.</h2>
          </div>
          <div className="cap-faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary><span className="sq-h3">{f.q}</span><span className="cap-plus" aria-hidden="true" /></summary>
                <p className="sq-body">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="sq-section cap-close">
          <h2 className="sq-h2">Ready when your next buy is.</h2>
          <p className="sq-lede" style={{ marginTop: "1.25rem" }}>
            Apply in about seven minutes. If it's a fit, we'll set up a call within a few business days.
          </p>
          <div className="sq-actions" style={{ marginTop: "2rem" }}>
            <Link href="/apply/funding" className="sq-btn sq-btn-primary">Apply for funding</Link>
            <Link href="/accelerator" className="sq-btn sq-btn-ghost">Need operating help too?</Link>
          </div>
        </section>
      </div>

      <style>{`
        .cap-crit { margin: 0 calc(-1 * var(--sq-pad)); border-top: 1px solid var(--sq-line); border-bottom: 1px solid var(--sq-line); background: linear-gradient(to bottom, color-mix(in srgb, var(--souq-blue) 5%, transparent), transparent 80%); }
        #who-qualifies { scroll-margin-top: 5rem; }
        .cap-kicker { margin: 0 0 1.5rem; font-size: .85rem; letter-spacing: .08em; text-transform: uppercase; color: var(--souq-coral); }
        .cap-stats {
          margin: clamp(3rem, 7vh, 4.5rem) calc(-1 * var(--sq-pad)) 0; padding: 0;
          display: grid; grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--sq-line);
        }
        .cap-stats > div { padding: 1.25rem clamp(1rem, 1.8vw, 1.75rem) 0; }
        .cap-stats > div + div { border-left: 1px solid var(--sq-line); }
        .cap-stats dd { margin: 0; }
        .cap-stat-value { display: block; font-size: clamp(1.8rem, 3.2vw, 2.6rem); letter-spacing: -0.04em; font-variant-numeric: tabular-nums; }
        .cap-stat-label { color: var(--sq-muted); font-size: .9rem; }

        .cap-steps {
          list-style: none; padding: 0; margin: 0 calc(-1 * var(--sq-pad));
          display: grid; grid-template-columns: repeat(5, 1fr); border-top: 1px solid var(--sq-line);
        }
        .cap-steps li { display: flex; flex-direction: column; gap: .75rem; padding: 1.5rem clamp(1rem, 1.6vw, 1.5rem); }
        .cap-steps li + li { border-left: 1px solid var(--sq-line); }
        .cap-steps li:last-child { background: linear-gradient(to bottom, color-mix(in srgb, var(--souq-coral) 9%, transparent), transparent 85%); }
        .cap-num { font-size: .85rem; color: var(--souq-coral); font-variant-numeric: tabular-nums; letter-spacing: .04em; }

        .cap-fund { display: grid; grid-template-columns: 1fr 1fr; margin: 0 calc(-1 * var(--sq-pad)); border-top: 1px solid var(--sq-line); }
        .cap-fund article { display: flex; flex-direction: column; gap: 1rem; padding: 1.75rem clamp(1rem, 1.8vw, 1.75rem) 2.25rem; }
        .cap-fund article + article { border-left: 1px solid var(--sq-line); }
        .cap-fund ul, .cap-compare ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .5rem; }
        .cap-fund ul li { color: var(--sq-text); font-size: .95rem; padding-left: 1.1rem; position: relative; }
        .cap-fund ul li::before { content: ""; position: absolute; left: 0; top: .6em; width: .45rem; height: 1px; background: var(--souq-coral); }

        .cap-compare { list-style: none; padding: 0; margin: 0 calc(-1 * var(--sq-pad)); display: grid; grid-template-columns: repeat(5, 1fr); border-top: 1px solid var(--sq-line); }
        .cap-compare > li { display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem clamp(1rem, 1.6vw, 1.5rem) 2rem; }
        .cap-compare > li + li { border-left: 1px solid var(--sq-line); }
        .cap-compare ul li { color: var(--sq-faint); font-size: .925rem; line-height: 1.45; }
        .cap-compare-souq { background: color-mix(in srgb, var(--souq-coral) 8%, transparent); border-top: 2px solid var(--souq-coral); margin-top: -1px; }
        .cap-compare-souq ul li { color: var(--sq-text); }

        .cap-reviews { list-style: none; padding: 0; margin: 0 calc(-1 * var(--sq-pad)); display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--sq-line); }
        .cap-reviews > li { padding: 2rem clamp(1rem, 1.8vw, 1.75rem); border-bottom: 1px solid var(--sq-line); }
        .cap-reviews > li:nth-child(even) { border-left: 1px solid var(--sq-line); }
        .cap-reviews figure { margin: 0; display: flex; flex-direction: column; gap: 1rem; height: 100%; }
        .cap-reviews blockquote { margin: 0; font-size: clamp(1.2rem, 1.8vw, 1.45rem); line-height: 1.35; letter-spacing: -0.02em; }
        .cap-reviews figcaption { margin-top: auto; padding-top: .75rem; display: flex; align-items: center; gap: .85rem; font-size: .9rem; color: var(--sq-muted); line-height: 1.4; }
        .cap-reviews figcaption strong { color: var(--sq-text); font-weight: 500; }
        .cap-mono { width: 2.5rem; height: 2.5rem; flex: none; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--sq-line-strong); color: var(--souq-peach); font-size: 1rem; }

        .cap-team { display: grid; grid-template-columns: 1fr 1.4fr; gap: 3rem; align-items: start; }
        .cap-faces { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .cap-faces li { display: flex; flex-direction: column; gap: .3rem; }
        .cap-faces img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; border-radius: 4px; background: var(--sq-ink-2); margin-bottom: .6rem; filter: grayscale(1); transition: filter .3s ease; }
        .cap-faces li:hover img { filter: none; }

        .cap-faq { border-top: 1px solid var(--sq-line); margin: 0 calc(-1 * var(--sq-pad)); }
        .cap-faq details { border-bottom: 1px solid var(--sq-line); }
        .cap-faq summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1.4rem clamp(1rem, 1.8vw, 1.75rem); }
        .cap-faq summary::-webkit-details-marker { display: none; }
        .cap-faq summary:hover .sq-h3 { color: var(--souq-peach); }
        .cap-faq details p { padding: 0 clamp(1rem, 1.8vw, 1.75rem) 1.6rem; }
        .cap-plus { position: relative; width: .9rem; height: .9rem; flex: none; }
        .cap-plus::before, .cap-plus::after { content: ""; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: var(--sq-muted); transition: transform .25s ease; }
        .cap-plus::after { transform: rotate(90deg); }
        .cap-faq details[open] .cap-plus::after { transform: rotate(0deg); }

        .cap-close { padding-bottom: clamp(5rem, 12vw, 9rem); }

        @media (max-width: 1000px) {
          .cap-steps, .cap-compare { grid-template-columns: 1fr 1fr; }
          .cap-steps li + li, .cap-compare > li + li { border-left: 0; }
          .cap-steps li, .cap-compare > li { border-bottom: 1px solid var(--sq-line); }
          .cap-steps li:nth-child(even), .cap-compare > li:nth-child(even) { border-left: 1px solid var(--sq-line); }
          .cap-compare-souq { grid-column: 1 / -1; }
          .cap-compare > li:nth-child(even) { border-left: 0; }
          .cap-compare > li:nth-child(odd):not(:first-child) { border-left: 1px solid var(--sq-line); }
          .cap-team { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .cap-stats { grid-template-columns: 1fr 1fr 1fr; }
          .cap-steps, .cap-compare, .cap-fund, .cap-reviews { grid-template-columns: 1fr; }
          .cap-steps li:nth-child(even), .cap-compare > li:nth-child(odd):not(:first-child),
          .cap-fund article + article, .cap-reviews > li:nth-child(even) { border-left: 0; }
          .cap-fund article + article { border-top: 1px solid var(--sq-line); }
          .cap-faces { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </SitePage>
  );
}
