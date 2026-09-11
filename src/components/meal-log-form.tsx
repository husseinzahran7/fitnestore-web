"use client";

import { useActionState } from "react";
import { logMeal } from "@/lib/nutrition-actions";
import type { CoachClientLite } from "@/lib/nutrition-queries";
import type { NutritionPlan } from "@/data/mockNutrition";
import type { Dict } from "@/lib/locale";

const input =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500";
const label = "mb-1.5 block text-sm font-medium";

export default function MealLogForm({
  plans,
  clients,
  t,
}: {
  plans: NutritionPlan[];
  clients: CoachClientLite[];
  t: Dict;
}) {
  const [state, action, pending] = useActionState(logMeal, {});

  return (
    <form
      action={action}
      className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
    >
      <h2 className="font-bold">{t.coach.logMealTitle}</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="meal-plan" className={label}>
            {t.coach.plan}
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
            {t.coach.client}
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
            {t.coach.meal}
          </label>
          <input
            id="meal-name"
            name="name"
            required
            maxLength={80}
            placeholder={t.coach.mealPlaceholder}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="meal-day" className={label}>
            {t.coach.dayOptional}
          </label>
          <input
            id="meal-day"
            name="day"
            maxLength={20}
            placeholder={t.coach.dayPlaceholder}
            className={input}
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="meal-details" className={label}>
          {t.coach.detailsOptional}
        </label>
        <textarea
          id="meal-details"
          name="details"
          rows={2}
          maxLength={500}
          placeholder={t.coach.detailsPlaceholder}
          className={input}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-full bg-brand-500 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-400 disabled:opacity-60"
      >
        {pending ? t.common.saving : t.common.logMeal}
      </button>
      {state?.error && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="mt-2 text-sm text-green-400">
          {t.common.mealLogged}
        </p>
      )}
    </form>
  );
}
