import { Link } from "wouter";
import type { TierCriteria as Tier } from "@/data/offerings";

/** "Who qualifies" block: the revenue bar large, the rest as ruled rows. */
export default function TierCriteria({ tier, wide = false }: { tier: Tier; wide?: boolean }) {
  return (
    <div className={`sq-crit${wide ? " sq-crit-wide" : ""}`}>
      <div className="sq-crit-lead">
        <p className="sq-crit-kicker">{tier.name}</p>
        <p className="sq-crit-threshold">{tier.threshold}</p>
        <p className="sq-crit-threshold-label">{tier.thresholdLabel}</p>
      </div>
      <dl className="sq-crit-list">
        {tier.criteria.map((c) => (
          <div key={c.label} className="sq-crit-row">
            <dt>{c.label}</dt>
            <dd>{c.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** One quiet line under the criteria for founders who aren't there yet. */
export function CriteriaNote() {
  return (
    <p className="sq-crit-note">
      We review every application against these. Not there yet?{" "}
      <Link href="/community" className="sq-link">Join the community</Link>
    </p>
  );
}
