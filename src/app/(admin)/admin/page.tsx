import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDict } from "@/lib/i18n";

async function adminStats() {
  const fallback = { users: 0, clients: 0, live: false };
  try {
    const supabase = await createClient();
    const [{ count: users, error: uErr }, { count: clients, error: cErr }] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("clients").select("id", { count: "exact", head: true }),
    ]);
    if (uErr || cErr) return fallback;
    return { users: users ?? 0, clients: clients ?? 0, live: true };
  } catch {
    return fallback;
  }
}

export default async function AdminDashboard() {
  const [stats, t] = await Promise.all([adminStats(), getDict()]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.nav.dashboard}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.admin.homeDesc}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { v: String(stats.users), l: t.admin.totalUsers },
          { v: String(stats.clients), l: t.admin.clientRecords },
          { v: stats.live ? t.common.online : t.common.offline, l: "Supabase backend" },
        ].map((s) => (
          <div
            key={s.l}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center"
          >
            <div className="text-3xl font-extrabold">{s.v}</div>
            <div className="mt-1 text-sm text-slate-400">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { href: "/admin/subscriptions", t: t.nav.subscriptions, d: t.admin.subsCard },
          { href: "/admin/policies", t: t.nav.policies, d: t.admin.policiesCard },
          { href: "/admin/settings", t: t.nav.settings, d: t.settings.platformConfig },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-0.5 hover:border-brand-500/50"
          >
            <div>
              <h2 className="text-lg font-bold">{l.t}</h2>
              <p className="mt-1 text-sm text-slate-400">{l.d}</p>
            </div>
            <ArrowRight size={18} className="text-brand-400 transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
