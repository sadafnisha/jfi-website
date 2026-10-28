"use client";

import { useState } from "react";
import { Mail, Phone, Trash2 } from "lucide-react";
import { api } from "./api";
import { useAdmin } from "./AdminShell";
import type { MessageItem } from "./types";
import { Badge, ErrorNote, Modal, PageHeader, Pager, Toolbar, field, fmtDate, useDebounced, useList } from "./ui";

const sourceLabel: Record<string, string> = { "support-us": "Support Us page", "contact-us": "Contact Us page", other: "Website" };

export default function MessagesView() {
  const { refreshStats } = useAdmin();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [open, setOpen] = useState<MessageItem | null>(null);
  const params = { search: useDebounced(search), status, source };
  const { data, setData, page, setPage, error, reload } = useList<MessageItem>("/messages", params);

  function patchLocal(m: MessageItem) {
    setData((d) => (d ? { ...d, items: d.items.map((i) => (i._id === m._id ? m : i)) } : d));
  }

  async function openMessage(m: MessageItem) {
    setOpen(m);
    if (!m.isRead) {
      try {
        const updated = await api<MessageItem>(`/messages/${m._id}`, { method: "PATCH", body: JSON.stringify({ isRead: true }) });
        patchLocal(updated); setOpen(updated); refreshStats();
      } catch {}
    }
  }

  async function toggleRead(m: MessageItem) {
    const updated = await api<MessageItem>(`/messages/${m._id}`, { method: "PATCH", body: JSON.stringify({ isRead: !m.isRead }) });
    patchLocal(updated); setOpen(updated); refreshStats();
  }

  async function remove(m: MessageItem) {
    if (!window.confirm("Delete this message permanently?")) return;
    await api(`/messages/${m._id}`, { method: "DELETE" });
    setOpen(null); reload(); refreshStats();
  }

  return (
    <>
      <PageHeader title="Messages" description="Messages sent through the website's message forms." />
      <Toolbar search={search} setSearch={setSearch} onRefresh={() => { reload(); refreshStats(); }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by read status" className={field}>
          <option value="">All messages</option><option value="unread">Unread only</option>
        </select>
        <select value={source} onChange={(e) => setSource(e.target.value)} aria-label="Filter by page" className={field}>
          <option value="">All pages</option><option value="support-us">Support Us page</option><option value="contact-us">Contact Us page</option>
        </select>
      </Toolbar>
      <ErrorNote text={error} />

      <ul className="space-y-3">
        {!data && <li className="p-8 text-center text-sm text-ink/60">Loading…</li>}
        {data?.items.length === 0 && <li className="card p-8 text-center text-sm text-ink/70">No messages yet.</li>}
        {data?.items.map((m) => (
          <li key={m._id}>
            <button onClick={() => openMessage(m)} className={`card block w-full p-4 text-left hover:shadow-lift ${m.isRead ? "" : "border-l-4 border-l-gold"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`text-base ${m.isRead ? "font-medium" : "font-bold"} text-navy`}>{m.name}</span>
                <span className="flex items-center gap-2 text-xs text-ink/65">
                  {!m.isRead && <Badge value="unread" label="New" />}
                  <span>{sourceLabel[m.source]}</span> · <span>{fmtDate(m.createdAt)}</span>
                </span>
              </div>
              {m.subject && <p className={`mt-1 text-sm ${m.isRead ? "" : "font-semibold"}`}>{m.subject}</p>}
              <p className="mt-1 line-clamp-2 text-sm text-ink/75">{m.message}</p>
            </button>
          </li>
        ))}
      </ul>
      {data && <Pager data={data} page={page} setPage={setPage} />}

      {open && (
        <Modal title="Message" onClose={() => setOpen(null)}>
          <div className="flex items-start justify-between gap-4 border-b border-navy/10 p-5">
            <div>
              <h2 className="font-serif text-xl font-bold">{open.subject || "Message"}</h2>
              <p className="mt-1 text-sm text-ink/70">From {open.name} · {sourceLabel[open.source]} · {fmtDate(open.createdAt)}</p>
            </div>
            <button onClick={() => setOpen(null)} aria-label="Close" className="rounded p-1 text-xl leading-none hover:bg-mist">×</button>
          </div>
          <div className="p-5">
            <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">{open.message}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <a href={`mailto:${open.email}?subject=${encodeURIComponent("Re: " + (open.subject || "Your message to JFI"))}`} className="btn-navy px-4 py-2"><Mail className="h-4 w-4" aria-hidden="true" /> Reply by email</a>
              {open.phone && <a href={`tel:+91${open.phone}`} className="btn-outline px-4 py-2"><Phone className="h-4 w-4" aria-hidden="true" /> +91 {open.phone}</a>}
            </div>
            <p className="mt-3 text-sm text-ink/70">{open.email}</p>
            <div className="mt-5 flex items-center justify-between border-t border-navy/10 pt-4 text-sm">
              <button onClick={() => toggleRead(open)} className="font-semibold text-navy underline underline-offset-2">Mark as {open.isRead ? "unread" : "read"}</button>
              <button onClick={() => remove(open)} className="inline-flex items-center gap-1 font-semibold text-red-700 hover:underline"><Trash2 className="h-4 w-4" aria-hidden="true" /> Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
