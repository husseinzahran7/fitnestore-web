"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { saveWorkout } from "@/lib/tracking-actions";
import type { TrackExercise, TrackHistory } from "@/lib/tracking";

interface SetRow {
  weight: string;
  reps: string;
  warmup: boolean;
}

function blankSets(n: number): SetRow[] {
  return Array.from({ length: Math.max(n, 1) }, () => ({
    weight: "",
    reps: "",
    warmup: false,
  }));
}

export default function TrackSession({
  sessionId,
  title,
  exercises,
  history,
}: {
  sessionId: string;
  title: string;
  exercises: TrackExercise[];
  history: TrackHistory[];
}) {
  const [order, setOrder] = useState<string[]>(exercises.map((e) => e.id));
  const [sets, setSets] = useState<Record<string, SetRow[]>>(() =>
    Object.fromEntries(
      exercises.map((e) => [
        e.id,
        e.prefill.length > 0
          ? e.prefill.map((p) => ({ ...p }))
          : blankSets(e.plannedSets),
      ])
    )
  );
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ error?: string; ok?: boolean }>({});

  const byId = new Map(exercises.map((e) => [e.id, e]));

  const patch = (exId: string, i: number, field: keyof SetRow, value: string | boolean) =>
    setSets((prev) => ({
      ...prev,
      [exId]: prev[exId].map((s, j) => (j === i ? { ...s, [field]: value } : s)),
    }));

  const addSet = (exId: string) =>
    setSets((prev) => ({
      ...prev,
      [exId]: [...prev[exId], { weight: "", reps: "", warmup: false }],
    }));

  const removeSet = (exId: string, i: number) =>
    setSets((prev) => ({
      ...prev,
      [exId]: prev[exId].filter((_, j) => j !== i),
    }));

  const move = (exId: string, dir: -1 | 1) =>
    setOrder((prev) => {
      const i = prev.indexOf(exId);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const save = () =>
    startTransition(async () => {
      const payload = order.map((exId, position) => ({
        exerciseId: exId,
        position,
        sets: (sets[exId] ?? []).map((s) => ({
          weight: s.weight,
          reps: s.reps,
          warmup: s.warmup,
        })),
      }));
      const fd = new FormData();
      fd.set("sessionId", sessionId);
      fd.set("title", title);
      fd.set("payload", JSON.stringify(payload));
      setResult(await saveWorkout({}, fd));
    });

  return (
    <div>
      <div className="space-y-4">
        {order.map((exId, pos) => {
          const ex = byId.get(exId);
          if (!ex) return null;
          const rows = sets[exId] ?? [];
          return (
            <section
              key={exId}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold">
                  <span className="mr-2 text-xs font-semibold text-slate-500">
                    {pos + 1}
                  </span>
                  {ex.name}
                </h2>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(exId, -1)}
                    disabled={pos === 0}
                    aria-label={`Move ${ex.name} up`}
                    className="rounded-lg px-2 py-1 text-slate-400 hover:bg-white/10 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(exId, 1)}
                    disabled={pos === order.length - 1}
                    aria-label={`Move ${ex.name} down`}
                    className="rounded-lg px-2 py-1 text-slate-400 hover:bg-white/10 disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {rows.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-6 shrink-0 text-center text-xs font-bold text-slate-500">
                      {i + 1}
                    </span>
                    <input
                      value={s.weight}
                      onChange={(e) => patch(exId, i, "weight", e.target.value)}
                      inputMode="decimal"
                      placeholder="kg"
                      aria-label={`Set ${i + 1} weight in kilos`}
                      className="w-full min-w-0 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
                    />
                    <input
                      value={s.reps}
                      onChange={(e) => patch(exId, i, "reps", e.target.value)}
                      inputMode="numeric"
                      placeholder="reps"
                      aria-label={`Set ${i + 1} reps`}
                      className="w-full min-w-0 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => patch(exId, i, "warmup", !s.warmup)}
                      aria-pressed={s.warmup}
                      title="Warm-up set"
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                        s.warmup
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-white/10 text-slate-400"
                      }`}
                    >
                      WU
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSet(exId, i)}
                      disabled={rows.length <= 1}
                      aria-label={`Remove set ${i + 1}`}
                      className="shrink-0 rounded-lg px-2 py-1 text-slate-500 hover:bg-white/10 hover:text-red-400 disabled:opacity-30"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addSet(exId)}
                className="mt-2 text-xs font-semibold text-brand-400 hover:text-brand-500"
              >
                + Add set
              </button>
            </section>
          );
        })}
      </div>

      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="mt-5 w-full rounded-full bg-brand-500 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-500/30 transition-all hover:bg-brand-400 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Finish workout"}
      </button>
      <RestTimer />
      {result.error && (
        <p role="alert" className="mt-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {result.error}
        </p>
      )}
      {result.ok && (
        <p role="status" className="mt-3 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Workout saved. History grows below on reload.
        </p>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold">History</h2>
          <ul className="mt-3 space-y-2">
            {history.map((h) => (
              <li
                key={h.id}
                className="flex justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm"
              >
                <span className="font-semibold">{h.performedOn}</span>
                <span className="text-slate-400">logged</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const PRESETS = [30, 60, 90, 120, 180];

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function RestTimer() {
  const [seconds, setSeconds] = useState(90);
  const [left, setLeft] = useState<number | null>(null);
  const endRef = useRef<number>(0);

  const running = left != null && left > 0;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(
      () => setLeft(Math.max(0, Math.round((endRef.current - Date.now()) / 1000))),
      250
    );
    return () => clearInterval(t);
  }, [running]);

  const start = (s: number) => {
    setSeconds(s);
    endRef.current = Date.now() + s * 1000;
    setLeft(s);
  };

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold">Rest timer</span>
        <span
          className={`font-mono text-2xl font-extrabold tabular-nums ${
            left === 0 ? "text-green-400" : "text-white"
          }`}
        >
          {left == null ? fmt(seconds) : fmt(left)}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => start(p)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
              seconds === p && left != null
                ? "bg-brand-500 text-white"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            {p >= 60 ? `${p / 60}m` : `${p}s`}
          </button>
        ))}
        {left != null && left > 0 ? (
          <button
            type="button"
            onClick={() => setLeft(null)}
            className="rounded-full px-3.5 py-1.5 text-xs font-bold text-slate-400 hover:text-white"
          >
            Reset
          </button>
        ) : (
          <button
            type="button"
            onClick={() => start(seconds)}
            className="rounded-full bg-brand-500/20 px-3.5 py-1.5 text-xs font-bold text-brand-400 hover:bg-brand-500/30"
          >
            {left === 0 ? "Again" : "Start"}
          </button>
        )}
      </div>
    </div>
  );
}
