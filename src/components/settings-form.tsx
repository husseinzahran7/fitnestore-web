"use client";

import { useActionState } from "react";
import { updateProfile, type SettingsState } from "@/lib/settings-actions";
import CopyIdButton from "@/components/copy-id";
import type { Viewer } from "@/lib/supabase/server";
import type { Dict } from "@/lib/locale";

export default function SettingsForm({ viewer, t }: { viewer: Viewer; t: Dict }) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(
    updateProfile,
    {}
  );

  return (
    <form action={action} className="max-w-md space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          {t.coach.displayName}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={viewer.name}
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
        />
      </div>
      <div>
        <span className="mb-1.5 block text-sm font-medium">{t.settings.emailLabel}</span>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
          {viewer.email ?? "—"}
        </div>
      </div>
      <div>
        <span className="mb-1.5 block text-sm font-medium">{t.settings.roleLabel}</span>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm capitalize text-slate-300">
          {viewer.role}
          {viewer.membership ? ` • ${viewer.membership}` : ""}
        </div>
      </div>
      <div>
        <span className="mb-1.5 block text-sm font-medium">
          {t.settings.userIdLabel} <span className="font-normal text-slate-500">{t.settings.shareHint}</span>
        </span>
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-400">{viewer.id}</span>
          <CopyIdButton id={viewer.id} label={t.settings.copyId} copiedLabel={t.common.copied} />
        </div>
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {t.common.saved}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-500 px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-400 disabled:opacity-60"
      >
        {pending ? t.common.saving : t.common.saveChanges}
      </button>
    </form>
  );
}
