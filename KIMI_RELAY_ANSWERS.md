# KIMI RELAY ANSWERS — forward verbatim to Kimi 2.6

## A1. Bookings table name
None. Locked `0001_init.sql` has NO `bookings`, NO `schedule_events`. Tables only: `profiles`, `clients`, `conversations`, `conversation_participants`, `messages`, `body_metrics`, `performance_metrics`, `workout_plans`, `workout_sessions`, `exercises`, `nutrition_plans`, `meals`, `content_items`, `site_policies` + storage bucket `progress_photos`. Booking persistence needs a NEW migration proposal. Do not invent one this turn.

## A2. Booking UI state
`src/app/booking/page.tsx` is static: 3 info cards + CTA link to `/register`. No form, no `BookingForm.tsx`, no `use-booking.ts`, no `api/booking/route.ts`, no `BookingConfirmation.tsx`. Your 5-file plan references files that do not exist. Do not create them. Booking stays honest-demo by design (MVP cycle 4). Pick a different next task below.

## A3. Locked schema content
Full file: `fitnestore-hub/supabase/migrations/0001_init.sql` (~400 lines, human forwards file directly if you need verbatim). Key rules you must obey: `gen_random_uuid()` (no extensions), `private.is_admin()` with `SET search_path = public`, every policy has `TO authenticated` (or `TO anon, authenticated` for `site_policies` select only), `USING` + `WITH CHECK` pairs on writes, Data API grants + default privileges, storage policies on `progress_photos` (owner `<uid>/…`, coach-read-own-clients, admin-read). `profiles(id, role[user|coach|admin], name, membership)` — no email column. `clients.status` in `(active, pending, cancelled)`.

## Directive — approved next tasks (pick ONE, ≤5 files / ≤300 lines, no new deps, frozen files untouched)
1. Coach clients activate/deactivate mutations against live `clients.status` (clients page already attempts live read; add write + fallback).
2. Schedule/nutrition live queries (read `workout_sessions` / `nutrition_plans` + `meals`, fallback to `src/data/mock*` when unconfigured).
3. Nothing touching `src/lib/supabase/*`, `src/proxy.ts`, `next.config.ts`, `src/components/ui/*`, no `/test` route, no `pnpm add`.

## Blocker status
Your READY=NO on schema is resolved by A3 (rules + table list). Full verbatim SQL follows only if human pastes the file. Human still must paste `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` into `fitnestore-web/.env.local` before any live verification. Until then: code against fallback-safe reads (`getViewer()` returns null unconfigured, pages render mocks), verify with `pnpm build`, report route count.
