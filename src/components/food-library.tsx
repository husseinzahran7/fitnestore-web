"use client";

import { useActionState, useState } from "react";
import { addFood, addIngredient, type FoodItem } from "@/lib/foods";
import type { CoachMealLite } from "@/lib/foods";
import type { Dict } from "@/lib/locale";

const input =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500";
const label = "mb-1.5 block text-sm font-medium";
const MACROS = ["calories", "protein", "carbs", "fat", "fiber"] as const;

export default function FoodLibrary({
  foods,
  meals,
  t,
}: {
  foods: FoodItem[];
  meals: CoachMealLite[];
  t: Dict;
}) {
  const [foodState, foodAction, foodPending] = useActionState(addFood, {});
  const [ingState, ingAction, ingPending] = useActionState(addIngredient, {});
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const macroLabel = (m: (typeof MACROS)[number]) =>
    m === "calories" ? t.coach.kcal : m === "protein" ? t.coach.protein : m === "carbs" ? t.coach.carbs : m === "fat" ? t.coach.fat : t.coach.fiber;

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="font-bold">{t.coach.foodLibrary}</h2>
      <p className="mt-1 text-sm text-slate-400">
        {t.coach.foodLibraryDesc}
      </p>

      <form action={foodAction} className="mt-4 space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="food-name" className={label}>
              {t.coach.foodName}
            </label>
            <input
              id="food-name"
              name="name"
              required
              maxLength={80}
              placeholder={t.coach.foodNamePlaceholder}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="food-kind" className={label}>
              {t.coach.kind}
            </label>
            <select id="food-kind" name="kind" className={input}>
              <option value="food" className="bg-ink-900">
                {t.coach.kindFood}
              </option>
              <option value="supplement" className="bg-ink-900">
                {t.coach.kindSupplement}
              </option>
              <option value="drink" className="bg-ink-900">
                {t.coach.kindDrink}
              </option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {MACROS.map((m) => (
            <div key={m}>
              <label htmlFor={`food-${m}`} className={label}>
                {macroLabel(m)}
              </label>
              <input
                id={`food-${m}`}
                name={m}
                type="number"
                step="0.1"
                min="0"
                placeholder="0"
                className={input}
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={foodPending}
          className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-400 disabled:opacity-60"
        >
          {foodPending ? t.common.saving : t.common.addFood}
        </button>
        {foodState?.error && (
          <p role="alert" className="text-sm text-red-400">
            {foodState.error}
          </p>
        )}
        {foodState?.ok && (
          <p role="status" className="text-sm text-green-400">
            {t.coach.added}
          </p>
        )}
      </form>

      <ul className="mt-5 space-y-2">
        {foods.map((f) => (
          <li
            key={f.id}
            className="rounded-xl border border-white/10 bg-ink-950/60 p-3 text-sm"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{f.name}</span>
              {f.kind === "supplement" && (
                <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-[11px] font-bold text-purple-400">
                  {t.coach.kindSupplement}
                </span>
              )}
              <span className="text-xs text-slate-400">
                {f.calories100} kcal • P {f.protein100} • C {f.carbs100} • F{" "}
                {f.fat100} • {t.coach.fiberWord} {f.fiber100} /100g
              </span>
              {meals.length > 0 && (
                <button
                  type="button"
                  onClick={() => setAddingTo(addingTo === f.id ? null : f.id)}
                  className="ms-auto text-xs font-bold text-brand-400 hover:text-brand-500"
                >
                  {t.coach.addToMeal}
                </button>
              )}
            </div>
            {addingTo === f.id && (
              <form action={ingAction} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
                <input type="hidden" name="foodId" value={f.id} />
                <div className="flex-1">
                  <label htmlFor={`ing-meal-${f.id}`} className={label}>
                    {t.coach.mealLabel}
                  </label>
                  <select id={`ing-meal-${f.id}`} name="mealId" required className={input}>
                    {meals.map((m) => (
                      <option key={m.id} value={m.id} className="bg-ink-900">
                        {m.name} — {m.client}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-28">
                  <label htmlFor={`ing-grams-${f.id}`} className={label}>
                    {t.coach.grams}
                  </label>
                  <input
                    id={`ing-grams-${f.id}`}
                    name="grams"
                    type="number"
                    step="1"
                    min="1"
                    defaultValue={100}
                    required
                    className={input}
                  />
                </div>
                <button
                  type="submit"
                  disabled={ingPending}
                  className="rounded-full bg-brand-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-400 disabled:opacity-60"
                >
                  {t.coach.addBtn}
                </button>
              </form>
            )}
            {ingState?.error && addingTo === f.id && (
              <p role="alert" className="mt-1 text-xs text-red-400">
                {ingState.error}
              </p>
            )}
          </li>
        ))}
        {foods.length === 0 && (
          <li className="text-sm text-slate-400">
            {t.coach.libraryEmpty}
          </li>
        )}
      </ul>
    </div>
  );
}
