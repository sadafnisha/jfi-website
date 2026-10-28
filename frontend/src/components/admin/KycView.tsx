"use client";

import { useState } from "react";
import { BadgeCheck, FileText, Loader2, ShieldCheck } from "lucide-react";
import { api } from "./api";
import { useAdmin } from "./AdminShell";
import type { Application, FileInfo } from "./types";
import { Badge, ErrorNote, PageHeader, Pager, Toolbar, field, fmtDate, pretty, useDebounced, useList } from "./ui";

/** One KYC document: image preview, PDF link, or a "not provided" note. */
function DocTile({ title, subtitle, appId, kind, file, required }: {
  title: string; subtitle?: string; appId: string; kind: "photo" | "idProof" | "panCard"; file: FileInfo; required?: boolean;
}) {
  const url = `/api/admin/applications/${appId}/files/${kind}`;
  const isPdf = file?.mimeType === "application/pdf";
  return (
    <div className="rounded-lg border border-navy/15 bg-white p-3">
      <p className="text-sm font-semibold text-navy">{title}</p>
      {subtitle && <p className="text-xs text-ink/70">{subtitle}</p>}
      <div className="mt-2 flex h-40 items-center justify-center overflow-hidden rounded-md bg-mist">
        {!file ? (
          <span className={`px-3 text-center text-xs font-semibold ${required ? "text-red-700" : "text-ink/50"}`}>Not provided</span>
        ) : isPdf ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-sm font-semibold text-navy underline">
            <FileText className="h-8 w-8" aria-hidden="true" /> Open PDF
          </a>
        ) : (
          <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full w-full" title="Open full size">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`${title} of applicant`} loading="lazy" className="h-full w-full object-contain" />
          </a>
        )}
      </div>
    </div>
  );
}

function KycCard({ app, onChanged }: { app: Application; onChanged: (a: Application) => void }) {
  const { refreshStats } = useAdmin();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const verified = app.kycStatus === "verified";

  async function setVerified(value: boolean) {
    if (!value && !window.confirm("Remove the verified mark from this user?")) return;
    setBusy(true); setErr("");
    try {
      const updated = await api<Application>(`/applications/${app._id}/kyc`, { method: "PATCH", body: JSON.stringify({ verified: value }) });
      onChanged(updated);
      refreshStats();
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not update KYC."); }
    setBusy(false);
  }

  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-bold">{app.fullName}</h2>
          <p className="mt-1 text-sm text-ink/75">{app.phone} · {app.email}</p>
          <p className="text-sm text-ink/75">{app.city}, {app.state} · Applied {fmtDate(app.createdAt)}</p>
        </div>
        {verified ? <Badge value="verified" label="✔ Verified user" /> : <Badge value="pending" label="KYC pending" />}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <DocTile title="Photograph" appId={app._id} kind="photo" file={app.photo} />
        <DocTile title="ID proof" subtitle={pretty(app.idType)} appId={app._id} kind="idProof" file={app.idProof} required />
        <div>
          <DocTile title="PAN card" subtitle={app.panNumber ? `PAN: ${app.panNumber}` : "PAN number not given"} appId={app._id} kind="panCard" file={app.panCard} required />
        </div>
      </div>

      {err && <p role="alert" className="mt-3 text-sm text-red-800">{err}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-navy/10 pt-4">
        {verified ? (
          <>
            <span className="inline-flex items-center gap-2 rounded-md bg-brand-green/10 px-4 py-2 text-sm font-semibold text-brand-green">
              <BadgeCheck className="h-5 w-5" aria-hidden="true" /> Verified user
            </span>
            <span className="text-xs text-ink/65">by {app.kycVerifiedBy || "admin"} on {fmtDate(app.kycVerifiedAt)}</span>
            <button disabled={busy} onClick={() => setVerified(false)} className="ml-auto text-sm font-semibold text-red-700 underline underline-offset-2 disabled:opacity-60">Undo verification</button>
          </>
        ) : (
          <button disabled={busy} onClick={() => setVerified(true)} className="inline-flex items-center gap-2 rounded-md bg-brand-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-greenDark disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ShieldCheck className="h-4 w-4" aria-hidden="true" />} Verify KYC
          </button>
        )}
      </div>
    </article>
  );
}

export default function KycView() {
  const [search, setSearch] = useState("");
  const [kyc, setKyc] = useState("pending");
  const params = { search: useDebounced(search), ...(kyc === "all" ? {} : { kyc }) };
  // No auto-refresh here: a card you just verified should stay on screen. Use the Refresh button instead.
  const { refreshStats } = useAdmin();
  const { data, setData, page, setPage, error, reload } = useList<Application>("/applications", { ...params, limit: "10" }, false);

  // Update a card in place, so a just-verified user stays on screen with the "Verified user" mark until the page is refreshed.
  function replace(updated: Application) {
    setData((d) => (d ? { ...d, items: d.items.map((i) => (i._id === updated._id ? updated : i)) } : d));
  }

  return (
    <>
      <PageHeader title="KYC" description="Check each applicant's photograph, ID proof and PAN card, then verify." />
      <Toolbar search={search} setSearch={setSearch} onRefresh={() => { reload(); refreshStats(); }}>
        <div role="tablist" aria-label="KYC status" className="flex overflow-hidden rounded-md border border-navy/25 text-sm font-semibold">
          {([["pending", "Pending"], ["verified", "Verified"], ["all", "All"]] as const).map(([v, label]) => (
            <button key={v} role="tab" aria-selected={kyc === v} onClick={() => setKyc(v)} className={`px-4 py-2 ${kyc === v ? "bg-navy text-white" : "bg-white text-navy hover:bg-mist"}`}>{label}</button>
          ))}
        </div>
      </Toolbar>
      <ErrorNote text={error} />

      <div className="space-y-5">
        {!data && <p className="p-8 text-center text-sm text-ink/60">Loading…</p>}
        {data?.items.length === 0 && (
          <p className="card p-8 text-center text-sm text-ink/70">{kyc === "pending" ? "No KYC is pending. Everything is verified." : "No records found."}</p>
        )}
        {data?.items.map((a) => <KycCard key={a._id} app={a} onChanged={replace} />)}
      </div>
      {data && <Pager data={data} page={page} setPage={setPage} />}
    </>
  );
}
