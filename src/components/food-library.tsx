"use client";

import { useActionState, useState } from "react";
import { addFood, addIngredient, type FoodItem } from "@/lib/foods";
import type { CoachMealLite } from "@/lib/foods";

const input =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500";
const label = "mb-1.5 block text-sm font-medium";
const MACROS = ["calories", "protein", "carbs", "fat", "fiber"] as const;

export default function FoodLibrary({
  foods,
  meals,
}: {
  foods: FoodItem[];
  meals: CoachMealLite[];
}) {
  const [foodState, foodAction, foodPending] = useActionState(addFood, {});
  const [ingState, ingAction, ingPending] = useActionState(addIngredient, {});
  const [addingTo, setAddingTo] = useState<string | null>(null);

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="font-bold">Food library</h2>
      <p className="mt-1 text-sm text-slate-400">
        Nutrients per 100g. Chicken breast, protein powder, creatine — all the
        same mechanism.
      </p>

      <form action={foodAction} className="mt-4 space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="food-name" className={label}>
              Name
            </label>
            <input
              id="food-name"
              name="name"
              required
              maxLength={80}
              placeholder="e.g. Chicken breast"
              className={input}
            />
          </div>
          <div>
            <label htmlFor="food-kind" className={label}>
              Kind
            </label>
            <select id="food-kind" name="kind" className={input}>
              <option value="food" className="bg-ink-900">
                Food
              </option>
              <option value="supplement" className="bg-ink-900">
                Supplement
              </option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {MACROS.map((m) => (
            <div key={m}>
              <label htmlFor={`food-${m}`} className={label}>
                {m === "calories" ? "kcal" : m} /100g
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
          {foodPending ? "Saving…" : "Add food"}
        </button>
        {foodState?.error && (
          <p role="alert" className="text-sm text-red-400">
            {foodState.error}
          </p>
        )}
        {foodState?.ok && (
          <p role="status" className="text-sm text-green-400">
            Added.
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
                  supplement
                </span>
              )}
              <span className="text-xs text-slate-400">
                {f.calories100} kcal • P {f.protein100} • C {f.carbs100} • F{" "}
                {f.fat100} • fiber {f.fiber100} /100g
              </span>
              {meals.length > 0 && (
                <button
                  type="button"
                  onClick={() => setAddingTo(addingTo === f.id ? null : f.id)}
                  className="ml-auto text-xs font-bold text-brand-400 hover:text-brand-500"
                >
                  + meal
                </button>
              )}
            </div>
            {addingTo === f.id && (
              <form action={ingAction} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
                <input type="hidden" name="foodId" value={f.id} />
                <div className="flex-1">
                  <label htmlFor={`ing-meal-${f.id}`} className={label}>
                    Meal
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
                    Grams
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
                  Add
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
            Library empty — add chicken breast first.
          </li>
        )}
      </ul>
    </div>
  );
}
