"use client";

import { useActionState } from "react";
import { logMeal } from "@/lib/nutrition-actions";
import type { CoachClientLite } from "@/lib/nutrition-queries";
import type { NutritionPlan } from "@/data/mockNutrition";

const input =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500";
const label = "mb-1.5 block text-sm font-medium";

export default function MealLogForm({
  plans,
  clients,
}: {
  plans: NutritionPlan[];
  clients: CoachClientLite[];
}) {
  const [state, action, pending] = useActionState(logMeal, {});

  return (
    <form
      action={action}
      className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
    >
      <h2 className="font-bold">Log a meal for a client</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="meal-plan" className={label}>
            Plan
          </label>
          <select id="meal-plan" name="planId" required className={input}>
            {plans.map((p) => (
              <option key={p.id} value={p.id} className="bg-ink-900">
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="meal-client" className={label}>
            Client
          </label>
          <select id="meal-client" name="clientId" required className={input}>
            {clients.map((c) => (
              <option key={c.id} value={c.id} className="bg-ink-900">
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="meal-name" className={label}>
            Meal
          </label>
          <input
            id="meal-name"
            name="name"
            required
            maxLength={80}
            placeholder="e.g. Breakfast, Post-workout shake…"
            className={input}
          />
        </div>
        <div>
          <label htmlFor="meal-day" className={label}>
            Day (optional)
          </label>
          <input
            id="meal-day"
            name="day"
            maxLength={20}
            placeholder="e.g. Monday"
            className={input}
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="meal-details" className={label}>
          Details (optional)
        </label>
        <textarea
          id="meal-details"
          name="details"
          rows={2}
          maxLength={500}
          placeholder="Portions, macros, notes…"
          className={input}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-full bg-brand-500 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-400 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Log meal"}
      </button>
      {state?.error && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="mt-2 text-sm text-green-400">
          Meal logged.
        </p>
      )}
    </form>
  );
}
