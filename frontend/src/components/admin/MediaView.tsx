"use client";

import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Trash2, UploadCloud } from "lucide-react";
import { api } from "./api";
import { useAdmin } from "./AdminShell";
import type { MediaItem } from "./types";
import { ErrorNote, PageHeader, field, fmtDate } from "./ui";

const MAX_IMAGE = 8 * 1024 * 1024;
const MAX_VIDEO = 60 * 1024 * 1024;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"];

/** Upload with progress (fetch cannot report upload progress, XHR can). */
function uploadWithProgress(form: FormData, onProgress: (pct: number) => void): Promise<{ created: number }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/media");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let body: { message?: string; created?: number } = {};
      try { body = JSON.parse(xhr.responseText); } catch {}
      if (xhr.status >= 200 && xhr.status < 300) resolve({ created: body.created || 0 });
      else reject(new Error(body.message || (xhr.status === 413 ? "The file is too large." : "Upload failed.")));
    };
    xhr.onerror = () => reject(new Error("Network error. Please try again."));
    xhr.send(form);
  });
}

export default function MediaView() {
  const { refreshStats } = useAdmin();
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    api<MediaItem[]>("/media").then(setItems).catch((e) => setLoadError(e instanceof Error ? e.message : "Could not load."));
  }, []);
  useEffect(load, [load]);

  function pick(list: FileList | null) {
    setMsg(null);
    const chosen = Array.from(list || []);
    for (const f of chosen) {
      if (!OK_TYPES.includes(f.type)) return fail(`"${f.name}": only JPG, PNG, WebP images and MP4 / WebM videos are allowed.`);
      if (f.type.startsWith("image/") && f.size > MAX_IMAGE) return fail(`"${f.name}": images must be 8 MB or smaller.`);
      if (f.type.startsWith("video/") && f.size > MAX_VIDEO) return fail(`"${f.name}": videos must be 60 MB or smaller.`);
    }
    if (chosen.length > 10) return fail("You can upload up to 10 files at a time.");
    setFiles(chosen);
  }
  function fail(text: string) {
    setFiles([]);
    if (input.current) input.current.value = "";
    setMsg({ ok: false, text });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!files.length) return setMsg({ ok: false, text: "Choose at least one photo or video." });
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    form.append("caption", caption);
    setProgress(0); setMsg(null);
    try {
      const r = await uploadWithProgress(form, setProgress);
      setMsg({ ok: true, text: `${r.created} file${r.created === 1 ? "" : "s"} uploaded. It now appears on the home page below the hero section.` });
      setFiles([]); setCaption("");
      if (input.current) input.current.value = "";
      load(); refreshStats();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Upload failed." });
    }
    setProgress(null);
  }

  async function remove(m: MediaItem) {
    if (!window.confirm("Delete this file from the website?")) return;
    try { await api(`/media/${m._id}`, { method: "DELETE" }); load(); refreshStats(); }
    catch (e) { setMsg({ ok: false, text: e instanceof Error ? e.message : "Could not delete." }); }
  }

  async function saveCaption(m: MediaItem, value: string) {
    if (value === m.caption) return;
    try {
      await api(`/media/${m._id}`, { method: "PATCH", body: JSON.stringify({ caption: value }) });
      setItems((list) => list && list.map((i) => (i._id === m._id ? { ...i, caption: value } : i)));
    } catch (e) { setMsg({ ok: false, text: e instanceof Error ? e.message : "Could not save caption." }); }
  }

  const uploading = progress !== null;

  return (
    <>
      <PageHeader title="Add Photos / Videos" description="Files you upload here are shown on the home page, in a gallery just below the hero section." />

      <form onSubmit={onSubmit} className="card mb-8 p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="media-files" className="block text-sm font-semibold text-navy">Photos / videos</label>
            <input ref={input} id="media-files" type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" onChange={(e) => pick(e.target.files)}
              className={`${field} mt-1.5 block w-full cursor-pointer p-2 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white`} />
            <p className="mt-1.5 text-xs text-ink/70">JPG, PNG, WebP (max 8 MB each) · MP4, WebM (max 60 MB each) · up to 10 files at a time.</p>
          </div>
          <div>
            <label htmlFor="media-caption" className="block text-sm font-semibold text-navy">Caption (optional)</label>
            <input id="media-caption" value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={200} placeholder="e.g. Legal awareness camp, Lucknow" className={`${field} mt-1.5 block w-full py-2.5`} />
          </div>
        </div>

        {files.length > 0 && <p className="mt-3 text-sm text-ink/80">{files.length} file{files.length === 1 ? "" : "s"} selected: {files.map((f) => f.name).join(", ")}</p>}
        {uploading && (
          <div className="mt-4" role="progressbar" aria-valuenow={progress ?? 0} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress">
            <div className="h-2 overflow-hidden rounded bg-mist"><div className="h-full bg-brand-green transition-all" style={{ width: `${progress}%` }} /></div>
            <p className="mt-1 text-xs text-ink/70">Uploading… {progress}%</p>
          </div>
        )}
        {msg && (
          <p role={msg.ok ? "status" : "alert"} className={`mt-4 flex items-start gap-2 rounded-md p-3 text-sm ${msg.ok ? "bg-brand-green/10 text-ink" : "bg-red-50 text-red-800"}`}>
            {msg.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" aria-hidden="true" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
            {msg.text}
          </p>
        )}
        <button type="submit" disabled={uploading || !files.length} className="btn-navy mt-5 disabled:cursor-not-allowed disabled:opacity-60">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <UploadCloud className="h-4 w-4" aria-hidden="true" />} Upload
        </button>
      </form>

      <h2 className="mb-4 font-serif text-xl font-bold text-navy">On the website now{items ? ` (${items.length})` : ""}</h2>
      <ErrorNote text={loadError} />
      {!items && !loadError && <p className="text-sm text-ink/60">Loading…</p>}
      {items?.length === 0 && <p className="card p-8 text-center text-sm text-ink/70">Nothing uploaded yet. The gallery section stays hidden on the website until you add a file.</p>}

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((m) => (
          <li key={m._id} className="card overflow-hidden">
            <div className="aspect-video bg-navy-900">
              {m.type === "video" ? (
                <video src={m.url} controls preload="metadata" className="h-full w-full object-contain" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.caption || "Uploaded photo"} loading="lazy" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-4">
              <label className="sr-only" htmlFor={`cap-${m._id}`}>Caption</label>
              <input id={`cap-${m._id}`} defaultValue={m.caption} maxLength={200} placeholder="Add a caption" onBlur={(e) => saveCaption(m, e.target.value.trim())} className={`${field} w-full`} />
              <div className="mt-3 flex items-center justify-between text-xs text-ink/65">
                <span>{m.type === "video" ? "Video" : "Photo"} · {fmtDate(m.createdAt)}</span>
                <button onClick={() => remove(m)} className="inline-flex items-center gap-1 font-semibold text-red-700 hover:underline"><Trash2 className="h-4 w-4" aria-hidden="true" /> Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
