"use client";

import { useState } from "react";
import type { WeeklyWorkouts } from "@/types/workout";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function UserSchedule({ week }: { week: WeeklyWorkouts }) {
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const [day, setDay] = useState(
    DAYS.includes(today) ? today : "monday"
  );
  const sessions = week[day] ?? [];

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
        {DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={`rounded-xl py-2.5 text-xs font-bold capitalize transition-colors sm:text-sm ${
              day === d ? "bg-brand-500 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {d.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {sessions.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
            Rest day. Recover well.
          </p>
        )}
        {sessions.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold">{s.title}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  s.completed
                    ? "bg-green-500/15 text-green-400"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                {s.completed ? "Done" : s.time}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {s.description} • {s.duration}
            </p>
            <ul className="mt-3 space-y-1.5">
              {s.exercises.map((e) => (
                <li key={e.name} className="flex justify-between text-sm">
                  <span>{e.name}</span>
                  <span className="text-slate-400">
                    {e.sets} × {e.reps}
                    {e.weight ? ` • ${e.weight}` : ""}
                  </span>
                </li>
              ))}
              {s.exercises.length === 0 && (
                <li className="text-sm text-slate-500">No exercises — full rest.</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
