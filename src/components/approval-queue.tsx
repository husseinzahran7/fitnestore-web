"use client";

import { useActionState } from "react";
import { decideApproval, type PendingCoach } from "@/lib/coaches";

export default function ApprovalQueue({
  coaches,
}: {
  coaches: PendingCoach[];
}) {
  const [state, action, pending] = useActionState(decideApproval, {});

  if (coaches.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
        No coach listings yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {coaches.map((c) => (
        <form
          key={c.profileId}
          action={action}
          className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center"
        >
          <input type="hidden" name="profileId" value={c.profileId} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold">{c.displayName || c.name}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  c.approved
                    ? "bg-green-500/15 text-green-400"
                    : "bg-orange-500/15 text-orange-400"
                }`}
              >
                {c.approved ? "Approved" : "Pending"}
              </span>
              <span className="text-xs text-slate-500">{c.years} yrs</span>
            </div>
            {c.bio && (
              <p className="mt-1 truncate text-sm text-slate-400">{c.bio}</p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            {!c.approved ? (
              <button
                type="submit"
                name="approved"
                value="true"
                disabled={pending}
                className="rounded-full bg-green-500 px-5 py-2 text-xs font-bold text-white hover:bg-green-400 disabled:opacity-50"
              >
                Approve
              </button>
            ) : (
              <button
                type="submit"
                name="approved"
                value="false"
                disabled={pending}
                className="rounded-full bg-white/10 px-5 py-2 text-xs font-bold text-slate-300 hover:bg-white/20 disabled:opacity-50"
              >
                Unlist
              </button>
            )}
          </div>
        </form>
      ))}
      {state?.error && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}
    </div>
  );
}
