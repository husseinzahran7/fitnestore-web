import ClientsTable from "@/components/clients-table";
import InviteTraineeForm from "@/components/invite-trainee-form";
import { createClient, getViewer } from "@/lib/supabase/server";
import { getCoachLinks } from "@/lib/subscriptions";
import { linkExpired } from "@/lib/subscription-status";
import { getDict } from "@/lib/i18n";
import type { Client } from "@/types/client";

async function loadClients(): Promise<{ clients: Client[]; live: boolean }> {
  try {
    const supabase = await createClient();
    const viewer = await getViewer();
    if (!viewer) return { clients: [], live: false };
    const { data, error } = await supabase
      .from("clients")
      .select("id, plan, status, goals, progress, subscription, profile_id, created_at")
      .eq("coach_id", viewer.id)
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      return { clients: [], live: false };
    }
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name")
      .in(
        "id",
        data.map((r) => r.profile_id)
      );
    const names = new Map((profiles ?? []).map((p) => [p.id, p.name]));
    return {
      live: true,
      clients: data.map((r) => ({
        id: r.id,
        name: (names.get(r.profile_id) as string) ?? "Client",
        email: "",
        plan: r.plan,
        isActive: r.status === "active",
        joinDate: String(r.created_at).slice(0, 10),
        status: r.status as Client["status"],
        goals: (r.goals as string | null) ?? undefined,
        progress: (r.progress as number | null) ?? undefined,
        subscription: (r.subscription as string | null) ?? undefined,
      })),
    };
  } catch {
    return { clients: [], live: false };
  }
}

export default async function CoachClientsPage() {
  const [{ clients, live }, links, t] = await Promise.all([loadClients(), getCoachLinks(), getDict()]);
  const active = clients.filter((c) => c.isActive).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{t.coach.clientsTitle}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {clients.length} {t.coach.clientsCount} • {active} {t.common.active.toLowerCase()}
          </p>
        </div>
      </div>
      {live && links.length > 0 && (
        <ul className="mt-4 space-y-2">
          {links.slice(0, 10).map((l) => (
            <li
              key={l.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-300"
            >
              <span className="font-bold text-white">{l.trainee_name}</span>
              <span
                className={`rounded-full px-2 py-0.5 font-bold ${
                  linkExpired(l) ? "bg-red-500/15 text-red-400" : "bg-green-500/15 text-green-400"
                }`}
              >
                {l.status === "active" ? t.common.active : l.status === "pending" ? t.common.pending : l.status === "expired" ? t.common.expired : l.status}
                {l.ends_at ? ` → ${new Date(l.ends_at).toLocaleDateString()}` : l.starts_at ? "" : ` • ${t.subs.startsOnSend}`}
              </span>
              <span className="text-slate-500">{l.weeks} {t.subs.weeks}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <InviteTraineeForm t={t} />
      </div>
      <div className="mt-6">
        <ClientsTable clients={clients} live={live} logsBase="/coach/clients" t={t} />
      </div>
    </div>
  );
}
