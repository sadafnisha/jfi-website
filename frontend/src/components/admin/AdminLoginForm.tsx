"use client";

import { type FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { api } from "./api";

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Already logged in? Go straight to the dashboard.
  useEffect(() => {
    api("/me")
      .then(() => router.replace("/admin"))
      .catch(() => {});
  }, [router]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData(e.currentTarget);
    try {
      await api("/login", {
        method: "POST",
        body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
      });
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-gold via-white to-brand-green" aria-hidden="true" />
        <div className="p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <Image src="/jfi-logo.png" alt="" width={44} height={44} className="h-11 w-11 object-contain" />
            <div>
              <h1 className="font-serif text-xl font-bold leading-tight">JFI Admin Panel</h1>
              <p className="text-xs text-ink/70">Authorised staff only</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-navy">Email</label>
              <input id="email" name="email" type="email" required autoComplete="username"
                className="mt-1.5 block w-full rounded-md border border-navy/25 bg-white px-4 py-3 text-base focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-navy">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password"
                  className="mt-1.5 block w-full rounded-md border border-navy/25 bg-white py-3 pl-4 pr-12 text-base focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-[calc(50%+3px)] -translate-y-1/2 rounded p-2 text-navy/70 hover:bg-mist hover:text-navy focus:outline-none focus:ring-2 focus:ring-gold">
                  {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="flex items-start gap-2 rounded-md border border-red-700/40 bg-red-50 p-3 text-sm text-red-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {error}
              </p>
            )}

            <button type="submit" disabled={busy} className="btn-navy w-full disabled:opacity-60">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Signing in...</> : <><Lock className="h-4 w-4" aria-hidden="true" /> Log in</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
