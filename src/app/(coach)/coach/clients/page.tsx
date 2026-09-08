import ClientsTable from "@/components/clients-table";
import { createClient, getViewer } from "@/lib/supabase/server";
import { mockClients } from "@/data/mockClients";
import type { Client } from "@/types/client";

async function loadClients(): Promise<{ clients: Client[]; live: boolean }> {
  try {
    const supabase = await createClient();
    const viewer = await getViewer();
    if (!viewer) return { clients: mockClients, live: false };
    const { data, error } = await supabase
      .from("clients")
      .select("id, plan, status, goals, progress, subscription, profile_id")
      .eq("coach_id", viewer.id)
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      return { clients: mockClients, live: false };
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
        joinDate: "",
        status: r.status as Client["status"],
        goals: (r.goals as string | null) ?? undefined,
        progress: (r.progress as number | null) ?? undefined,
        subscription: (r.subscription as string | null) ?? undefined,
      })),
    };
  } catch {
    return { clients: mockClients, live: false };
  }
}

export default async function CoachClientsPage() {
  const { clients, live } = await loadClients();
  const active = clients.filter((c) => c.isActive).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Clients</h1>
          <p className="mt-1 text-sm text-slate-400">
            {clients.length} total • {active} active
            {!live && " • preview data (connect Supabase for live roster)"}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <ClientsTable clients={clients} live={live} />
      </div>
    </div>
  );
}
