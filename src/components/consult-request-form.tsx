"use client";

import { useActionState, useState } from "react";
import { requestConsult } from "@/lib/coaches";

export default function ConsultRequestForm({
  coachId,
  freeConsult,
  strings,
}: {
  coachId: string;
  freeConsult: boolean;
  strings?: {
    placeholder: string;
    free: string;
    paid: string;
    sending: string;
  };
}) {
  const [state, action, pending] = useActionState(requestConsult, {});
  const [note, setNote] = useState("");
  const t = {
    placeholder: "Goal in a sentence (optional)…",
    free: "Request free consult",
    paid: "Request paid session",
    sending: "Sending…",
    ...strings,
  };

  return (
    <form action={action}>
      <input type="hidden" name="coachId" value={coachId} />
      <input
        type="text"
        name="note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={500}
        placeholder={t.placeholder}
        aria-label={t.placeholder}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-3 w-full rounded-full bg-brand-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-500/30 transition-all hover:bg-brand-400 disabled:opacity-60"
      >
        {pending ? t.sending : freeConsult ? t.free : t.paid}
      </button>
      {state?.error && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {state.error}
        </p>
      )}
    </form>
  );
}
