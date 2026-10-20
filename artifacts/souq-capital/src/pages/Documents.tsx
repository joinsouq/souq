import { useEffect, useRef, useState, type FormEvent } from "react";
import SitePage from "@/components/SitePage";
import { FieldInput } from "@/components/IntakeForm";
import { DOC_SECTIONS, DOC_SLOTS, MAX_FILE_MB, isShown, type DocSlot } from "@/intake/forms";

type Upload = { name: string; state: "uploading" | "done" | "error"; pct: number; msg?: string };

function useLinkParams() {
  const p = new URLSearchParams(window.location.search);
  return { ref: p.get("ref") || "", t: p.get("t") || "" };
}

// The session from the emailed code, remembered per link so founders don't need a new code every visit.
const sessionKey = () => `souq-doc-session:${new URLSearchParams(window.location.search).get("ref") || ""}`;
const getSession = () => { try { return localStorage.getItem(sessionKey()) || ""; } catch { return ""; } };
const setSession = (v: string) => { try { v ? localStorage.setItem(sessionKey(), v) : localStorage.removeItem(sessionKey()); } catch { /* private mode */ } };

async function api(body: Record<string, unknown>) {
  const r = await fetch("/api/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-doc-session": getSession() },
    body: JSON.stringify(body),
  });
  if (r.status === 401) { setSession(""); window.location.reload(); }
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
          {slot.template && <p className="ix-help"><a className="sq-link" href={slot.template.href} download>{slot.template.label}</a></p>}
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

type Progress = { steps: { label: string; state: "done" | "current" | "todo"; detail?: string }[]; percent: number };

function ProgressBar({ progress }: { progress: Progress }) {
  return (
    <div className="dp" aria-label={`Your application is ${progress.percent}% of the way through`}>
      <div className="dp-top">
        <span className="dp-label">Where you are</span>
        <span className="dp-pct">{progress.percent}%</span>
      </div>
      <div className="dp-track"><span style={{ width: `${progress.percent}%` }} /></div>
      <ol className="dp-steps">
        {progress.steps.map((s) => (
          <li key={s.label} className={`dp-${s.state}`} aria-current={s.state === "current" ? "step" : undefined}>
            <span className="dp-dot" aria-hidden="true" />
            <span className="dp-name">{s.label}</span>
            {s.detail && s.state !== "todo" && <span className="dp-detail">{s.detail}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

function CodeGate({ auth, emailHint, onIn }: { auth: { ref: string; t: string }; emailHint: string; onIn: () => void }) {
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function send() {
    setBusy(true); setMsg("");
    try { await api({ action: "sendCode", ...auth }); setSent(true); }
    catch (e) { setMsg((e as Error).message); }
    setBusy(false);
  }
  async function verify(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg("");
    try {
      const j = await api({ action: "verifyCode", ...auth, code });
      setSession(j.session);
      onIn();
    } catch (err) { setMsg((err as Error).message); setBusy(false); }
  }

  return (
    <div className="ix-form dg">
      <h2 className="sq-h3">First, a quick check that it's you.</h2>
      <p className="sq-body" style={{ marginTop: ".75rem" }}>
        We'll email a one-time code to <strong style={{ color: "var(--sq-text)", fontWeight: 500 }}>{emailHint}</strong>, the address on your application.
      </p>
      {!sent ? (
        <button type="button" className="sq-btn sq-btn-primary" style={{ marginTop: "1.5rem" }} onClick={send} disabled={busy}>
          {busy ? "Sending…" : "Email me a code"}
        </button>
      ) : (
        <form onSubmit={verify} className="dg-form">
          <label className="ix-label" htmlFor="dg-code">8-digit code</label>
          <input id="dg-code" className="dg-input" inputMode="numeric" autoComplete="one-time-code" autoFocus
            value={code} onChange={(e) => setCode(e.target.value.replace(/[^\d ]/g, "").slice(0, 9))} placeholder="1234 5678" />
          <div className="sq-actions">
            <button className="sq-btn sq-btn-primary" type="submit" disabled={busy || code.replace(/\D/g, "").length !== 8}>
              {busy ? "Checking…" : "Open my documents"}
            </button>
            <button type="button" className="sq-btn sq-btn-ghost" onClick={send} disabled={busy}>Send a new code</button>
          </div>
        </form>
      )}
      {msg && <p className="ix-error" role="alert" style={{ marginTop: "1rem" }}>{msg}</p>}
    </div>
  );
}

export default function Documents() {
  const auth = useLinkParams();
  const [info, setInfo] = useState<{ company: string; uploaded: Record<string, string[]>; progress?: Progress } | null>(null);
  const [gate, setGate] = useState<string | null>(null); // masked email while a code is needed
  const [reloadKey, setReloadKey] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [result, setResult] = useState<{ missing: string[] } | null>(null);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetch(`/api/documents?ref=${encodeURIComponent(auth.ref)}&t=${encodeURIComponent(auth.t)}`, { headers: { "x-doc-session": getSession() } })
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "This link isn't valid.");
        if (j.needsCode) { setGate(j.emailHint); setInfo(null); return; }
        setGate(null);
        setInfo(j);
      })
      .catch((e) => setLoadError(e.message));
  }, [auth.ref, auth.t, reloadKey]);

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
          {!info && !loadError && gate === null && <p className="ix-help">Loading…</p>}
          {gate !== null && !info && <CodeGate auth={auth} emailHint={gate} onIn={() => setReloadKey((k) => k + 1)} />}
          {info?.progress && <ProgressBar progress={info.progress} />}

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
              {DOC_SECTIONS.map((s) => (
                <fieldset className="ix-section" key={s.title}>
                  <legend className="sq-h3">{s.title}</legend>
                  {s.intro && <p className="ix-help">{s.intro}</p>}
                  <div className="ix-grid">
                    {s.fields.filter((f) => isShown(f.showIf, answers)).map((f) => (
                      <FieldInput key={f.id} field={f} value={answers[f.id]} error={errors[f.id]}
                        onChange={(v) => { setAnswers((a) => ({ ...a, [f.id]: String(v) })); setErrors(({ [f.id]: _d, ...r }) => r); }} />
                    ))}
                  </div>
                </fieldset>
              ))}
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
      <style>{`
        .dp { max-width: 46rem; margin-bottom: 3rem; padding: 1.4rem 1.5rem 1.5rem; border: 1px solid var(--sq-line); border-radius: 6px; background: color-mix(in srgb, var(--sq-ink-2) 80%, transparent); }
        .dp-top { display: flex; justify-content: space-between; align-items: baseline; }
        .dp-label { font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; color: var(--sq-faint); }
        .dp-pct { font-size: 1.6rem; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
        .dp-track { height: 4px; margin: .9rem 0 1.25rem; border-radius: 4px; background: var(--sq-line); overflow: hidden; }
        .dp-track span { display: block; height: 100%; background: var(--souq-coral); border-radius: 4px; transition: width .6s cubic-bezier(.32,.72,0,1); }
        .dp-steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(6, 1fr); gap: .5rem; }
        .dp-steps li { display: flex; flex-direction: column; gap: .35rem; font-size: .85rem; line-height: 1.3; color: var(--sq-faint); }
        .dp-dot { width: .6rem; height: .6rem; border-radius: 50%; border: 1px solid var(--sq-line-strong); }
        .dp-done { color: var(--sq-muted); }
        .dp-done .dp-dot { background: var(--sq-muted); border-color: var(--sq-muted); }
        .dp-current { color: var(--sq-text); }
        .dp-current .dp-dot { background: var(--souq-coral); border-color: var(--souq-coral); box-shadow: 0 0 0 4px color-mix(in srgb, var(--souq-coral) 25%, transparent); }
        .dp-detail { font-size: .78rem; color: var(--souq-peach); }
        @media (max-width: 640px) { .dp-steps { grid-template-columns: repeat(3, 1fr); row-gap: 1rem; } }
        .dg { padding: 1.75rem; border: 1px solid var(--sq-line); border-radius: 6px; }
        .dg-form { display: flex; flex-direction: column; gap: .75rem; margin-top: 1.5rem; max-width: 22rem; }
        .sq .dg .dg-form input.dg-input { font-size: 1.4rem; letter-spacing: .2em; font-variant-numeric: tabular-nums; }
      `}</style>
    </SitePage>
  );
}
