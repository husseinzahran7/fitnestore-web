"use client";

import { useActionState } from "react";
import { uploadAvatar } from "@/lib/coaches";
import type { Dict } from "@/lib/locale";

export default function AvatarForm({ currentUrl, t }: { currentUrl: string; t: Dict }) {
  const [state, action, pending] = useActionState(uploadAvatar, {});

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center"
    >
      {currentUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentUrl}
          alt={t.coach.photoAlt}
          className="h-16 w-16 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-slate-400">
          ?
        </div>
      )}
      <div className="min-w-0 flex-1">
        <label htmlFor="avatar" className="mb-1.5 block text-sm font-medium">
          {t.coach.photoLabel}
        </label>
        <input
          id="avatar"
          name="avatar"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="w-full text-sm text-slate-300 file:me-3 file:rounded-full file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-brand-400"
        />
        {state?.error && (
          <p role="alert" className="mt-1 text-xs text-red-400">
            {state.error}
          </p>
        )}
        {state?.ok && (
          <p role="status" className="mt-1 text-xs text-green-400">
            {t.coach.uploaded}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-400 disabled:opacity-60"
      >
        {pending ? t.coach.uploading : t.coach.uploadBtn}
      </button>
    </form>
  );
}
