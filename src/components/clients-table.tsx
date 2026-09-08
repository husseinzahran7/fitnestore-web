"use client";

import { useActionState, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Client } from "@/types/client";
import { updateClientStatus } from "@/lib/client-actions";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ClientsTable({
  clients,
  live = false,
  logsBase,
}: {
  clients: Client[];
  live?: boolean;
  logsBase?: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.plan.toLowerCase().includes(q) ||
        (c.goals ?? "").toLowerCase().includes(q)
    );
  }, [clients, query]);

  return (
    <div>
      <div className="relative mb-5 max-w-sm">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clients…"
          aria-label="Search clients"
          className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
          No clients match “{query}”.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((c) => (
            <li
              key={c.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-brand-500/40 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-sm font-bold text-brand-400">
                  {initials(c.name)}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold">{c.name}</div>
                  <div className="truncate text-sm text-slate-400">{c.email}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                  {c.plan}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    c.isActive
                      ? "bg-green-500/15 text-green-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {c.isActive ? "Active" : "Inactive"}
                </span>
                {c.progress != null && (
                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                      <span
                        className="block h-full rounded-full bg-brand-500"
                        style={{ width: `${c.progress}%` }}
                      />
                    </span>
                    {c.progress}%
                  </span>
                )}
                <ClientStatusToggle
                  clientId={c.id}
                  currentStatus={c.status ?? (c.isActive ? "active" : "cancelled")}
                  live={live}
                />
                {logsBase && (
                  <a
                    href={`${logsBase}/${c.id}/logs`}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    Logs
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ClientStatusToggle({
  clientId,
  currentStatus,
  live,
}: {
  clientId: string;
  currentStatus: string;
  live: boolean;
}) {
  const [state, action, isPending] = useActionState(updateClientStatus, {});
  const isActive = currentStatus === "active";
  const nextStatus = isActive ? "cancelled" : "active";

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={clientId} />
      <input type="hidden" name="status" value={nextStatus} />
      <button
        type="submit"
        disabled={!live || isPending}
        title={!live ? "Connect Supabase for live writes" : undefined}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
          isActive
            ? "bg-red-500/15 text-red-400 hover:bg-red-500/25"
            : "bg-green-500/15 text-green-400 hover:bg-green-500/25"
        }`}
      >
        {isPending ? "Saving..." : isActive ? "Deactivate" : "Activate"}
      </button>
      {state?.error && (
        <span className="text-xs text-red-400">{state.error}</span>
      )}
    </form>
  );
}
