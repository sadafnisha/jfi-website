"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, FileText } from "lucide-react";
import { api } from "./api";
import { useAdmin } from "./AdminShell";
import type { Application } from "./types";
import { Badge, ErrorNote, Modal, PageHeader, Pager, Toolbar, field, fmtDate, pretty, td, th, useDebounced, useList } from "./ui";

export default function ApplicationsView() {
  const { refreshStats } = useAdmin();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState<Application | null>(null);
  const params = { search: useDebounced(search), status };
  const { data, page, setPage, error, reload } = useList<Application>("/applications", params);
  const qs = new URLSearchParams(params).toString();

  return (
    <>
      <PageHeader title="Applications" description="Membership Application Form submissions from the Join Us page." />
      <Toolbar search={search} setSearch={setSearch} onRefresh={() => { reload(); refreshStats(); }} exportHref={`/api/admin/applications.csv?${qs}`}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className={field}>
          <option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
        </select>
      </Toolbar>
      <ErrorNote text={error} />

      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-navy/10">
          <thead className="bg-mist"><tr>{["Submitted", "Name", "Contact", "Location", "Area", "Status", ""].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-navy/10">
            {!data && <tr><td colSpan={7} className="p-8 text-center text-sm text-ink/60">Loading…</td></tr>}
            {data?.items.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-sm text-ink/60">No applications found.</td></tr>}
            {data?.items.map((a) => (
              <tr key={a._id} className="hover:bg-mist/60">
                <td className={`${td} whitespace-nowrap`}>{fmtDate(a.createdAt)}</td>
                <td className={`${td} font-semibold`}>
                  {a.fullName}
                  {a.kycStatus === "verified" && <span className="ml-2 inline-flex items-center gap-1 align-middle text-xs font-semibold text-brand-green"><BadgeCheck className="h-4 w-4" aria-hidden="true" />Verified</span>}
                </td>
                <td className={td}>{a.phone}<br /><span className="text-ink/70">{a.email}</span></td>
                <td className={td}>{a.city}, {a.state}</td>
                <td className={td}>{pretty(a.role)}</td>
                <td className={td}><Badge value={a.status} /></td>
                <td className={td}><button onClick={() => setOpen(a)} className="font-semibold text-navy underline underline-offset-2">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data && <Pager data={data} page={page} setPage={setPage} />}

      {open && <ApplicationModal app={open} onClose={() => setOpen(null)} onSaved={(a) => { setOpen(a); reload(); refreshStats(); }} />}
    </>
  );
}

function Row({ k, v }: { k: string; v?: string }) {
  return (
    <div className="grid gap-1 border-b border-navy/10 py-2.5 sm:grid-cols-[11rem_1fr]">
      <dt className="text-sm font-semibold text-navy">{k}</dt>
      <dd className="whitespace-pre-wrap break-words text-sm">{v || "—"}</dd>
    </div>
  );
}

function ApplicationModal({ app, onClose, onSaved }: { app: Application; onClose: () => void; onSaved: (a: Application) => void }) {
  const [note, setNote] = useState(app.adminNote || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => setNote(app.adminNote || ""), [app]);

  async function save(status?: Application["status"]) {
    setBusy(true); setErr("");
    try {
      const updated = await api<Application>(`/applications/${app._id}`, { method: "PATCH", body: JSON.stringify({ ...(status ? { status } : {}), adminNote: note }) });
      onSaved(updated);
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not save."); }
    setBusy(false);
  }

  const fileBtn = "inline-flex items-center gap-2 rounded-md border border-navy/25 px-3 py-2 text-sm font-semibold text-navy hover:bg-mist";
  const fileLink = (kind: string, label: string) => (
    <a className={fileBtn} href={`/api/admin/applications/${app._id}/files/${kind}`} target="_blank" rel="noopener noreferrer">
      <FileText className="h-4 w-4" aria-hidden="true" /> {label}
    </a>
  );

  return (
    <Modal title="Application details" onClose={onClose} wide>
      <div className="flex items-start justify-between gap-4 border-b border-navy/10 p-5">
        <div>
          <h2 className="font-serif text-2xl font-bold">{app.fullName}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink/70">
            Submitted {fmtDate(app.createdAt)} · <Badge value={app.status} />
            {app.kycStatus === "verified" ? <Badge value="verified" label="Verified user" /> : <Badge value="pending" label="KYC pending" />}
          </p>
        </div>
        <button onClick={onClose} aria-label="Close" className="rounded p-1 text-xl leading-none hover:bg-mist">×</button>
      </div>

      <div className="p-5">
        <dl>
          <Row k="Father / Mother / Guardian" v={app.guardianName} />
          <Row k="Date of birth" v={new Date(app.dob).toLocaleDateString("en-IN")} />
          <Row k="Gender" v={app.gender && pretty(app.gender)} />
          <Row k="Mobile" v={app.phone} />
          <Row k="Alternate mobile" v={app.alternatePhone} />
          <Row k="Email" v={app.email} />
          <Row k="Address" v={`${app.address}\n${app.city}, ${app.district}, ${app.state} - ${app.pinCode}`} />
          <Row k="ID proof type" v={pretty(app.idType)} />
          <Row k="PAN number" v={app.panNumber} />
          <Row k="Preferred unit" v={app.unit} />
          <Row k="Area of contribution" v={pretty(app.role)} />
          <Row k="Why join JFI" v={app.reason} />
          <Row k="Experience" v={app.experience} />
        </dl>

        <div className="mt-5 flex flex-wrap gap-3">
          {fileLink("idProof", "Open ID proof")}
          {app.photo && fileLink("photo", "Open photograph")}
          {app.panCard && fileLink("panCard", "Open PAN card")}
        </div>

        <label htmlFor="note" className="mt-6 block text-sm font-semibold text-navy">Internal note (visible only to admin)</label>
        <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={1000} className={`${field} mt-1.5 w-full`} />
        {err && <p role="alert" className="mt-3 text-sm text-red-800">{err}</p>}

        <div className="mt-5 flex flex-wrap gap-3">
          <button disabled={busy} onClick={() => save("approved")} className="rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-greenDark disabled:opacity-60">Approve</button>
          <button disabled={busy} onClick={() => save("rejected")} className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60">Reject</button>
          <button disabled={busy} onClick={() => save("pending")} className="rounded-md border border-navy/25 px-4 py-2 text-sm font-semibold text-navy disabled:opacity-60">Mark pending</button>
          <button disabled={busy} onClick={() => save()} className="ml-auto rounded-md border border-navy/25 px-4 py-2 text-sm font-semibold text-navy disabled:opacity-60">Save note</button>
        </div>
      </div>
    </Modal>
  );
}
