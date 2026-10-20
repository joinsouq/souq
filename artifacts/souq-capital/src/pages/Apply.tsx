import { Link, useParams } from "wouter";
import SitePage from "@/components/SitePage";
import IntakeForm from "@/components/IntakeForm";
import { FORMS, PATH_ORDER, type PathId } from "@/intake/forms";
import NotFound from "@/pages/not-found";

/** /apply: one question that sends each founder to the right form. */
export function ApplyChooser() {
  return (
    <SitePage>
      <div className="sq-wrap">
        <section className="sq-page-hero" style={{ paddingBottom: "2.5rem" }}>
          <h1 className="sq-display" style={{ maxWidth: "14ch" }}>What are you looking for?</h1>
          <p className="sq-lede">Pick the closest one. If it's not quite right, we'll point you somewhere better.</p>
        </section>
        <section className="sq-section" style={{ paddingTop: 0, borderTop: 0 }}>
          <ul className="ix-paths" role="list">
            {PATH_ORDER.map((id) => {
              const f = FORMS[id];
              return (
                <li key={id}>
                  <Link href={`/apply/${id}`} className="ix-path">
                    <span className="sq-h3">{f.choice}</span>
                    <span className="ix-path-detail">{f.choiceDetail}</span>
                    <span className="ix-path-time">About {f.minutes} min</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </SitePage>
  );
}

/** /apply/:path: the form itself. */
export function ApplyForm() {
  const { path } = useParams<{ path: string }>();
  const form = FORMS[path as PathId];
  if (!form) return <NotFound />;
  return (
    <SitePage>
      <div className="sq-wrap">
        <section className="sq-page-hero" style={{ paddingBottom: "2rem" }}>
          {PATH_ORDER.includes(form.id) && <Link href="/apply" className="sq-link" style={{ marginBottom: "2rem" }}>All options</Link>}
          <h1 className="sq-h2" style={{ maxWidth: "20ch", marginTop: "2rem" }}>{form.title}</h1>
          <p className="sq-lede">{form.intro}</p>
        </section>
        <section className="sq-section" style={{ paddingTop: "2.5rem" }}>
          <IntakeForm key={form.id} form={form} />
        </section>
      </div>
    </SitePage>
  );
}
