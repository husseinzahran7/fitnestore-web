"use client";

import { useActionState } from "react";
import { checkMeal, logWater, type MealWithFood } from "@/lib/foods";

const input =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500";

function MacroLine({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <span className="text-xs text-slate-300">
      {label} <span className="font-bold text-white">{value}{unit}</span>
    </span>
  );
}

function MealCard({ meal }: { meal: MealWithFood }) {
  const [state, action, pending] = useActionState(checkMeal, {});

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-bold">{meal.name}</h2>
          {meal.day && <p className="text-xs text-slate-500">{meal.day}</p>}
        </div>
        {meal.checked && (
          <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-400">
            Eaten ✓
          </span>
        )}
      </div>

      {meal.details && (
        <p className="mt-1 text-sm text-slate-400">{meal.details}</p>
      )}

      {meal.ingredients.length > 0 ? (
        <ul className="mt-3 space-y-1.5 text-sm">
          {meal.ingredients.map((i) => (
            <li key={i.id} className="flex justify-between gap-2">
              <span>
                {i.food}{" "}
                <span className="text-slate-500">{i.grams}g</span>
              </span>
              <span className="shrink-0 text-slate-400">{i.calories} kcal</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-500">
          No ingredients listed — follow the description above.
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/10 pt-3">
        <MacroLine label="Cal" value={meal.totals.calories} unit="" />
        <MacroLine label="Protein" value={meal.totals.protein} unit="g" />
        <MacroLine label="Carbs" value={meal.totals.carbs} unit="g" />
        <MacroLine label="Fat" value={meal.totals.fat} unit="g" />
        <MacroLine label="Fiber" value={meal.totals.fiber} unit="g" />
      </div>

      <form action={action} className="mt-4 space-y-2">
        <input type="hidden" name="mealId" value={meal.id} />
        <input
          type="text"
          name="comment"
          defaultValue={meal.comment}
          maxLength={300}
          placeholder="Ate 350g instead of 200g…"
          aria-label={`Comment on ${meal.name}`}
          className={input}
        />
        <button
          type="submit"
          disabled={pending}
          className={`rounded-full px-6 py-2 text-xs font-bold transition-all disabled:opacity-60 ${
            meal.checked
              ? "bg-white/10 text-slate-300 hover:bg-white/20"
              : "bg-brand-500 text-white hover:bg-brand-400"
          }`}
        >
          {pending ? "Saving…" : meal.checked ? "Update comment" : "Mark eaten"}
        </button>
        {state?.error && (
          <p role="alert" className="text-xs text-red-400">
            {state.error}
          </p>
        )}
        {state?.ok && (
          <p role="status" className="text-xs text-green-400">
            Saved.
          </p>
        )}
      </form>
    </section>
  );
}

function WaterLogger({ waterMl }: { waterMl: number }) {
  const [state, action, pending] = useActionState(logWater, {});
  const liters = (waterMl / 1000).toFixed(2).replace(/\.?0+$/, "");

  return (
    <form
      action={action}
      className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
    >
      <div className="text-sm">
        <span className="font-bold">Water today:</span>{" "}
        <span className="font-mono font-extrabold text-brand-400">
          {liters} L
        </span>
      </div>
      <div className="ml-auto flex gap-2">
        {[250, 500].map((ml) => (
          <button
            key={ml}
            type="submit"
            name="ml"
            value={ml}
            disabled={pending}
            className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold hover:bg-white/20 disabled:opacity-50"
          >
            +{ml}ml
          </button>
        ))}
      </div>
      {state?.error && (
        <p role="alert" className="w-full text-xs text-red-400">
          {state.error}
        </p>
      )}
    </form>
  );
}

export default function UserMeals({
  meals,
  waterMl,
  live,
}: {
  meals: MealWithFood[];
  waterMl: number;
  live: boolean;
}) {
  if (!live) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
        Nothing assigned yet.
      </p>
    );
  }

  const day = meals.reduce(
    (t, m) => ({
      calories: +(t.calories + m.totals.calories).toFixed(1),
      protein: +(t.protein + m.totals.protein).toFixed(1),
      carbs: +(t.carbs + m.totals.carbs).toFixed(1),
      fat: +(t.fat + m.totals.fat).toFixed(1),
      fiber: +(t.fiber + m.totals.fiber).toFixed(1),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand-500/30 bg-brand-500/[0.07] p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Today’s totals
        </h2>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          <MacroLine label="Calories" value={day.calories} unit="" />
          <MacroLine label="Protein" value={day.protein} unit="g" />
          <MacroLine label="Carbs" value={day.carbs} unit="g" />
          <MacroLine label="Fat" value={day.fat} unit="g" />
          <MacroLine label="Fiber" value={day.fiber} unit="g" />
        </div>
      </div>

      <WaterLogger waterMl={waterMl} />

      {meals.map((m) => (
        <MealCard key={m.id} meal={m} />
      ))}
    </div>
  );
}
