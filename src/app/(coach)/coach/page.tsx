import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient, getViewer } from "@/lib/supabase/server";

async function coachStats() {
  type Recent = { id: string; name: string; plan: string; status: string };
  const empty = { total: 0, active: 0, recent: [] as Recent[] };
  try {
    const supabase = await createClient();
    const viewer = await getViewer();
    if (!viewer) return empty;
    const { data } = await supabase
      .from("clients")
      .select("id, plan, status, profile_id")
      .eq("coach_id", viewer.id)
      .order("created_at", { ascending: false });
    const rows = data ?? [];
    const { data: profiles } = rows.length
      ? await supabase
          .from("profiles")
          .select("id, name")
          .in(
            "id",
            rows.map((r) => r.profile_id)
          )
      : { data: [] };
    const names = new Map((profiles ?? []).map((p) => [p.id, p.name]));
    return {
      total: rows.length,
      active: rows.filter((r) => r.status === "active").length,
      recent: rows.slice(0, 5).map((r) => ({
        id: r.id,
        name: (names.get(r.profile_id) as string) ?? "Client",
        plan: r.plan,
        status: r.status,
      })),
    };
  } catch {
    return empty;
  }
}

export default async function CoachDashboard() {
  const viewer = await getViewer();
  const stats = await coachStats();

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Coach Dashboard</h1>
      <p className="mt-1 text-sm text-slate-400">
        {viewer?.name ?? "Coach"} — your roster at a glance.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { v: String(stats.total), l: "Total clients" },
          { v: String(stats.active), l: "Active now" },
          { v: String(stats.total - stats.active), l: "Pending / paused" },
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

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent clients</h2>
          <Link
            href="/coach/clients"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-400 hover:text-brand-500"
          >
            All clients <ArrowRight size={15} />
          </Link>
        </div>
        {stats.recent.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">
            No clients yet. They appear here once assigned to you.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-white/10">
            {stats.recent.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3">
                <span className="text-sm font-medium">{c.name}</span>
                <span className="text-xs text-slate-400">
                  {c.plan} • {c.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
