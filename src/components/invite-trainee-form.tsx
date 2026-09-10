"use client";

import { useActionState } from "react";
import { inviteTrainee } from "@/lib/subscriptions";

export default function InviteTraineeForm() {
  const [state, action, pending] = useActionState(inviteTrainee, {});

  return (
    <form
      action={action}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
    >
      <h2 className="font-bold">Invite trainee</h2>
      <p className="mt-1 text-sm text-slate-400">
        Ask for their user ID (their Settings page shows it). Admin activates
        after your payment clears.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px_auto]">
        <input
          name="trainee"
          required
          placeholder="Trainee user ID"
          aria-label="Trainee user ID"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-sm outline-none placeholder:font-sans placeholder:text-slate-600 focus:border-brand-500"
        />
        <input
          name="weeks"
          type="number"
          min={1}
          max={52}
          defaultValue={4}
          required
          aria-label="Weeks"
          title="Weeks (1–52)"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-400 disabled:opacity-50"
        >
          {pending ? "…" : "Invite"}
        </button>
      </div>
      {state?.error && (
        <p role="alert" className="mt-2 text-xs text-red-400">{state.error}</p>
      )}
      {state?.ok && (
        <p role="status" className="mt-2 text-xs text-green-400">
          Invite sent — pending admin activation.
        </p>
      )}
    </form>
  );
}
