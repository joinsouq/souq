import { useEffect, useRef, useState, type FormEvent } from "react";
import SitePage from "@/components/SitePage";
import { FieldInput } from "@/components/IntakeForm";
import { DOC_QUESTIONS, DOC_SLOTS, MAX_FILE_MB, type DocSlot } from "@/intake/forms";

type Upload = { name: string; state: "uploading" | "done" | "error"; pct: number; msg?: string };

function useLinkParams() {
  const p = new URLSearchParams(window.location.search);
  return { ref: p.get("ref") || "", t: p.get("t") || "" };
}

async function api(body: Record<string, unknown>) {
  const r = await fetch("/api/documents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || "Something went wrong."), { errors: j.errors });
  return j;
}

/** Sends one file straight to the private Drive folder, with progress. */
function putFile(url: string, file: File, onPct: (n: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open("PUT", url);
    x.upload.onprogress = (e) => e.lengthComputable && onPct(Math.round((e.loaded / e.total) * 100));
    x.onload = () => (x.status >= 200 && x.status < 300 ? resolve() : reject(new Error(`Upload failed (${x.status})`)));
    x.onerror = () => reject(new Error("Upload failed. Check your connection."));
    x.send(file);
  });
}

function Slot({ slot, existing, auth }: { slot: DocSlot; existing: string[]; auth: { ref: string; t: string } }) {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const input = useRef<HTMLInputElement>(null);

  const update = (i: number, patch: Partial<Upload>) => setUploads((u) => u.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  async function add(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      const i = uploads.length + Array.from(files).indexOf(file);
      setUploads((u) => [...u, { name: file.name, state: "uploading", pct: 0 }]);
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        update(i, { state: "error", msg: `Over ${MAX_FILE_MB} MB. Split it or compress it.` });
        continue;
      }
      try {
        const { uploadUrl } = await api({ action: "upload", ...auth, slot: slot.id, name: file.name, type: file.type, size: file.size });
        await putFile(uploadUrl, file, (pct) => update(i, { pct }));
        update(i, { state: "done", pct: 100 });
      } catch (e) {
        update(i, { state: "error", msg: (e as Error).message });
      }
    }
    if (input.current) input.current.value = "";
  }

  const has = existing.length > 0 || uploads.some((u) => u.state === "done");
  return (
    <li className={`ix-slot${has ? " ix-slot-has" : ""}`}>
      <div className="ix-slot-head">
        <div>
          <h3 className="sq-h3" style={{ fontSize: "1.05rem" }}>
            {slot.label}{!slot.required && <span className="ix-optional"> (optional)</span>}
          </h3>
          {slot.help && <p className="ix-help">{slot.help}</p>}
        </div>
        <label className="sq-btn sq-btn-ghost ix-upload-btn">
          {has ? "Add more" : "Upload"}
          <input ref={input} type="file" multiple className="sr-only" onChange={(e) => add(e.target.files)} />
        </label>
      </div>
      {(existing.length > 0 || uploads.length > 0) && (
        <ul className="ix-files" role="list">
          {existing.map((n) => <li key={`e-${n}`}><span>{n}</span><span className="ix-ok">Received</span></li>)}
          {uploads.map((u, i) => (
            <li key={`u-${i}`}>
              <span>{u.name}</span>
              {u.state === "uploading" && <span className="ix-help">{u.pct}%</span>}
              {u.state === "done" && <span className="ix-ok">Uploaded</span>}
              {u.state === "error" && <span className="ix-error">{u.msg}</span>}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Documents() {
  const auth = useLinkParams();
  const [info, setInfo] = useState<{ company: string; uploaded: Record<string, string[]> } | null>(null);
  const [loadError, setLoadError] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [result, setResult] = useState<{ missing: string[] } | null>(null);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetch(`/api/documents?ref=${encodeURIComponent(auth.ref)}&t=${encodeURIComponent(auth.t)}`)
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "This link isn't valid.");
        setInfo(j);
      })
      .catch((e) => setLoadError(e.message));
  }, [auth.ref, auth.t]);

  async function finish(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setSubmitError("");
    try {
      const j = await api({ action: "finish", ...auth, answers });
      setResult(j);
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const ex = err as Error & { errors?: Record<string, string> };
      if (ex.errors) setErrors(ex.errors);
      else setSubmitError(ex.message);
      setStatus("idle");
    }
  }

  return (
    <SitePage>
      <div className="sq-wrap">
        <section className="sq-page-hero" style={{ paddingBottom: "2rem" }}>
          <h1 className="sq-h2" style={{ maxWidth: "20ch" }}>
            {info ? `Documents for ${info.company}` : "Your documents"}
          </h1>
          <p className="sq-lede">
            These go to a private folder that only the Souq team can open. Upload what you have now; you can come back to this
            link to add more.
          </p>
        </section>

        <section className="sq-section" style={{ paddingTop: "2.5rem" }}>
          {loadError && <p className="ix-error" role="alert">{loadError}</p>}
          {!info && !loadError && <p className="ix-help">Loading…</p>}

          {info && status === "done" && result && (
            <div className="ix-done" role="status">
              <h2 className="sq-h2">Thank you. We have it.</h2>
              <p className="sq-lede" style={{ marginTop: "1.25rem" }}>
                {result.missing.length
                  ? `We'll start reviewing what's here. When you can, use this same link to add: ${result.missing.join(", ")}.`
                  : "Everything we need is in. The team will review and come back to you with next steps."}
              </p>
            </div>
          )}

          {info && status !== "done" && (
            <form className="ix-form" onSubmit={finish} noValidate>
              <fieldset className="ix-section">
                <legend className="sq-h3">Documents</legend>
                <ul className="ix-slots" role="list">
                  {DOC_SLOTS.map((s) => <Slot key={s.id} slot={s} existing={info.uploaded[s.id] || []} auth={auth} />)}
                </ul>
              </fieldset>
              <fieldset className="ix-section">
                <legend className="sq-h3">A few details</legend>
                <div className="ix-grid">
                  {DOC_QUESTIONS.map((f) => (
                    <FieldInput key={f.id} field={f} value={answers[f.id]} error={errors[f.id]}
                      onChange={(v) => { setAnswers((a) => ({ ...a, [f.id]: String(v) })); setErrors(({ [f.id]: _d, ...r }) => r); }} />
                  ))}
                </div>
              </fieldset>
              <div className="ix-submit">
                {submitError && <p className="ix-error" role="alert">{submitError}</p>}
                <button className="sq-btn sq-btn-primary" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send to Souq"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </SitePage>
  );
}
