"use client";

import { useActionState } from "react";
import { logExtra, type FoodItem } from "@/lib/foods";

const input =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500";
const label = "mb-1.5 block text-sm font-medium";

export default function ExtrasForm({ foods }: { foods: FoodItem[] }) {
  const [state, action, pending] = useActionState(logExtra, {});

  if (foods.length === 0) return null;

  return (
    <form
      action={action}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
    >
      <h2 className="text-sm font-bold">Log extra food or drink</h2>
      <p className="mt-0.5 text-xs text-slate-500">
        Ate outside the plan? Juice, snack, extra serving — log it here.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="extra-food" className={label}>
            Food / drink
          </label>
          <select id="extra-food" name="foodId" required className={input}>
            {foods.map((f) => (
              <option key={f.id} value={f.id} className="bg-ink-900">
                {f.name} ({f.kind})
              </option>
            ))}
          </select>
        </div>
        <div className="w-28">
          <label htmlFor="extra-grams" className={label}>
            Grams / ml
          </label>
          <input
            id="extra-grams"
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
          disabled={pending}
          className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-400 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Log"}
        </button>
      </div>
      {state?.error && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="mt-2 text-xs text-green-400">
          Logged.
        </p>
      )}
    </form>
  );
}
