"use client";

import { useActionState } from "react";
import { activateAppSub, activateLink, activatePendingLink, expireDue, setLinkStatus } from "@/lib/subscriptions";
import type { AppSub, CoachLink } from "@/lib/subscriptions";
import type { Dict } from "@/lib/locale";

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString();
}

export default function SubsAdminClient({
  links,
  subs,
  t,
}: {
  links: CoachLink[];
  subs: AppSub[];
  t: Dict;
}) {
  const [linkState, linkAction, linkPending] = useActionState(activateLink, {});
  const [appState, appAction, appPending] = useActionState(activateAppSub, {});
  const [expState, expAction, expPending] = useActionState(expireDue, {});

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{t.admin.subscriptions}</h1>
          <p className="mt-1 text-sm text-slate-400">
            Offline pay → activate here by user ID + weeks (1–52). Clock starts when coach sends first plan.
          </p>
        </div>
        <form action={expAction}>
          <button
            type="submit"
            disabled={expPending}
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            {expPending ? "…" : "Expire due now"}
          </button>
        </form>
      </div>
      {expState?.error && <p className="mt-2 text-xs text-red-400">{expState.error}</p>}
      {expState?.ok && <p className="mt-2 text-xs text-green-400">Swept.</p>}
      <p className="mt-2 text-xs text-slate-500">
        Auto-expire runs daily 03:00 UTC (pg_cron job expire-links-daily, coach links + app subs).
        This button sweeps on demand.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <form action={linkAction} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-bold">{t.admin.activateLink} (coach)</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-xs font-bold text-slate-400">
              {t.admin.trainee}
              <input
                name="trainee"
                required
                placeholder="user UUID from Admin → Users"
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-normal text-white outline-none placeholder:text-slate-600 focus:border-brand-500"
              />
            </label>
            <label className="block text-xs font-bold text-slate-400">
              {t.admin.coach}
              <input
                name="coach"
                required
                placeholder="coach UUID"
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-normal text-white outline-none placeholder:text-slate-600 focus:border-brand-500"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-bold text-slate-400">
                {t.admin.weeksLabel}
                <input
                  name="weeks"
                  type="number"
                  min={1}
                  max={52}
                  defaultValue={4}
                  required
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-normal text-white outline-none focus:border-brand-500"
                />
              </label>
              <label className="block text-xs font-bold text-slate-400">
                {t.admin.paymentRef}
                <input
                  name="paymentRef"
                  maxLength={200}
                  placeholder="cash / transfer ref"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-normal text-white outline-none placeholder:text-slate-600 focus:border-brand-500"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={linkPending}
              className="w-full rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-400 disabled:opacity-50"
            >
              {linkPending ? "…" : t.admin.activate}
            </button>
            {linkState?.error && <p className="text-xs text-red-400">{linkState.error}</p>}
            {linkState?.ok && <p className="text-xs text-green-400">Activated. Starts on first coach send.</p>}
          </div>
        </form>

        <form action={appAction} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-bold">{t.admin.activateLink} (app read-only)</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-xs font-bold text-slate-400">
              User (UUID)
              <input
                name="user"
                required
                placeholder="user UUID"
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-normal text-white outline-none placeholder:text-slate-600 focus:border-brand-500"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-bold text-slate-400">
                {t.admin.weeksLabel}
                <input
                  name="weeks"
                  type="number"
                  min={1}
                  max={52}
                  defaultValue={4}
                  required
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-normal text-white outline-none focus:border-brand-500"
                />
              </label>
              <label className="block text-xs font-bold text-slate-400">
                {t.admin.paymentRef}
                <input
                  name="paymentRef"
                  maxLength={200}
                  placeholder="cash / transfer ref"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-normal text-white outline-none placeholder:text-slate-600 focus:border-brand-500"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={appPending}
              className="w-full rounded-full border border-white/20 px-6 py-3 text-sm font-bold transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              {appPending ? "…" : t.admin.activate}
            </button>
            {appState?.error && <p className="text-xs text-red-400">{appState.error}</p>}
            {appState?.ok && <p className="text-xs text-green-400">App sub active.</p>}
          </div>
        </form>
      </div>

      <h2 className="mt-8 text-lg font-bold">Coach links ({links.length})</h2>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li
            key={l.id}
            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm sm:flex-row sm:items-center"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate font-bold">
                {l.trainee_name} <span className="font-normal text-slate-500">↔</span> {l.coach_name}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {l.weeks}w • {l.status}
                {l.starts_at ? ` • ${fmtDate(l.starts_at)} → ${fmtDate(l.ends_at)}` : " • not started (starts on send)"}
                {l.payment_ref ? ` • ${l.payment_ref}` : ""}
              </div>
            </div>
            <LinkStatusButtons id={l.id} status={l.status} weeks={l.weeks} />
          </li>
        ))}
        {links.length === 0 && <p className="text-sm text-slate-500">No links yet.</p>}
      </ul>

      <h2 className="mt-8 text-lg font-bold">App subs ({subs.length})</h2>
      <ul className="mt-3 space-y-2">
        {subs.map((s) => (
          <li key={s.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">
            <span className="font-bold">{s.user_name}</span>
            <span className="ms-2 text-xs text-slate-400">
              {s.weeks}w • {s.status} • {fmtDate(s.starts_at)} → {fmtDate(s.ends_at)}
            </span>
          </li>
        ))}
        {subs.length === 0 && <p className="text-sm text-slate-500">No app subs yet.</p>}
      </ul>
    </div>
  );
}

function LinkStatusButtons({ id, status, weeks }: { id: string; status: string; weeks: number }) {
  const [state, action, pending] = useActionState(setLinkStatus, {});
  const [actState, actAction, actPending] = useActionState(activatePendingLink, {});
  if (status === "pending") {
    return (
      <div className="flex flex-col gap-1.5">
        <form action={actAction} className="flex items-center gap-2">
          <input type="hidden" name="id" value={id} />
          <input
            type="number"
            name="weeks"
            min={1}
            max={52}
            defaultValue={weeks}
            aria-label="Weeks"
            className="w-20 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={actPending}
            className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white hover:bg-green-400 disabled:opacity-50"
          >
            {actPending ? "…" : "Activate"}
          </button>
        </form>
        {(actState?.error || state?.error) && (
          <span className="text-xs text-red-400">{actState?.error ?? state?.error}</span>
        )}
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            name="status"
            value="revoked"
            disabled={pending}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300 hover:bg-white/20 disabled:opacity-50"
          >
            Decline
          </button>
        </form>
      </div>
    );
  }
  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      {state?.error && <span className="text-xs text-red-400">{state.error}</span>}
      {status === "active" ? (
        <button
          type="submit"
          name="status"
          value="revoked"
          disabled={pending}
          className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-400 hover:bg-red-500/25 disabled:opacity-50"
        >
          Revoke
        </button>
      ) : status === "revoked" || status === "expired" ? (
        <button
          type="submit"
          name="status"
          value="active"
          disabled={pending}
          className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-400 hover:bg-green-500/25 disabled:opacity-50"
        >
          Reactivate
        </button>
      ) : null}
    </form>
  );
}
