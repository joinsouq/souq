import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { SERVICES, type Service } from "@/data/offerings";
import Flywheel from "@/components/Flywheel";

/**
 * Services as buttons. Each opens a detail panel (native <dialog>, so focus,
 * Escape and the backdrop come for free) instead of a separate page.
 * With openFromHash, /services#3pl opens that service on arrival.
 */
export default function ServiceGrid({ openFromHash = false, flywheel = false }: { openFromHash?: boolean; flywheel?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Service | null>(null);

  const open = (s: Service) => {
    setActive(s);
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
  };
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    if (!openFromHash) return;
    const id = window.location.hash.slice(1);
    const match = SERVICES.find((s) => s.id === id);
    if (match) open(match);
  }, [openFromHash]);

  return (
    <>
      {flywheel && <Flywheel onSelect={open} />}
      <ul className="sq-service-grid" role="list">
        {SERVICES.map((s) => (
          <li key={s.id} id={s.id}>
            <button type="button" className="sq-service sq-service-btn" onClick={() => open(s)} aria-haspopup="dialog">
              <span className="sq-h3">{s.name}</span>
              <span className="sq-service-summary">{s.summary}</span>
              <span className="sq-service-more" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="sq-svc-dialog"
        aria-labelledby="svc-dialog-title"
        onClose={() => setActive(null)}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        {active && (
          <div className="sq-svc-panel">
            <button type="button" className="sq-svc-close" onClick={close} aria-label="Close" />
            <p className="sq-crit-kicker">Service</p>
            <h2 id="svc-dialog-title" className="sq-svc-title">{active.name}</h2>
            <p className="sq-body" style={{ marginTop: "1rem" }}>{active.summary}</p>

            <h3 className="sq-svc-label">What's included</h3>
            <ul role="list" className="sq-ticks">
              {active.includes.map((x) => <li key={x}>{x}</li>)}
            </ul>

            <h3 className="sq-svc-label">Best for</h3>
            <p className="sq-body">{active.bestFor}</p>

            <div className="sq-actions sq-svc-actions">
              <Link href={`/apply/service?services=${encodeURIComponent(active.name)}`} className="sq-btn sq-btn-primary" onClick={close}>Request this service</Link>
              {active.onePager && (
                <a href={active.onePager} className="sq-btn sq-btn-ghost" target="_blank" rel="noreferrer">Capability sheet</a>
              )}
            </div>
            <p className="sq-small" style={{ marginTop: "1.25rem" }}>
              Each service gets its own scope and quote before anything starts.
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
