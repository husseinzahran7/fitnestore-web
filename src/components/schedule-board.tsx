"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarClock } from "lucide-react";
import type { ScheduleItem } from "@/data/mockSchedule";
import type { Dict } from "@/lib/locale";

const FILTERS = ["all", "upcoming", "completed", "cancelled"] as const;

function statusStyle(status: ScheduleItem["status"]) {
  if (status === "upcoming") return "bg-blue-500/15 text-blue-400";
  if (status === "completed") return "bg-green-500/15 text-green-400";
  return "bg-red-500/15 text-red-400";
}

export default function ScheduleBoard({
  items,
  icsBase,
  onStatus,
  t,
}: {
  items: ScheduleItem[];
  icsBase?: string;
  onStatus?: (id: string, status: string) => Promise<{ error?: string }>;
  t: Dict;
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const filterLabel = (f: (typeof FILTERS)[number]) =>
    f === "all" ? t.common.all : f === "upcoming" ? t.common.upcoming : f === "completed" ? t.common.completed : t.common.cancelled;

  const grouped = useMemo(() => {
    const list =
      filter === "all" ? items : items.filter((i) => i.status === filter);
    const map = new Map<string, ScheduleItem[]>();
    for (const it of list) {
      const arr = map.get(it.date) ?? [];
      arr.push(it);
      map.set(it.date, arr);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [items, filter]);

  const upcomingHours = useMemo(
    () =>
      items
        .filter((s) => s.status === "upcoming")
        .reduce((total, s) => {
          const start = new Date(`2000-01-01T${s.startTime}`).getTime();
          const end = new Date(`2000-01-01T${s.endTime}`).getTime();
          return total + (end - start) / 3_600_000;
        }, 0),
    [items]
  );

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
          <div className="text-3xl font-extrabold">
            {items.filter((s) => s.status === "upcoming").length}
          </div>
          <div className="mt-1 text-sm text-slate-400">{t.coach.upcomingSessions}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
          <div className="text-3xl font-extrabold">
            {new Set(items.map((s) => s.clientId)).size}
          </div>
          <div className="mt-1 text-sm text-slate-400">{t.coach.activeClients}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
          <div className="text-3xl font-extrabold">{upcomingHours}h</div>
          <div className="mt-1 text-sm text-slate-400">{t.coach.scheduledHours}</div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">{t.coach.sessions}</h2>
        <div className="flex gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? "bg-brand-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {filterLabel(f)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-6">
        {grouped.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
            {t.coach.noSessions}
          </p>
        )}
        {grouped.map(([date, sessions]) => (
          <div key={date}>
            <h3 className="border-b border-white/10 pb-2 text-sm font-bold uppercase tracking-wider text-slate-300">
              {new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <div className="mt-3 space-y-3">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-brand-500/40 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-brand-500/15 md:flex">
                      <CalendarClock size={20} className="text-brand-400" />
                    </div>
                    <div>
                      <div className="font-semibold">{s.clientName}</div>
                      <div className="text-sm text-slate-400">{s.sessionType}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-slate-300">
                      {s.startTime} – {s.endTime}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(s.status)}`}
                    >
                      {s.status === "upcoming" ? t.common.upcoming : s.status === "completed" ? t.common.completed : t.common.cancelled}
                    </span>
                    {icsBase && (
                      <a
                        href={`${icsBase}/${s.id}/ics`}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-white/20 hover:text-white"
                      >
                        {t.common.addToCalendar}
                      </a>
                    )}
                    {onStatus && s.status === "upcoming" && (
                      <StatusButtons id={s.id} onStatus={onStatus} t={t} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusButtons({
  id,
  onStatus,
  t,
}: {
  id: string;
  onStatus: (id: string, status: string) => Promise<{ error?: string }>;
  t: Dict;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const act = (status: string) =>
    startTransition(async () => {
      const res = await onStatus(id, status);
      setError(res?.error ?? null);
    });

  return (
    <span className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => act("completed")}
        disabled={pending}
        className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-400 hover:bg-green-500/25 disabled:opacity-50"
      >
        {t.common.done}
      </button>
      <button
        type="button"
        onClick={() => act("cancelled")}
        disabled={pending}
        className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-400 hover:bg-red-500/25 disabled:opacity-50"
      >
        {t.common.cancel}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </span>
  );
}
