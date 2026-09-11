"use client";

import { useActionState } from "react";
import CopyIdButton from "@/components/copy-id";
import {
  setUserDisabled,
  setUserRole,
  type ManagedUser,
} from "@/lib/coaches";
import type { Dict } from "@/lib/locale";

const ROLES = ["user", "coach", "admin"] as const;

function RowActions({ user, t }: { user: ManagedUser; t: Dict }) {
  const [roleState, roleAction, rolePending] = useActionState(setUserRole, {});
  const [lockState, lockAction, lockPending] = useActionState(setUserDisabled, {});

  if (user.protected) {
    return (
      <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-bold text-brand-400">
        {t.admin.ownerBadge}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={roleAction} className="flex items-center gap-1.5">
        <input type="hidden" name="id" value={user.id} />
        <select
          name="role"
          defaultValue={user.role}
          aria-label={`Role for ${user.name}`}
          className="rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-xs outline-none focus:border-brand-500"
        >
          {ROLES.map((r) => (
            <option key={r} value={r} className="bg-ink-900">
              {r}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={rolePending}
          className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/20 disabled:opacity-50"
        >
          {t.common.set}
        </button>
      </form>
      <form action={lockAction}>
        <input type="hidden" name="id" value={user.id} />
        <input
          type="hidden"
          name="disabled"
          value={user.disabled ? "false" : "true"}
        />
        <button
          type="submit"
          disabled={lockPending}
          className={`rounded-full px-3 py-1.5 text-xs font-bold disabled:opacity-50 ${
            user.disabled
              ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
              : "bg-red-500/15 text-red-400 hover:bg-red-500/25"
          }`}
        >
          {user.disabled ? t.common.enable : t.common.disable}
        </button>
      </form>
      {(roleState?.error || lockState?.error) && (
        <span role="alert" className="text-xs text-red-400">
          {roleState?.error ?? lockState?.error}
        </span>
      )}
    </div>
  );
}

export default function UsersTable({ users, t }: { users: ManagedUser[]; t: Dict }) {
  if (users.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
        {t.admin.noAccounts}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {users.map((u) => (
        <li
          key={u.id}
          className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate font-semibold">{u.name}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-300">
                {u.role === "superadmin" ? t.admin.ownerBadge : u.role}
              </span>
              {u.disabled && (
                <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-bold text-red-400">
                  {t.admin.disabledBadge}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="truncate font-mono text-xs text-slate-500">
                {u.id}
              </span>
              <CopyIdButton id={u.id} label={t.admin.copyFullUser} copiedLabel={t.common.copied} />
            </div>
          </div>
          <RowActions user={u} t={t} />
        </li>
      ))}
    </ul>
  );
}
