import { useMemo, useRef, useState, type FormEvent } from "react";
import { type Answers, type Field, type IntakeForm as Form, isShown, validate } from "@/intake/forms";

export function FieldInput({
  field, value, error, onChange,
}: { field: Field; value: string | string[] | undefined; error?: string; onChange: (v: string | string[]) => void }) {
  const id = `f-${field.id}`;
  const describedBy = [field.help ? `${id}-help` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  const common = { id, name: field.id, "aria-invalid": !!error, "aria-describedby": describedBy };
  const str = typeof value === "string" ? value : "";
  const arr = Array.isArray(value) ? value : [];

  let control;
  if (field.type === "textarea") {
    control = <textarea {...common} rows={4} value={str} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
  } else if (field.type === "select") {
    control = (
      <select {...common} value={str} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose one</option>
        {field.options!.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  } else if (field.type === "radio" || field.type === "checkboxes") {
    const multi = field.type === "checkboxes";
    control = (
      <div className="ix-choices" role={multi ? "group" : "radiogroup"} aria-labelledby={`${id}-label`} aria-describedby={describedBy}>
        {field.options!.map((o) => {
          const on = multi ? arr.includes(o) : str === o;
          return (
            <button
              key={o} type="button" role={multi ? "checkbox" : "radio"} aria-checked={on}
              className={`ix-choice${on ? " ix-on" : ""}`}
              onClick={() => {
                if (!multi) return onChange(o);
                // "None" is exclusive with everything else.
                if (o === "None") return onChange(on ? [] : ["None"]);
                const next = on ? arr.filter((x) => x !== o) : [...arr.filter((x) => x !== "None"), o];
                onChange(next);
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
    );
  } else {
    const affix = field.type === "money" ? "$" : field.type === "percent" ? "%" : "";
    const inputType = field.type === "email" ? "email" : field.type === "tel" ? "tel" : field.type === "url" ? "url" : "text";
    const numeric = ["money", "percent", "number", "year"].includes(field.type);
    control = (
      <div className={`ix-input${affix ? ` ix-affix ix-affix-${field.type}` : ""}`} data-affix={affix || undefined}>
        <input
          {...common}
          type={inputType}
          inputMode={numeric ? "decimal" : undefined}
          autoComplete={field.id === "email" ? "email" : field.id === "name" ? "name" : field.id === "phone" ? "tel" : field.id === "company" ? "organization" : undefined}
          value={str}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className={`ix-field${field.half ? " ix-half" : ""}${error ? " ix-has-error" : ""}`}>
      <label id={`${id}-label`} htmlFor={["radio", "checkboxes"].includes(field.type) ? undefined : id} className="ix-label">
        {field.label}
        {!field.required && <span className="ix-optional"> (optional)</span>}
      </label>
      {control}
      {field.help && <p id={`${id}-help`} className="ix-help">{field.help}</p>}
      {error && <p id={`${id}-err`} className="ix-error">{error}</p>}
    </div>
  );
}

/** Pre-select choices from the link, e.g. /apply/service?services=3PL%20and%20returns.
 *  Only real options for that field are accepted. */
function prefillFromUrl(form: Form): Answers {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Answers = {};
  for (const section of form.sections) {
    for (const f of section.fields) {
      if (!f.options) continue;
      const picked = params.getAll(f.id).filter((v) => f.options!.includes(v));
      if (!picked.length) continue;
      out[f.id] = f.type === "checkboxes" ? picked : picked[0];
    }
  }
  return out;
}

export default function IntakeForm({ form }: { form: Form }) {
  const [answers, setAnswers] = useState<Answers>(() => prefillFromUrl(form));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState("");
  const [hp, setHp] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const sections = useMemo(() => form.sections.filter((s) => isShown(s.showIf, answers)), [form, answers]);

  const set = (id: string, v: string | string[]) => {
    setAnswers((a) => ({ ...a, [id]: v }));
    if (errors[id]) setErrors(({ [id]: _drop, ...rest }) => rest);
  };

  const focusFirstError = (errs: Record<string, string>) => {
    const first = Object.keys(errs)[0];
    const el = formRef.current?.querySelector<HTMLElement>(`#f-${first}, [aria-labelledby="f-${first}-label"] button`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form, answers);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    setStatus("sending");
    setServerError("");
    try {
      const r = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: form.id, answers, hp }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok) {
        setStatus("done");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (j.errors) {
        setErrors(j.errors);
        focusFirstError(j.errors);
      } else {
        setServerError(j.error || "Something went wrong. Please try again.");
      }
    } catch {
      setServerError("Couldn't reach Souq. Check your connection and try again.");
    }
    setStatus("idle");
  }

  if (status === "done") {
    return (
      <div className="ix-done" role="status">
        <h2 className="sq-h2">{form.doneTitle}</h2>
        <p className="sq-lede" style={{ marginTop: "1.25rem" }}>{form.doneBody}</p>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;
  return (
    <form ref={formRef} className="ix-form" onSubmit={submit} noValidate>
      {/* Hidden from people; bots fill it in. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label>Leave this empty<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} /></label>
      </div>

      {sections.map((s) => (
        <fieldset key={s.title} className="ix-section">
          <legend className="sq-h3">{s.title}</legend>
          {s.intro && <p className="ix-help" style={{ marginTop: "-.5rem" }}>{s.intro}</p>}
          <div className="ix-grid">
            {s.fields.filter((f) => isShown(f.showIf, answers)).map((f) => (
              <FieldInput key={f.id} field={f} value={answers[f.id]} error={errors[f.id]} onChange={(v) => set(f.id, v)} />
            ))}
          </div>
        </fieldset>
      ))}

      <div className="ix-submit">
        {errorCount > 0 && <p className="ix-error" role="alert">{errorCount === 1 ? "One answer needs fixing above." : `${errorCount} answers need fixing above.`}</p>}
        {serverError && <p className="ix-error" role="alert">{serverError}</p>}
        <button type="submit" className="sq-btn sq-btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : form.submitLabel}
        </button>
      </div>
    </form>
  );
}
