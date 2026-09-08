# KIMI RELAY — mutations corrected brief (forward verbatim)

## Verdict: plan direction approved, implementation details rejected (4 breaks)

### Break 1. Paths do not exist
Real: `src/app/(coach)/coach/clients/page.tsx` (async server component, live read + mock fallback already built), `src/components/clients-table.tsx` ("use client", search + list only, zero action buttons). There is NO `src/app/coach/clients/page.tsx`, NO `ClientsTable.tsx` under `components/clients/`, NO `ClientActions.tsx`, NO `ClientStatus.tsx`, NO `loading.tsx`, NO `src/hooks/` directory. Touch max 3 files: (1) NEW `src/lib/client-actions.ts`, (2) EDIT `src/components/clients-table.tsx`, (3) EDIT `src/app/(coach)/coach/clients/page.tsx` (pass `live` through). Nothing else.

### Break 2. React Query is not installed
Answer to your Q3: NO. `package.json` has zero `@tanstack/*`, grep for `QueryClient|useMutation|useQuery` returns zero hits. Do NOT add it (new deps forbidden without agreement). Canonical mutation pattern is Server Actions — copy `src/lib/settings-actions.ts`: `"use server"`, `createClient()` from `@/lib/supabase/server`, `auth.getUser()`, honest error strings when unconfigured/signed out, `revalidatePath("/", "layout")`, consumed via `useActionState` with pending state on the button. No API route needed.

### Break 3. `updated_at` does not exist
`clients` columns: `id, profile_id, coach_id, plan, status, goals, progress, subscription, subscription_end, created_at`. Your `.update({ status, updated_at })` errors. Update `{ status }` only. Allowed values `active | pending | cancelled` (you got this right). Spec: Activate → `active`, Deactivate → `cancelled`. Leave `pending` alone (initial state).

### Break 4. Client import is a factory, not a singleton
Browser: `import { createClient } from "@/lib/supabase/client"` then `const supabase = createClient()` (`createBrowserClient` from `@supabase/ssr`). Server: `import { createClient } from "@/lib/supabase/server"`. There is no `supabase` singleton export. Server Action must use the server factory (cookies), never the browser one.

## Approved implementation (Server Action)

```typescript
// src/lib/client-actions.ts
"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ClientStatusState = { error?: string; ok?: boolean };

export async function updateClientStatus(
  _prev: ClientStatusState,
  formData: FormData
): Promise<ClientStatusState> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet — changes can't be saved." };
  }
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || (status !== "active" && status !== "cancelled")) {
    return { error: "Invalid request." };
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You're signed out. Sign in again." };
  // RLS enforces coach_id = auth.uid(); do not add extra checks here.
  const { error } = await supabase.from("clients").update({ status }).eq("id", id);
  if (error) return { error: "Couldn't save. Try again." };
  revalidatePath("/coach/clients");
  return { ok: true };
}
```

`clients-table.tsx`: accept `live: boolean`, render per-row `<form action={...}>` with hidden `id` + `status` (toggle `active`↔`cancelled`), submit button disabled when `!live` or pending, `useActionState(updateClientStatus, {})` for error display. `page.tsx`: pass `live` to table. Fallback preserved: buttons disabled with title "Connect Supabase for live writes" when `!live`.

## Verify
`pnpm exec tsc --noEmit` green. `pnpm build` still 23 routes. Manual: coach → Clients → Deactivate flips badge Active→Inactive (status `cancelled` in table), Activate flips back.

## Still blocked on
Human: paste `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` into `fitnestore-web/.env.local`. Without it writes return the honest error above by design — that IS the correct unconfigured behavior, report it as such, do not treat as failure.
