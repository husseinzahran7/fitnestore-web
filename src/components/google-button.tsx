"use client";

import { useActionState } from "react";
import { signInWithGoogle } from "@/app/login/actions";

export default function GoogleButton({ label }: { label: string }) {
  const [state, action, pending] = useActionState(signInWithGoogle, {});

  return (
    <form action={action}>
      {state?.error && (
        <p
          role="alert"
          className="mb-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 py-3 text-sm font-bold transition-all hover:bg-white/10 disabled:opacity-60"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.8-5 3.8-8.9z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.2 0-5.9-2.1-6.8-5l-.1.1-3.6 2.8v.1C3.5 21.3 7.5 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.1-3.6-2.8-.1.1C.5 8.6 0 10.2 0 12s.5 3.4 1.4 4.9l3.8-2.5z"
          />
          <path
            fill="#EA4335"
            d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.5 0 3.5 2.7 1.4 6.8l3.8 2.9c.9-2.9 3.6-5 6.8-5z"
          />
        </svg>
        {pending ? "Redirecting…" : label}
      </button>
    </form>
  );
}
