# KIMI 2.6 HANDOVER CORRECTION — read before writing code

Purpose: your last Supabase setup reply targets a greenfield Vite app. Reality is Next.js `fitnestore-web/`, MVP code COMPLETE (23 routes, build green). Do not run your SQL. Do not create your client files. Corrections below are locked.

## 1. Source of truth

- App: `fitnestore-web/` (Next.js 16.3.4, React 19, pnpm 11, `build: next build --webpack` — Turbopack breaks PWA plugin, dev stays Turbopack).
- Old Vite `fitnestore-hub/` is legacy. Canonical DB migration lives at `fitnestore-hub/supabase/migrations/0001_init.sql`. Copy it verbatim, never rewrite.
- Deps already installed (do NOT `pnpm add`): `@supabase/ssr ^0.12.6`, `@supabase/supabase-js ^2.115.0`, `@ducanh2912/next-pwa`, `recharts`, `date-fns`, `framer-motion`.
- Env example: `fitnestore-web/.env.example`. Canonical vars:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://rucibulzpxzunqezlhby.supabase.co
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=paste-key-here
  ```
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` works only as legacy fallback. Human copies `.env.example` to `.env.local` (never commit). File is `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts` read `KEY` = PUBLISHABLE with ANON fallback.

## 2. What you got right

- Human must paste key + run migration in Supabase SQL Editor (you have no machine access — correct).
- Seed users via app signup first, then role update — correct flow.
- RLS on, profiles extends `auth.users` — correct direction.

## 3. What is wrong — do not ship

### 3a. SQL does not match locked schema
Your tables (`coaches`, `workout_days`, `workout_logs`, `food_items`, `food_logs`, `schedule_events`, macro-column `nutrition_plans`) do not exist. Locked tables: `profiles(id, role, name, membership)`, `clients(profile_id, coach_id, plan, status, goals, progress, subscription, subscription_end)`, `conversations` + `conversation_participants` + `messages`, `body_metrics` + `performance_metrics` (split), `workout_plans(title, tags, is_template)`, `workout_sessions`, `exercises(session_id, sets, reps, weight text)`, `nutrition_plans(title, tags, is_template)`, `meals`, `content_items`, `site_policies`, storage bucket `progress_photos`.
Other deltas: real uses `gen_random_uuid()` (no `uuid-ossp` extension). Status check is `active/pending/cancelled` (no `inactive`). No `email` column in `profiles` (identity lives in `auth.users`, name/email resolved via `getViewer`).

### 3b. RLS violates skill rules
Locked file uses: `TO authenticated` / `TO anon, authenticated` on every policy, `USING` + `WITH CHECK` pairs, `private.is_admin()` with `SET search_path = public`, Data API grants, storage policies (owner path `<uid>/…`, coach-read-own-clients, admin-read). Your reply: no `TO` clause, missing `WITH CHECK` on inserts/updates, `SECURITY DEFINER` trigger without locked `search_path`, no grants, no storage policies, 60%+ tables left with zero policy (all queries fail). Your `handle_new_user()` inserts nonexistent `email` column and will error.

### 3c. Seed SQL broken
`on conflict do nothing` without conflict target is a syntax error. `cross join` duplicates rows. References `public.coaches` table that does not exist. Correct seed: sign up 3 users in app (`user@`, `coach@`, `admin@example.com`), then update `profiles.role`, insert `clients` row joining `profiles` only.

### 3d. Client code wrong for App Router
Do NOT create `src/lib/supabase.ts` with `createClient` from `@supabase/supabase-js` singleton. Real wiring (already built):
- `src/lib/supabase/client.ts` → `createBrowserClient(url, key)`
- `src/lib/supabase/server.ts` → `createServerClient(url, key, cookies)` + `getViewer()` (reads `profiles.role/name/membership`, defaults role `user`)
- `src/lib/supabase/middleware.ts` → `updateSession()` (lets through when unconfigured, redirects `/dashboard|/coach|/admin` to `/login?next=`, redirects authed `/login|/register` to `/`)
- `src/proxy.ts` → calls `updateSession`, matcher excludes static/icons.
Your `testConnection()` with `.select('count').single()` is invalid. Your `src/app/test/page.tsx` adds debt — verification is `pnpm build` (23 routes) + live login, not a `/test` route.

## 4. Already done — do not redo

MVP cycles 1–4 shipped and `pnpm build` green: landing, auth pages, 3 portals + all subpages (schedule, progress, messages via shared `components/message-thread.tsx`, settings ×3 via `settings-actions.ts`), public pricing/booking/privacy/terms/cookies, `manifest.ts` + icons, SW via `@ducanh2912/next-pwa` (gitignored `sw.js`/`workbox-*`).

## 5. Actual remaining work

1. Human: fill `.env.local`, run `0001_init.sql` once in SQL Editor, sign up 3 users, set roles.
2. Kimi allowed next (pick one, ≤5 files / ≤300 lines per turn, no new deps): booking persistence (currently honest demo → register), mutations activate/deactivate, schedule/nutrition live queries (clients page already attempts live), deploy preview + phone QA notes.
3. Frozen unless both agree: `src/lib/supabase/*`, `src/proxy.ts`, `vite.config` equivalent `next.config.ts`, `src/components/ui/*`.

## 6. Reply template (return exactly this)

```md
# KIMI_ACK
## 1. Corrections accepted (list 3a–3d in your words, 1 line each)
## 2. Files I will touch next turn (max 5, none frozen)
## 3. Diff plan (what + how verified: pnpm build route count)
## 4. Questions (max 3)
## 5. Ready (yes/no + blocker)
```
