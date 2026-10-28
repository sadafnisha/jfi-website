"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClipboardList, IndianRupee, Images, Loader2, LogOut, Menu, MessageSquare, ShieldCheck, X } from "lucide-react";
import { api } from "./api";
import type { Stats } from "./types";

const AdminContext = createContext<{ stats: Stats | null; refreshStats: () => void }>({ stats: null, refreshStats: () => {} });
export const useAdmin = () => useContext(AdminContext);

const NAV = [
  { href: "/admin/applications", label: "Application", icon: ClipboardList, badge: (s: Stats) => s.applications.pending },
  { href: "/admin/donations", label: "Donation Data", icon: IndianRupee, badge: () => 0 },
  { href: "/admin/kyc", label: "KYC Pending", icon: ShieldCheck, badge: (s: Stats) => s.kycPending },
  { href: "/admin/media", label: "Add Photos / Videos", icon: Images, badge: () => 0 },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare, badge: (s: Stats) => s.unreadMessages },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const isLogin = pathname.startsWith("/admin/login");
  const [email, setEmail] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [open, setOpen] = useState(false);

  const refreshStats = useCallback(() => {
    api<Stats>("/stats").then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    if (isLogin) return;
    api<{ email: string }>("/me")
      .then((m) => { setEmail(m.email); refreshStats(); })
      .catch(() => router.replace("/admin/login"));
  }, [isLogin, router, refreshStats]);

  useEffect(() => { setOpen(false); }, [pathname]);

  // keep the sidebar counts (new applications / KYC / messages) fresh
  useEffect(() => {
    if (isLogin || !email) return;
    const t = setInterval(() => { if (document.visibilityState === "visible") refreshStats(); }, 20000);
    return () => clearInterval(t);
  }, [isLogin, email, refreshStats]);

  async function logout() {
    await api("/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
  }

  if (isLogin) return <>{children}</>;

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-navy" aria-label="Loading" />
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-navy text-white">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <Image src="/jfi-logo.png" alt="" width={40} height={40} className="h-10 w-10 rounded bg-white object-contain p-0.5" />
        <div className="leading-tight">
          <p className="font-serif text-lg font-bold">JFI Admin</p>
          <p className="text-[11px] uppercase tracking-widest text-gold-light">Control panel</p>
        </div>
      </div>

      <nav aria-label="Admin sections" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname.startsWith(href);
          const count = stats ? badge(stats) : 0;
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${active ? "bg-gold text-navy" : "text-white/85 hover:bg-white/10"}`}>
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {count > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${active ? "bg-navy text-white" : "bg-gold text-navy"}`} aria-label={`${count} new`}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="mb-3 truncate text-xs text-white/70" title={email}>{email}</p>
        <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-md border border-white/30 px-3 py-2 text-sm font-semibold hover:bg-white/10">
          <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <AdminContext.Provider value={{ stats, refreshStats }}>
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

      {/* mobile top bar + drawer */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-navy px-4 py-3 text-white lg:hidden">
        <span className="font-serif text-lg font-bold">JFI Admin</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded p-1.5 hover:bg-white/10"><Menu className="h-6 w-6" /></button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <div className="absolute inset-0 bg-navy-900/60" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72 max-w-[85%]">
            {sidebar}
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-2 top-4 rounded p-1.5 text-white hover:bg-white/10"><X className="h-5 w-5" /></button>
          </div>
        </div>
      )}

      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
      </main>
    </AdminContext.Provider>
  );
}
