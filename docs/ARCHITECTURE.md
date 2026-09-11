# Architecture

Next.js 16 App Router. Server Components read, Server Actions write.
No API routes except `/api/notifications` (header bell: itemized per
role, polled + Realtime-subscribed) and
`/api/appointments/[id]/ics` (calendar files).

## Layers

- `app/(user|coach|admin)/` — route groups + role layouts. Layouts call
  `getViewer()` (cached per request) and bounce wrong roles.
- `app/coaches`, `app/login`, `app/register`, landing, public pages — no role needed.
- `lib/*-queries.ts` — reads, mock fallback when unconfigured.
- `lib/*-actions.ts`, `app/login/actions.ts` — writes, honest error strings.
- `components/*` — client UI. Shared: `message-thread`, `dashboard-shell`.
- `proxy.ts` — session refresh, signed-out → login?next=, authed guest-only → /.

## Data rules

- Every live read falls back to mocks when Supabase is unconfigured.
- Every write returns `{ error }` strings, never throws to the UI.
- RLS is the real gate; app-level checks only produce honest errors.
- `revalidatePath` targets the mutated route, never the whole tree
  (auth changes excepted).
- No `updated_at` on clients; no `email` on profiles (identity in auth.users).
- `"use server"` files export async functions only (consts live in sibling files).
