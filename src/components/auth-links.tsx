"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Dict } from "@/lib/locale";

// Public header auth area: signed-out visitors get Sign in + Start coaching,
// signed-in users get Open app (their role home) — no more dead bounce.
export default function AuthLinks({ mobile, t }: { mobile?: boolean; t: Dict }) {
  const [home, setHome] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => (r.ok ? r.json() : { home: null }))
      .then((d) => setHome((d.home as string | null) ?? null))
      .catch(() => setHome(null))
      .finally(() => setReady(true));
  }, []);

  if (!ready) return null;

  if (home) {
    return (
      <a
        href={home}
        className={
          mobile
            ? "mt-2 flex items-center justify-center gap-1.5 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white"
            : "inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-colors hover:bg-brand-400"
        }
      >
        {t.site.openApp}
        <ArrowRight size={16} className="rtl:-scale-x-100" />
      </a>
    );
  }

  return (
    <>
      {!mobile && (
        <a
          href="/login"
          className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
        >
          {t.auth.signIn}
        </a>
      )}
      <a
        href="/register"
        className={
          mobile
            ? "mt-2 flex items-center justify-center gap-1.5 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white"
            : "inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-colors hover:bg-brand-400"
        }
      >
        {t.site.startCoaching}
        <ArrowRight size={16} className="rtl:-scale-x-100" />
      </a>
    </>
  );
}
