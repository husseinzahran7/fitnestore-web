"use client";

import { useActionState } from "react";
import { createAppointment } from "@/lib/schedule";
import type { CoachClientLite } from "@/lib/nutrition-queries";

const input =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500";
const label = "mb-1.5 block text-sm font-medium";

export default function AppointmentForm({
  clients,
}: {
  clients: CoachClientLite[];
}) {
  const [state, action, pending] = useActionState(createAppointment, {});
  const today = new Date().toISOString().slice(0, 10);

  if (clients.length === 0) return null;

  return (
    <form
      action={action}
      className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
    >
      <h2 className="font-bold">Plan a session</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="appt-client" className={label}>
            Client
          </label>
          <select id="appt-client" name="clientId" required className={input}>
            {clients.map((c) => (
              <option key={c.id} value={c.id} className="bg-ink-900">
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="appt-type" className={label}>
            Session type
          </label>
          <input
            id="appt-type"
            name="sessionType"
            defaultValue="Personal Training"
            maxLength={80}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="appt-date" className={label}>
            Date
          </label>
          <input
            id="appt-date"
            name="date"
            type="date"
            required
            defaultValue={today}
            className={input}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="appt-start" className={label}>
              Start
            </label>
            <input
              id="appt-start"
              name="startTime"
              type="time"
              required
              defaultValue="09:00"
              className={input}
            />
          </div>
          <div>
            <label htmlFor="appt-end" className={label}>
              End
            </label>
            <input
              id="appt-end"
              name="endTime"
              type="time"
              required
              defaultValue="10:00"
              className={input}
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="appt-notes" className={label}>
          Notes (optional)
        </label>
        <input
          id="appt-notes"
          name="notes"
          maxLength={500}
          placeholder="Focus, location…"
          className={input}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-full bg-brand-500 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-400 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Schedule session"}
      </button>
      {state?.error && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="mt-2 text-sm text-green-400">
          Scheduled.
        </p>
      )}
    </form>
  );
}
