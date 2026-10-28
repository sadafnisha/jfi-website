"use client";

import { useState } from "react";
import type { Donation } from "./types";
import { Badge, ErrorNote, PageHeader, Pager, Toolbar, field, fmtDate, rupees, td, th, useDebounced, useList } from "./ui";

export default function DonationsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("paid");
  const params = { search: useDebounced(search), status };
  const { data, page, setPage, error, reload } = useList<Donation>("/donations", params);
  const qs = new URLSearchParams(params).toString();

  return (
    <>
      <PageHeader title="Donation Data" description="Payments made through the Support Us page. A donation is listed as Paid only after the payment gateway has confirmed it." />
      <Toolbar search={search} setSearch={setSearch} onRefresh={reload} exportHref={`/api/admin/donations.csv?${qs}`}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by payment status" className={field}>
          <option value="paid">Paid (confirmed)</option><option value="failed">Failed</option><option value="created">Started, not paid</option><option value="all">All attempts</option>
        </select>
      </Toolbar>
      <ErrorNote text={error} />

      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-navy/10">
          <thead className="bg-mist"><tr>{["Date", "Donor", "Contact", "Amount", "Method", "Payment ID", "Status"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-navy/10">
            {!data && <tr><td colSpan={7} className="p-8 text-center text-sm text-ink/60">Loading…</td></tr>}
            {data?.items.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-sm text-ink/60">No donations found.</td></tr>}
            {data?.items.map((d) => (
              <tr key={d._id} className="hover:bg-mist/60">
                <td className={`${td} whitespace-nowrap`}>{fmtDate(d.paidAt || d.createdAt)}</td>
                <td className={td}>
                  <span className="font-semibold">{d.donorName}</span>
                  {d.pan && <><br /><span className="text-ink/70">PAN {d.pan}</span></>}
                  {d.message && <><br /><span className="text-ink/70">“{d.message}”</span></>}
                </td>
                <td className={td}>{d.phone}<br /><span className="text-ink/70">{d.email}</span></td>
                <td className={`${td} whitespace-nowrap font-semibold`}>{rupees(d.amountPaise / 100)}</td>
                <td className={td}>{d.method ? d.method.toUpperCase() : "—"}{d.paymentVpa && <><br /><span className="text-ink/70">{d.paymentVpa}</span></>}</td>
                <td className={`${td} break-all font-mono text-xs`}>{d.razorpayPaymentId || "—"}</td>
                <td className={td}><Badge value={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data && <Pager data={data} page={page} setPage={setPage} />}
    </>
  );
}
