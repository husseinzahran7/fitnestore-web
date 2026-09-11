"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GoogleButton from "@/components/google-button";
import DemoLogins from "@/components/demo-logins";
import type { Dict } from "@/lib/locale";
import { login, type AuthState } from "@/app/login/actions";

const initial: AuthState = {};

export default function LoginForm({ t }: { t: Dict }) {
  const [state, action, pending] = useActionState(login, initial);
  const next = useSearchParams().get("next");

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="GYMers logo" className="h-8 w-8" />
          <span className="text-lg font-extrabold">
            GYM<span className="text-brand-500">ers</span>
          </span>
        </Link>
        <h1 className="mt-6 text-2xl font-extrabold">{t.authPage.welcomeBack}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {t.authPage.signinHome}
        </p>

        <form action={action} className="mt-6 space-y-4">
          {next && next.startsWith("/") && !next.startsWith("//") && (
            <input type="hidden" name="next" value={next} />
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              {t.settings.emailLabel}
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
              {t.authPage.passwordLabel}
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
            {pending ? t.common.signingIn : t.auth.signIn}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          {t.authPage.newHere}{" "}
          <a href="/register" className="font-semibold text-brand-400 hover:text-brand-500">
            {t.common.createAccount}
          </a>
        </p>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-500">
          <span className="h-px flex-1 bg-white/10" />
          {t.authPage.orWord}
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <GoogleButton label={t.authPage.googleContinue} />

        <DemoLogins />
      </div>
    </div>
  );
}
