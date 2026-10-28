import Link from "next/link";
import { ArrowRight, Clock, Info, Landmark, ShieldCheck, Wallet } from "lucide-react";
import { getDonationView } from "@/data/donation";
import CopyButton from "./CopyButton";
import DonatePayment from "./DonatePayment";

function PendingPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-gold-dark/60 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-dark">
      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
      {children}
    </span>
  );
}

export default function DonateSection() {
  const donation = getDonationView();
  
  return (
    <section id="donate" className="section-y scroll-mt-28 bg-mist" aria-labelledby="donate-title">
      <div className="container-jfi">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Contribute</p>
          <h2 id="donate-title" className="font-serif text-3xl font-bold sm:text-4xl">
            Donate Us
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded bg-gold" aria-hidden="true" />
          <p className="mt-6 text-lg leading-relaxed text-ink/90">
            Your contribution helps Justice Front of India carry forward its work in legal awareness, public
            advocacy, and support for people who struggle to reach the justice system. Every gift, whatever its
            size, strengthens our mission of justice, equality, and dignity for all.
          </p>
          
        </div>

        <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-2">
          {/* Donate card */}
          <article className="card flex h-full flex-col overflow-hidden border-0 bg-navy text-white" aria-labelledby="scan-title">
            <div className="h-1.5 bg-gradient-to-r from-gold via-white to-brand-green" aria-hidden="true" />
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold text-navy">
                  <Wallet className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 id="scan-title" className="font-serif text-2xl font-bold !text-white">
                  Donate Online
                </h3>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-white/85">
                Choose an amount and pay through our secure payment gateway. On a computer, the payment window
                shows a UPI QR code you can scan with any UPI app.
              </p>
              <div className="mt-6">
                <DonatePayment />
              </div>
            </div>
          </article>

          {/* Beneficiary card */}
          <article className="card flex h-full flex-col overflow-hidden" aria-labelledby="beneficiary-title">
            <div className="h-1.5 bg-gradient-to-r from-gold via-white to-brand-green" aria-hidden="true" />
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-gold">
                  <Landmark className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 id="beneficiary-title" className="font-serif text-2xl font-bold">
                  Beneficiary Details
                </h3>
              </div>

              {donation.beneficiaryPending && (
                <p className="mt-5 flex items-start gap-3 rounded-lg border border-gold/50 bg-gold/10 p-4 text-sm leading-relaxed text-ink">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden="true" />
                  Official beneficiary details will be updated once provided by JFI.
                </p>
              )}

              <dl className="mt-4">
                {donation.rows.map((row) => (
                  <div
                    key={row.key}
                    className="grid gap-1.5 border-b border-navy/10 py-3.5 last:border-b-0 sm:grid-cols-[minmax(0,12rem)_1fr] sm:items-center sm:gap-4"
                  >
                    <dt className="text-sm font-semibold text-navy">{row.label}</dt>
                    <dd className="min-w-0">
                      {row.value ? (
                        <span className="flex flex-wrap items-center justify-between gap-2">
                          <span className={`break-all text-[15px] text-ink ${row.mono ? "font-mono font-semibold" : "font-medium"}`}>
                            {row.value}
                          </span>
                          {row.mono && <CopyButton value={row.value} label={row.label} />}
                        </span>
                      ) : (
                        <PendingPill>Pending</PendingPill>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        </div>

        {/* Safety note */}
        <div className="mx-auto mt-10 flex max-w-4xl flex-col items-start justify-between gap-4 rounded-xl border border-navy/10 bg-white p-6 shadow-card sm:flex-row sm:items-center">
          <p className="flex items-start gap-3 text-sm leading-relaxed text-ink/90">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" aria-hidden="true" />
            <span>
              Use only the details published on this page. If you are unsure about a payment detail, please
              contact the JFI office before you transfer any amount.
            </span>
          </p>
          <Link href="/contact-us" className="btn-outline shrink-0">
            Contact Us <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}