"use client";

import { useActionState } from "react";
import { submitCheckin } from "@/lib/progress-actions";
import type { UserCheckin } from "@/lib/progress-queries";
import type { Dict } from "@/lib/locale";

const input =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500";

export default function CheckinSection({
  checkins,
  t,
}: {
  checkins: UserCheckin[];
  t: Dict;
}) {
  const [state, action, pending] = useActionState(submitCheckin, {});

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold">{t.progress.checkinTitle}</h2>
      <form
        action={action}
        className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
      >
        <label htmlFor="checkin-notes" className="mb-1.5 block text-sm font-medium">
          {t.progress.checkinLabel}
        </label>
        <textarea
          id="checkin-notes"
          name="notes"
          rows={3}
          maxLength={1000}
          required
          placeholder={t.progress.checkinPh}
          className={input}
        />
        <button
          type="submit"
          disabled={pending}
          className="mt-3 rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-400 disabled:opacity-60"
        >
          {pending ? t.progress.sending : t.progress.sendCheckin}
        </button>
        {state?.error && (
          <p role="alert" className="mt-2 text-xs text-red-400">
            {state.error}
          </p>
        )}
        {state?.ok && (
          <p role="status" className="mt-2 text-xs text-green-400">
            {t.progress.sentCoach}
          </p>
        )}
      </form>

      {checkins.length > 0 && (
        <ul className="mt-4 space-y-2">
          {checkins.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm"
            >
              <span className="font-semibold">{c.date}</span>
              <p className="mt-1 text-slate-300">{c.notes}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
