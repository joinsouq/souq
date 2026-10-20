// Server-side helpers for the intake flow: Google Drive (private file
// storage), Asana (the pipeline), Claude (the quick-look review), and signed
// links for the document upload page. Nothing here runs in the browser.

import { createHmac, timingSafeEqual } from "node:crypto";
import { JWT } from "google-auth-library";

const env = (k: string) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing environment variable ${k}`);
  return v;
};

// ---------------------------------------------------------------- Drive

let jwt: JWT | null = null;

/**
 * Reads the service-account key. Tolerates a paste that contains more than
 * one key file back to back (an easy mistake): each key is tried in turn and
 * the first one Google accepts is used.
 */
function keyCandidates(raw: string): { client_email: string; private_key: string }[] {
  try {
    return [JSON.parse(raw)];
  } catch {
    const out = [];
    for (const m of raw.matchAll(/\{[^{}]*"private_key"[^{}]*\}/g)) {
      try { out.push(JSON.parse(m[0])); } catch { /* skip */ }
    }
    if (!out.length) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON");
    return out;
  }
}

async function driveToken(): Promise<string> {
  if (jwt) {
    const { token } = await jwt.getAccessToken();
    if (token) return token;
  }
  let lastErr: unknown;
  for (const c of keyCandidates(env("GOOGLE_SERVICE_ACCOUNT_KEY"))) {
    try {
      const candidate = new JWT({ email: c.client_email, key: c.private_key, scopes: ["https://www.googleapis.com/auth/drive"] });
      const { token } = await candidate.getAccessToken();
      if (token) { jwt = candidate; return token; }
    } catch (e) { lastErr = e; }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Could not get a Google access token");
}

async function drive(path: string, init: RequestInit = {}, upload = false) {
  const base = upload ? "https://www.googleapis.com/upload/drive/v3" : "https://www.googleapis.com/drive/v3";
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${base}${path}${sep}supportsAllDrives=true`, {
    ...init,
    headers: { Authorization: `Bearer ${await driveToken()}`, ...(init.headers || {}) },
  });
  if (!res.ok) throw new Error(`Drive ${res.status}: ${await res.text()}`);
  return res;
}

export async function createFolder(name: string, parent?: string): Promise<{ id: string; url: string }> {
  const res = await drive("/files?fields=id,webViewLink", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, mimeType: "application/vnd.google-apps.folder", parents: [parent || env("GOOGLE_DRIVE_ID")] }),
  });
  const j = await res.json();
  return { id: j.id, url: j.webViewLink };
}

/** Finds a child folder by name, creating it if it doesn't exist. */
export async function ensureFolder(name: string, parent: string): Promise<string> {
  const q = encodeURIComponent(`'${parent}' in parents and name = '${name.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const res = await drive(`/files?q=${q}&fields=files(id)&includeItemsFromAllDrives=true&corpora=drive&driveId=${env("GOOGLE_DRIVE_ID")}`);
  const j = await res.json();
  if (j.files?.length) return j.files[0].id;
  return (await createFolder(name, parent)).id;
}

/** Saves text as a Google Doc in a folder. */
export async function saveDoc(name: string, text: string, folderId: string): Promise<string> {
  const boundary = "souq" + Math.random().toString(36).slice(2);
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify({ name, parents: [folderId], mimeType: "application/vnd.google-apps.document" }) +
    `\r\n--${boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${text}\r\n--${boundary}--`;
  const res = await drive("/files?uploadType=multipart&fields=id,webViewLink", {
    method: "POST",
    headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
    body,
  }, true);
  return (await res.json()).webViewLink;
}

/**
 * Starts a resumable upload so the founder's browser can send the file
 * straight to Drive (no size limit from our server). Returns the URL the
 * browser PUTs the file to.
 */
export async function startUpload(opts: { folderId: string; name: string; mimeType: string; size: number; origin: string }): Promise<string> {
  const res = await drive("/files?uploadType=resumable&fields=id,name,size", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": opts.mimeType || "application/octet-stream",
      "X-Upload-Content-Length": String(opts.size),
      Origin: opts.origin,
    },
    body: JSON.stringify({ name: opts.name, parents: [opts.folderId] }),
  }, true);
  const url = res.headers.get("location");
  if (!url) throw new Error("Drive did not return an upload URL");
  return url;
}

export async function listFiles(folderId: string): Promise<{ id: string; name: string; size?: string }[]> {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const res = await drive(`/files?q=${q}&fields=files(id,name,size)&includeItemsFromAllDrives=true&corpora=drive&driveId=${env("GOOGLE_DRIVE_ID")}&pageSize=200`);
  return (await res.json()).files || [];
}

export const folderUrl = (id: string) => `https://drive.google.com/drive/folders/${id}`;

export type DriveFile = { id: string; name: string; mimeType: string; size?: string };

/** Lists a folder's contents (files and subfolders) with their types. */
export async function listFolder(folderId: string): Promise<DriveFile[]> {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const res = await drive(`/files?q=${q}&fields=files(id,name,mimeType,size)&includeItemsFromAllDrives=true&corpora=drive&driveId=${env("GOOGLE_DRIVE_ID")}&pageSize=200&orderBy=name`);
  return (await res.json()).files || [];
}

/** Finds a folder by exact name anywhere in the shared drive. */
export async function findFolder(name: string): Promise<string | null> {
  const q = encodeURIComponent(`name = '${name.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const res = await drive(`/files?q=${q}&fields=files(id)&includeItemsFromAllDrives=true&corpora=drive&driveId=${env("GOOGLE_DRIVE_ID")}`);
  return (await res.json()).files?.[0]?.id ?? null;
}

/** Downloads a file. Google Docs come back as plain text, Google Sheets as CSV. */
export async function downloadFile(f: DriveFile): Promise<Buffer> {
  const exportAs: Record<string, string> = {
    "application/vnd.google-apps.document": "text/plain",
    "application/vnd.google-apps.spreadsheet": "text/csv",
  };
  const path = exportAs[f.mimeType]
    ? `/files/${f.id}/export?mimeType=${encodeURIComponent(exportAs[f.mimeType])}`
    : `/files/${f.id}?alt=media`;
  const res = await drive(path);
  return Buffer.from(await res.arrayBuffer());
}

// ---------------------------------------------------------------- Asana

async function asana(path: string, method = "GET", data?: unknown) {
  const res = await fetch(`https://app.asana.com/api/1.0${path}`, {
    method,
    headers: { Authorization: `Bearer ${env("ASANA_TOKEN")}`, "Content-Type": "application/json", Accept: "application/json" },
    body: data ? JSON.stringify({ data }) : undefined,
  });
  if (!res.ok) throw new Error(`Asana ${res.status}: ${await res.text()}`);
  return (await res.json()).data;
}

// Customer Pipeline sections and custom fields (Asana IDs).
// Columns: New > Intro call > Diligence > Proposal > Live > Parked.
export const SECTIONS = {
  new: "1218558113663017",
  introCall: "1218558260242200",
  diligence: "1218558205461144",
};
const CF = {
  trend: { gid: "1218567047282908", options: { Up: "1218567047282909", Flat: "1218567047282910", Down: "1218567047282911" } },
  channels: {
    gid: "1218567047282913",
    options: { "Own site": "1218567047282914", Amazon: "1218567047282915", "Wholesale/retail": "1218567047282916", "Brick-and-mortar": "1218567047282917", "Events/pop-ups": "1218567047282918", Other: "1218567047282919" },
  },
  bottleneck: {
    gid: "1218567047282921",
    options: { "Inventory planning": "1218567047282922", "Cash/working capital": "1218567047282923", Logistics: "1218567047282924", "Marketing/content": "1218567047282925", "Ops/systems": "1218567047282926", Other: "1218567047282927" },
  },
  path: {
    gid: "1219702520498198",
    options: { funding: "1219702520498199", accelerator: "1219702520498200", service: "1219702520498201", talk: "1219702520498203" } as Record<string, string>,
  },
  waitingOn: { gid: "1219702520498205", options: { Founder: "1219702520498206", Souq: "1219702520498207" } },
} as const;

export function customFieldsFrom(formId: string, a: Record<string, string | string[]>) {
  // New applications: which program, and it's Souq's move first.
  const out: Record<string, string | string[]> = { [CF.waitingOn.gid]: CF.waitingOn.options.Souq };
  if (CF.path.options[formId]) out[CF.path.gid] = CF.path.options[formId];
  const t = a.trend as string | undefined;
  if (t && t in CF.trend.options) out[CF.trend.gid] = CF.trend.options[t as keyof typeof CF.trend.options];
  const pick = (vals: unknown, map: Record<string, string>) =>
    (Array.isArray(vals) ? vals : []).map((v) => map[v as string]).filter(Boolean);
  const ch = pick(a.channels, CF.channels.options);
  if (ch.length) out[CF.channels.gid] = ch;
  const bn = pick(a.bottleneck, CF.bottleneck.options);
  if (bn.length) out[CF.bottleneck.gid] = bn;
  return out;
}

export async function createTask(opts: { name: string; notes: string; section: string; customFields: Record<string, unknown> }): Promise<{ gid: string; url: string }> {
  const project = env("ASANA_PROJECT_ID");
  const base = {
    name: opts.name,
    notes: opts.notes,
    projects: [project],
    assignee: process.env.ASANA_ASSIGNEE_ID || undefined,
  };
  let task;
  try {
    task = await asana("/tasks", "POST", { ...base, custom_fields: opts.customFields });
  } catch {
    // A renamed custom field shouldn't lose the submission: retry without them.
    task = await asana("/tasks", "POST", base);
  }
  await asana(`/sections/${opts.section}/addTask`, "POST", { task: task.gid });
  return { gid: task.gid, url: task.permalink_url || `https://app.asana.com/0/${project}/${task.gid}` };
}

export const comment = (taskGid: string, text: string) => asana(`/tasks/${taskGid}/stories`, "POST", { text });
export const moveTo = (taskGid: string, section: string) => asana(`/sections/${section}/addTask`, "POST", { task: taskGid });
export const setWaitingOn = (taskGid: string, who: "Founder" | "Souq") =>
  asana(`/tasks/${taskGid}`, "PUT", { custom_fields: { [CF.waitingOn.gid]: CF.waitingOn.options[who] } });
export const getTask = (taskGid: string) => asana(`/tasks/${taskGid}?opt_fields=name`);

// ---------------------------------------------------------------- Claude

export async function askClaude(system: string, user: string): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null; // not configured yet: skip quietly
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
      max_tokens: 1500,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);
  const j = await res.json();
  return (j.content || []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("\n").trim();
}

// ---------------------------------------------------------------- Signed links

export function sign(ref: string): string {
  return createHmac("sha256", env("INTAKE_SECRET")).update(ref).digest("base64url").slice(0, 32);
}
export function verify(ref: string, sig: string): boolean {
  const a = Buffer.from(sign(ref));
  const b = Buffer.from(String(sig || ""));
  return a.length === b.length && timingSafeEqual(a, b);
}
/** ref = "<asana task gid>.<drive folder id>" */
export function parseRef(ref: string) {
  const [task, folder] = String(ref || "").split(".");
  if (!/^\d+$/.test(task || "") || !/^[\w-]+$/.test(folder || "")) return null;
  return { task, folder };
}

export function siteOrigin(req: { headers: Record<string, string | string[] | undefined> }): string {
  const host = (req.headers["x-forwarded-host"] || req.headers.host) as string;
  return `https://${host}`;
}
