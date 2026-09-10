"use client";

import { useActionState } from "react";
import { decideConsult, type ConsultRequest } from "@/lib/coaches";

export default function ConsultInbox({
  requests,
}: {
  requests: ConsultRequest[];
}) {
  const [state, action, pending] = useActionState(decideConsult, {});

  if (requests.length === 0) return null;

  return (
    <div className="mb-6 rounded-2xl border border-brand-500/30 bg-brand-500/[0.06] p-5">
      <h2 className="font-bold">
        Consult requests{" "}
        <span className="ms-1 rounded-full bg-brand-500 px-2 py-0.5 text-xs text-white">
          {requests.length}
        </span>
      </h2>
      <div className="mt-3 space-y-3">
        {requests.map((r) => (
          <form
            key={r.id}
            action={action}
            className="flex flex-col gap-2 rounded-xl border border-white/10 bg-ink-950/60 p-4 sm:flex-row sm:items-center"
          >
            <input type="hidden" name="requestId" value={r.id} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{r.userName}</div>
              {r.note && (
                <div className="truncate text-sm text-slate-400">“{r.note}”</div>
              )}
              <div className="text-xs text-slate-500">{r.createdAt}</div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="submit"
                name="decision"
                value="accepted"
                disabled={pending}
                className="rounded-full bg-green-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-green-400 disabled:opacity-50"
              >
                Accept
              </button>
              <button
                type="submit"
                name="decision"
                value="declined"
                disabled={pending}
                className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-slate-300 hover:bg-white/20 disabled:opacity-50"
              >
                Decline
              </button>
            </div>
          </form>
        ))}
      </div>
      {state?.error && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {state.error}
        </p>
      )}
    </div>
  );
}
