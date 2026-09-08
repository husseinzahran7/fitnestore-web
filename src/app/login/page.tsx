"use client";

import { useActionState } from "react";
import GoogleButton from "@/components/google-button";
import { login, type AuthState } from "./actions";

const initial: AuthState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="GYMers logo" className="h-8 w-8" />
          <span className="text-lg font-extrabold">
            GYM<span className="text-brand-500">ers</span>
          </span>
        </a>
        <h1 className="mt-6 text-2xl font-extrabold">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-400">
          Sign in to your coaching home.
        </p>

        <form action={action} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
            />
          </div>

          {state.error && (
            <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-brand-500 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-400 disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          New here?{" "}
          <a href="/register" className="font-semibold text-brand-400 hover:text-brand-500">
            Create account
          </a>
        </p>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-500">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <GoogleButton label="Continue with Google" />
      </div>
    </div>
  );
}
