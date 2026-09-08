import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

async function adminStats() {
  try {
    const supabase = await createClient();
    const [{ count: users }, { count: clients }] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("clients").select("id", { count: "exact", head: true }),
    ]);
    return { users: users ?? 0, clients: clients ?? 0 };
  } catch {
    return { users: 0, clients: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await adminStats();

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-slate-400">
        Platform health and management shortcuts.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { v: String(stats.users), l: "Total users" },
          { v: String(stats.clients), l: "Client records" },
          { v: "Live", l: "Supabase backend" },
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
          { href: "/admin/policies", t: "Policies", d: "Terms, privacy, cookies content." },
          { href: "/admin/settings", t: "Settings", d: "Platform configuration." },
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
