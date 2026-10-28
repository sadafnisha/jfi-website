"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, RefreshCw, Search } from "lucide-react";
import { api, ApiError } from "./api";
import type { Page } from "./types";

export const fmtDate = (s: string | null | undefined) =>
  s ? new Date(s).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
export const rupees = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
export const pretty = (s: string) => s.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export const field =
  "rounded-md border border-navy/25 bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold";
export const th = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-navy/80";
export const td = "px-4 py-3 text-sm align-top";

const badgeColors: Record<string, string> = {
  pending: "bg-gold/15 text-gold-dark",
  approved: "bg-brand-green/10 text-brand-green",
  rejected: "bg-red-100 text-red-800",
  paid: "bg-brand-green/10 text-brand-green",
  created: "bg-gold/15 text-gold-dark",
  failed: "bg-red-100 text-red-800",
  verified: "bg-brand-green/15 text-brand-green",
  unread: "bg-navy text-white",
};
export const Badge = ({ value, label }: { value: string; label?: string }) => (
  <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColors[value] || "bg-mist text-ink"}`}>
    {label ?? pretty(value)}
  </span>
);

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink/70">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function useDebounced(value: string, ms = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

/** Loads a paginated list from /api/admin/<endpoint>; sends the user to the login page if the session ended. */
export function useList<T>(endpoint: string, params: Record<string, string>, autoRefresh = true) {
  const router = useRouter();
  const [data, setData] = useState<Page<T> | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const key = JSON.stringify(params);

  const load = useCallback(() => {
    const qs = new URLSearchParams({ ...JSON.parse(key), page: String(page) });
    setError("");
    api<Page<T>>(`${endpoint}?${qs}`)
      .then(setData)
      .catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 401) router.replace("/admin/login");
        else setError(e instanceof Error ? e.message : "Could not load data.");
      });
  }, [endpoint, key, page, router]);

  useEffect(() => { setPage(1); }, [key]);
  useEffect(() => { load(); }, [load]);

  // New submissions from the website show up on their own: refresh every 20 s and whenever the tab is opened again.
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => { if (document.visibilityState === "visible") load(); }, 20000);
    const onVisible = () => { if (document.visibilityState === "visible") load(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", onVisible); };
  }, [autoRefresh, load]);
  return { data, setData, page, setPage, error, reload: load };
}

export function Toolbar({
  search, setSearch, children, exportHref, onRefresh,
}: { search: string; setSearch: (v: string) => void; children?: React.ReactNode; exportHref?: string; onRefresh?: () => void }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" aria-hidden="true" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" aria-label="Search" className={`${field} w-56 pl-9 sm:w-64`} />
      </div>
      {children}
      {onRefresh && (
        <button type="button" onClick={onRefresh} className="inline-flex items-center gap-2 rounded-md border border-navy/25 px-3 py-2 text-sm font-semibold text-navy hover:bg-mist">
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> Refresh
        </button>
      )}
      {exportHref && (
        <a href={exportHref} className="btn-outline ml-auto px-4 py-2 text-sm">
          <Download className="h-4 w-4" aria-hidden="true" /> Export CSV
        </a>
      )}
    </div>
  );
}

export function Pager({ data, page, setPage }: { data: Page<unknown>; page: number; setPage: (n: number) => void }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink/80">
      <span>{data.total} record{data.total === 1 ? "" : "s"}</span>
      <div className="flex items-center gap-2">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-md border border-navy/25 px-3 py-1.5 font-semibold disabled:opacity-40">Previous</button>
        <span>Page {data.page} of {Math.max(1, data.pages)}</span>
        <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className="rounded-md border border-navy/25 px-3 py-1.5 font-semibold disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}

export const ErrorNote = ({ text }: { text: string }) =>
  text ? <p role="alert" className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-800">{text}</p> : null;

/** Simple accessible modal. */
export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-900/60 p-4" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className={`card my-8 w-full bg-white ${wide ? "max-w-3xl" : "max-w-xl"}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
