"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { MealPlan, NutritionPlan } from "@/data/mockNutrition";

function statusStyle(status: MealPlan["status"]) {
  if (status === "active") return "bg-green-500/15 text-green-400";
  if (status === "completed") return "bg-blue-500/15 text-blue-400";
  return "bg-orange-500/15 text-orange-400";
}

export default function NutritionBoards({
  templates,
  plans,
}: {
  templates: NutritionPlan[];
  plans: MealPlan[];
}) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"plans" | "templates">("plans");

  const q = query.trim().toLowerCase();
  const shownPlans = useMemo(
    () =>
      plans.filter(
        (p) =>
          !q ||
          p.planName.toLowerCase().includes(q) ||
          p.clientName.toLowerCase().includes(q)
      ),
    [plans, q]
  );
  const shownTemplates = useMemo(
    () =>
      templates.filter(
        (t) =>
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      ),
    [templates, q]
  );

  return (
    <div>
      <div className="relative mb-5 max-w-sm">
        <Search
          size={16}
          className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-500 rtl:-scale-x-100"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search plans…"
          aria-label="Search nutrition plans"
          className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 ps-10 pe-4 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
        />
      </div>

      <div className="mb-5 grid w-full max-w-md grid-cols-2 gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
        {(["plans", "templates"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full py-2 text-sm font-semibold capitalize transition-colors ${
              tab === t ? "bg-brand-500 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {t === "plans" ? "Client plans" : "Templates"}
          </button>
        ))}
      </div>

      {tab === "plans" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shownPlans.map((p) => (
            <div key={p.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold">{p.planName}</h3>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle(p.status)}`}>
                  {p.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{p.clientName}</p>
              <p className="mt-3 text-sm text-slate-300">
                {p.endDate ? `${p.startDate} → ${p.endDate}` : `Since ${p.startDate}`}
              </p>
              {p.mealCount != null && (
                <p className="mt-1 text-sm text-slate-400">
                  Meals: <span className="font-semibold text-white">{p.mealCount}</span>
                </p>
              )}
              {p.adherenceRate != null && (
                <p className="mt-1 text-sm text-slate-400">
                  Adherence: <span className="font-semibold text-white">{p.adherenceRate}%</span>
                </p>
              )}
            </div>
          ))}
          {shownPlans.length === 0 && (
            <p className="text-sm text-slate-400">No client plans found.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shownTemplates.map((t) => (
            <div key={t.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="font-bold">{t.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{t.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-brand-500/15 px-2.5 py-1 text-xs text-brand-400">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Used by {t.clientCount} clients
              </p>
            </div>
          ))}
          {shownTemplates.length === 0 && (
            <p className="text-sm text-slate-400">No templates found.</p>
          )}
        </div>
      )}
    </div>
  );
}
