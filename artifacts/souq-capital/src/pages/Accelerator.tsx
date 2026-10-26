import { Link } from "wouter";
import SitePage from "@/components/SitePage";
import { CRITERIA, SERVICES } from "@/data/offerings";
import TierCriteria, { CriteriaNote } from "@/components/TierCriteria";
import { OPERATING_TEAM } from "@/data/team";

const PATHS = [
  {
    name: "Accelerator",
    line: "We advise. Your team does the work.",
    body: "A diagnostic, a 90-day plan, monthly working sessions, and quarterly reviews with operators who have scaled consumer brands.",
    href: "#how-it-works",
  },
  {
    name: "Operating Partnership",
    line: "We run part of the back end for you.",
    body: "A named Souq operating lead takes over an agreed part of the business day to day. You keep the brand, product, and final say.",
    href: "#operating-partnership",
  },
];

const STEPS = [
  { title: "Diagnostic", body: "We go through your numbers, inventory, ads, fulfillment, and content, and name the few things holding growth back." },
  { title: "90-day plan", body: "A short, specific plan with owners and targets, built with you, not handed to you." },
  { title: "Monthly sessions", body: "Working sessions on the plan, plus a shared Slack channel with the team between calls." },
  { title: "Quarterly reviews", body: "A full review of results against the plan, and the next quarter's priorities." },
];

const INCLUDED = [
  "The diagnostic and a 90-day plan",
  "Monthly working sessions with a lead partner",
  "A shared Slack channel with the team",
  "Monthly review of financials and cash flow",
  "Ad spend checked against industry benchmarks",
  "Inventory, sourcing, and manufacturing guidance",
  "Quarterly strategy reviews",
  "The founder community and the annual Summit",
];

const FOCUS = [
  { title: "Finance and cash", body: "Monthly financials, cash flow, forecasting, and how much capital the plan really needs." },
  { title: "Marketing", body: "Ad spend against results, funnel and conversion, and what to stop doing." },
  { title: "Product and inventory", body: "Buying, forecasting, sourcing, and manufacturing, so cash isn't stuck on the shelf." },
  { title: "Strategy", body: "Channels, pricing, and where the next stage of growth comes from." },
];

const OP_POINTS = [
  "A named operating lead on our side",
  "A written scope: which parts of the business we run, and the targets",
  "Our service teams do the work, so there's nothing to hire or manage",
  "A weekly operating rhythm with you",
  "A base fee plus a share of revenue, so we earn more only when you grow",
];

const FAQS = [
  { q: "Who is the Accelerator for?", a: "Brands doing $1M or more a year, operating for at least a year, focused on growth, with a founder who runs the business full time. We work with brands anywhere. If you're earlier, a single service or the community is often the better first step." },
  { q: "What's the difference between the Accelerator and an Operating Partnership?", a: "In the Accelerator, we advise and your team carries out the plan. In an Operating Partnership, a Souq operating lead and our service teams run an agreed part of the business for you." },
  { q: "What does it cost?", a: "It depends on the scope. We walk through pricing on the intro call, once we understand where the business is and what you need." },
  { q: "Do I have to use your service teams?", a: "No. Accelerator brands can bring in any service when they need execution, each with its own scope and price, but it's never required." },
  { q: "Can I get funding too?", a: "Yes. Souq Capital runs alongside the Accelerator, and many brands use both. You can say so on the application." },
  { q: "How selective is it?", a: "We work with a small group of brands at a time so every founder gets real attention. We read every application closely." },
];

export default function Accelerator() {
  const team = OPERATING_TEAM.filter((m) => m.programs.includes("Accelerator"));
  return (
    <SitePage>
      <div className="sq-wrap">
        <section className="sq-page-hero">
          <p className="acc-kicker">Souq Accelerator</p>
          <h1 className="sq-display" style={{ maxWidth: "13ch" }}>Operators in your corner, every month.</h1>
          <p className="sq-lede">
            A plan, monthly working sessions, and people who have scaled consumer brands before. When you
            need hands on the work, our service teams are already in the room.
          </p>
          <div className="sq-actions">
            <Link href="/apply/accelerator" className="sq-btn sq-btn-primary">Apply to the Accelerator</Link>
            <Link href="/apply/talk" className="sq-btn sq-btn-ghost">Talk to us first</Link>
          </div>
        </section>

        <section className="sq-section" aria-labelledby="acc-paths" style={{ paddingTop: 0, borderTop: 0 }}>
          <h2 id="acc-paths" className="sr-only">Two ways to work with us</h2>
          <div className="acc-paths">
            {PATHS.map((p) => (
              <a key={p.name} href={p.href} className="acc-path">
                <h3 className="sq-h3">{p.name}</h3>
                <p className="acc-path-line">{p.line}</p>
                <p className="sq-body">{p.body}</p>
                <span className="sq-link" style={{ marginTop: "auto", alignSelf: "flex-start" }}>How it works</span>
              </a>
            ))}
          </div>
        </section>

        <section id="who-its-for" className="sq-section" aria-labelledby="acc-who">
          <div className="sq-head">
            <h2 id="acc-who" className="sq-h2">Who it's for.</h2>
            <p className="sq-body">
              We work with a small group of brands at a time, so we look for a few things before the first call.
            </p>
          </div>
          <div className="acc-crit">
            <TierCriteria tier={CRITERIA.accelerator} />
            <TierCriteria tier={CRITERIA["operating-partnership"]} />
          </div>
          <CriteriaNote />
        </section>

        <section id="how-it-works" className="sq-section" aria-labelledby="acc-how">
          <div className="sq-head">
            <h2 id="acc-how" className="sq-h2">How the Accelerator works.</h2>
            <p className="sq-body">Built for ongoing momentum, not one-off advice. Each quarter starts from where the last one landed.</p>
          </div>
          <ol className="acc-steps">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="acc-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="sq-h3">{s.title}</h3>
                <p className="sq-body">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="acc-focus">
            {FOCUS.map((f) => (
              <div key={f.title}>
                <h3 className="sq-h3" style={{ fontSize: "1.05rem" }}>{f.title}</h3>
                <p className="sq-body">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="whats-included" className="sq-section" aria-labelledby="acc-included">
          <div className="sq-head">
            <h2 id="acc-included" className="sq-h2">What's included.</h2>
            <p className="sq-body">
              Everything on the left comes with the Accelerator. When you need execution, add any of our service
              teams. Each has its own scope and price, quoted before you start.
            </p>
          </div>
          <div className="acc-included">
            <div>
              <h3 className="acc-col-title">In every Accelerator plan</h3>
              <ul role="list" className="acc-ticks">
                {INCLUDED.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="acc-col-title">Add a service team</h3>
              <ul role="list" className="acc-services">
                {SERVICES.map((s) => (
                  <li key={s.id}>
                    <Link href={`/services#${s.id}`}>
                      <span className="sq-h3" style={{ fontSize: "1rem" }}>{s.name}</span>
                      <span className="acc-svc-summary">{s.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="operating-partnership" className="sq-section acc-op" aria-labelledby="acc-op">
          <div>
            <p className="acc-kicker">Operating Partnership</p>
            <h2 id="acc-op" className="sq-h2">When you're ready to hand over the back end.</h2>
            <p className="sq-lede" style={{ marginTop: "1.5rem" }}>
              Some founders don't need more advice. They need the operating load off their plate. In an Operating
              Partnership, a Souq operating lead runs an agreed part of the business, like fulfillment, inventory,
              finance, or media, with our service teams doing the work.
            </p>
            <p className="sq-body" style={{ marginTop: "1rem" }}>You keep the brand, the product, and the final say.</p>
            <div className="sq-actions" style={{ marginTop: "2rem" }}>
              <Link href="/apply/talk" className="sq-btn sq-btn-primary">Talk to us about it</Link>
            </div>
          </div>
          <ul role="list" className="acc-ticks acc-op-list">
            {OP_POINTS.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </section>

        {team.length > 0 && (
          <section className="sq-section acc-team" aria-labelledby="acc-team">
            <div>
              <h2 id="acc-team" className="sq-h2">Who you work with.</h2>
              <p className="sq-body" style={{ marginTop: "1.25rem" }}>
                Operators who have built and scaled consumer brands, alongside the Souq investment team.
              </p>
              <p style={{ marginTop: "1.75rem" }}><Link href="/team" className="sq-link">Meet the whole team</Link></p>
            </div>
            <ul className="acc-faces" role="list">
              {team.map((m) => (
                <li key={m.name}>
                  <img src={`${import.meta.env.BASE_URL}${m.img}`} alt="" loading="lazy" style={{ objectPosition: m.objectPosition }} />
                  <span className="sq-h3" style={{ fontSize: "1rem" }}>{m.name}</span>
                  <span className="sq-small">{m.role}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="sq-section" aria-labelledby="acc-faq">
          <div className="sq-head">
            <h2 id="acc-faq" className="sq-h2">Questions.</h2>
          </div>
          <div className="acc-faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary><span className="sq-h3">{f.q}</span><span className="acc-plus" aria-hidden="true" /></summary>
                <p className="sq-body">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="sq-section acc-close">
          <h2 className="sq-h2">Ready to build the next stage?</h2>
          <p className="sq-lede" style={{ marginTop: "1.25rem" }}>
            The application takes about fifteen minutes, and we read every one.
          </p>
          <div className="sq-actions" style={{ marginTop: "2rem" }}>
            <Link href="/apply/accelerator" className="sq-btn sq-btn-primary">Apply to the Accelerator</Link>
            <Link href="/services" className="sq-btn sq-btn-ghost">Just need one service?</Link>
          </div>
        </section>
      </div>

      <style>{`
        .acc-kicker { margin: 0 0 1.5rem; font-size: .85rem; letter-spacing: .08em; text-transform: uppercase; color: var(--souq-coral); }

        .acc-paths { display: grid; grid-template-columns: 1fr 1fr; margin: 0 calc(-1 * var(--sq-pad)); border-top: 1px solid var(--sq-line); border-bottom: 1px solid var(--sq-line); }
        .acc-path { display: flex; flex-direction: column; gap: .8rem; padding: 1.75rem clamp(1rem, 1.8vw, 1.75rem) 2rem; text-decoration: none; transition: background-color .2s ease; }
        .acc-path + .acc-path { border-left: 1px solid var(--sq-line); background: linear-gradient(to bottom, color-mix(in srgb, var(--souq-coral) 7%, transparent), transparent 85%); }
        .acc-path:hover { background-color: color-mix(in srgb, var(--souq-coral) 6%, transparent); }
        .acc-path-line { margin: 0; font-size: clamp(1.25rem, 2vw, 1.6rem); letter-spacing: -0.025em; line-height: 1.25; }

        .acc-steps { list-style: none; padding: 0; margin: 0 calc(-1 * var(--sq-pad)); display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--sq-line); }
        .acc-steps li { display: flex; flex-direction: column; gap: .75rem; padding: 1.5rem clamp(1rem, 1.8vw, 1.75rem); }
        .acc-steps li + li { border-left: 1px solid var(--sq-line); }
        .acc-num { font-size: .85rem; color: var(--souq-coral); font-variant-numeric: tabular-nums; letter-spacing: .04em; }

        .acc-focus { margin: 3.5rem calc(-1 * var(--sq-pad)) 0; display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--sq-line); }
        .acc-focus > div { display: flex; flex-direction: column; gap: .6rem; padding: 1.4rem clamp(1rem, 1.8vw, 1.75rem); }
        .acc-focus > div + div { border-left: 1px solid var(--sq-line); }

        .acc-included { display: grid; grid-template-columns: 1fr 1fr; margin: 0 calc(-1 * var(--sq-pad)); border-top: 1px solid var(--sq-line); }
        .acc-included > div { padding: 1.75rem clamp(1rem, 1.8vw, 1.75rem) 0; }
        .acc-included > div + div { border-left: 1px solid var(--sq-line); }
        .acc-col-title { margin: 0 0 1.25rem; font-size: .85rem; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; color: var(--sq-faint); }
        .acc-ticks { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .85rem; }
        .acc-ticks li { position: relative; padding-left: 1.6rem; font-size: 1rem; line-height: 1.45; }
        .acc-ticks li::before { content: ""; position: absolute; left: 0; top: .3em; width: .7rem; height: .4rem; border-left: 1.5px solid var(--souq-coral); border-bottom: 1.5px solid var(--souq-coral); transform: rotate(-45deg); }
        .acc-services { list-style: none; margin: 0 calc(-1 * clamp(1rem, 1.8vw, 1.75rem)); padding: 0; }
        .acc-services li { border-top: 1px solid var(--sq-line); }
        .acc-services a { display: grid; grid-template-columns: 1fr 1.3fr; gap: 1rem; padding: 1rem clamp(1rem, 1.8vw, 1.75rem); text-decoration: none; transition: background-color .2s ease; }
        .acc-services a:hover { background: color-mix(in srgb, var(--souq-coral) 6%, transparent); }
        .acc-services a:hover .sq-h3 { color: var(--souq-peach); }
        .acc-svc-summary { color: var(--sq-muted); font-size: .925rem; line-height: 1.5; }

        .acc-op { display: grid; grid-template-columns: 1.3fr 1fr; gap: 3rem; align-items: center; background: linear-gradient(135deg, color-mix(in srgb, var(--souq-coral) 9%, transparent), transparent 60%); }
        .acc-op-list { padding: 1.75rem; border: 1px solid var(--sq-line-strong); border-radius: 6px; background: color-mix(in srgb, var(--sq-ink) 70%, transparent); }

        .acc-team { display: grid; grid-template-columns: 1fr 1.4fr; gap: 3rem; align-items: start; }
        .acc-faces { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .acc-faces li { display: flex; flex-direction: column; gap: .3rem; }
        .acc-faces img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; border-radius: 4px; background: var(--sq-ink-2); margin-bottom: .6rem; filter: grayscale(1); transition: filter .3s ease; }
        .acc-faces li:hover img { filter: none; }

        .acc-faq { border-top: 1px solid var(--sq-line); margin: 0 calc(-1 * var(--sq-pad)); }
        .acc-faq details { border-bottom: 1px solid var(--sq-line); }
        .acc-faq summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1.4rem clamp(1rem, 1.8vw, 1.75rem); }
        .acc-faq summary::-webkit-details-marker { display: none; }
        .acc-faq summary:hover .sq-h3 { color: var(--souq-peach); }
        .acc-faq details p { padding: 0 clamp(1rem, 1.8vw, 1.75rem) 1.6rem; }
        .acc-plus { position: relative; width: .9rem; height: .9rem; flex: none; }
        .acc-plus::before, .acc-plus::after { content: ""; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: var(--sq-muted); transition: transform .25s ease; }
        .acc-plus::after { transform: rotate(90deg); }
        .acc-faq details[open] .acc-plus::after { transform: rotate(0deg); }

        .acc-close { padding-bottom: clamp(5rem, 12vw, 9rem); }
        #who-its-for, #how-it-works, #whats-included, #operating-partnership { scroll-margin-top: 5rem; }

        .acc-crit { display: grid; grid-template-columns: 1fr 1fr; margin: 0 calc(-1 * var(--sq-pad)); border-top: 1px solid var(--sq-line); border-bottom: 1px solid var(--sq-line); }
        .acc-crit > .sq-crit + .sq-crit { border-left: 1px solid var(--sq-line); background: linear-gradient(to bottom, color-mix(in srgb, var(--souq-coral) 7%, transparent), transparent 85%); }

        @media (max-width: 1000px) {
          .acc-steps, .acc-focus { grid-template-columns: 1fr 1fr; }
          .acc-steps li, .acc-focus > div { border-bottom: 1px solid var(--sq-line); }
          .acc-steps li + li, .acc-focus > div + div { border-left: 0; }
          .acc-steps li:nth-child(even), .acc-focus > div:nth-child(even) { border-left: 1px solid var(--sq-line); }
          .acc-op, .acc-team { grid-template-columns: 1fr; }
        }
        @media (max-width: 760px) {
          .acc-paths, .acc-included, .acc-steps, .acc-focus, .acc-crit { grid-template-columns: 1fr; }
          .acc-crit > .sq-crit + .sq-crit { border-left: 0; border-top: 1px solid var(--sq-line); }
          .acc-path + .acc-path, .acc-included > div + div { border-left: 0; border-top: 1px solid var(--sq-line); }
          .acc-included > div + div { margin-top: 2rem; }
          .acc-steps li:nth-child(even), .acc-focus > div:nth-child(even) { border-left: 0; }
          .acc-services a { grid-template-columns: 1fr; gap: .3rem; }
          .acc-faces { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </SitePage>
  );
}
