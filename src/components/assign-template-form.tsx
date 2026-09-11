"use client";

import { useActionState } from "react";
import { assignTemplate } from "@/lib/nutrition-actions";
import type { CoachClientLite } from "@/lib/nutrition-queries";
import type { NutritionPlan } from "@/data/mockNutrition";
import type { Dict } from "@/lib/locale";

const input =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500";
const label = "mb-1.5 block text-sm font-medium";

export default function AssignTemplateForm({
  templates,
  clients,
  t,
}: {
  templates: NutritionPlan[];
  clients: CoachClientLite[];
  t: Dict;
}) {
  const [state, action, pending] = useActionState(assignTemplate, {});

  if (templates.length === 0 || clients.length === 0) return null;

  return (
    <form
      action={action}
      className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
    >
      <h2 className="font-bold">{t.coach.assignTitle}</h2>
      <p className="mt-1 text-sm text-slate-400">
        {t.coach.assignDesc}
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="assign-template" className={label}>
            {t.coach.template}
          </label>
          <select id="assign-template" name="templateId" required className={input}>
            {templates.map((t) => (
              <option key={t.id} value={t.id} className="bg-ink-900">
                {t.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="assign-client" className={label}>
            {t.coach.client}
          </label>
          <select id="assign-client" name="clientId" required className={input}>
            {clients.map((c) => (
              <option key={c.id} value={c.id} className="bg-ink-900">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-full bg-brand-500 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-400 disabled:opacity-60"
      >
        {pending ? t.common.assigning : t.common.assign}
      </button>
      {state?.error && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="mt-2 text-sm text-green-400">
          {t.common.assigned}
        </p>
      )}
    </form>
  );
}
