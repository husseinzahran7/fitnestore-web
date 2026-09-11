"use client";

import { useActionState, useMemo, useState } from "react";
import { logClientMetric } from "@/lib/progress-actions";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Client, MetricType } from "@/data/progress/types";
import type { Dict } from "@/lib/locale";

export default function ProgressBoard({
  clients,
  live = false,
  t,
}: {
  clients: Client[];
  live?: boolean;
  t: Dict;
}) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [metric, setMetric] = useState<MetricType>("weight");
  const METRICS: Array<{ key: MetricType; label: string; color: string }> = [
    { key: "weight", label: t.coach.metricWeight, color: "#0080ff" },
    { key: "bodyFat", label: t.coach.metricBodyFat, color: "#22c55e" },
    { key: "strength", label: t.coach.metricStrength, color: "#f59e0b" },
    { key: "endurance", label: t.coach.metricEndurance, color: "#a855f7" },
  ];

  const client = useMemo(
    () => clients.find((c) => c.id === clientId) ?? clients[0],
    [clients, clientId]
  );

  if (!client) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
        {t.coach.noProgressData}
      </p>
    );
  }

  const active = METRICS.find((m) => m.key === metric)!;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {clients.map((c) => (
          <button
            key={c.id}
            onClick={() => setClientId(c.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              c.id === client.id
                ? "bg-brand-500 text-white"
                : "border border-white/15 text-slate-300 hover:bg-white/10"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
          <div className="text-3xl font-extrabold">{client.progress}%</div>
          <div className="mt-1 text-sm text-slate-400">{t.coach.overall}</div>
        </div>
        {client.goals.slice(0, 3).map((g) => (
          <div
            key={g}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center text-sm font-medium"
          >
            {g}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                metric === m.key
                  ? "bg-white text-ink-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={client.metrics[metric]}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
              <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                domain={["dataMin - 5", "dataMax + 5"]}
              />
              <Tooltip
                contentStyle={{
                  background: "#0b1220",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={active.color}
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-bold">{t.coach.logMetrics}</h2>
      {live && client && <MetricLogForm key={client.id} clientId={client.id} t={t} />}
      <h2 className="mt-8 text-lg font-bold">{t.coach.checkInsTitle}</h2>
      <div className="mt-3 space-y-3">
        {client.checkIns.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{c.date}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  c.completed
                    ? "bg-green-500/15 text-green-400"
                    : "bg-orange-500/15 text-orange-400"
                }`}
              >
                {c.completed ? t.common.done : t.common.pending}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-slate-300">{c.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricLogForm({ clientId, t }: { clientId: string; t: Dict }) {
  const [state, action, pending] = useActionState(logClientMetric, {});

  return (
    <form
      action={action}
      className="mt-3 flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-end"
    >
      <input type="hidden" name="clientId" value={clientId} />
      <div className="flex-1">
        <label htmlFor={`weight-${clientId}`} className="mb-1.5 block text-sm font-medium">
          {t.coach.weightKg}
        </label>
        <input
          id={`weight-${clientId}`}
          name="weight"
          type="number"
          step="0.1"
          min="1"
          placeholder="80.5"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
        />
      </div>
      <div className="flex-1">
        <label htmlFor={`bodyFat-${clientId}`} className="mb-1.5 block text-sm font-medium">
          {t.coach.bodyFatPct}
        </label>
        <input
          id={`bodyFat-${clientId}`}
          name="bodyFat"
          type="number"
          step="0.1"
          min="0"
          placeholder="19.5"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-400 disabled:opacity-60"
      >
        {pending ? t.common.saving : t.coach.logBtn}
      </button>
      {state?.error && (
        <p role="alert" className="text-xs text-red-400 sm:self-center">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="text-xs text-green-400 sm:self-center">
          {t.common.saved}
        </p>
      )}
    </form>
  );
}
