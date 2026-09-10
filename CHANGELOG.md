# CHANGELOG — GYMers (fitnestore-web)

Every entry verified in browser + `tsc` + `pnpm build` before commit.
Live = backed by Supabase. Mock = hardcoded fallback when unconfigured.

## Foundation
- Next.js 16 App Router, SSR Supabase clients, proxy gates, role routing
  (user → /dashboard, coach → /coach, admin → /admin), guards + ?next= return.
- 18-table schema with owner/coach/admin RLS, TO-clauses, Data API grants,
  storage buckets (progress_photos private, avatars public).
- Email + Google OAuth (button + callback; provider switch is human dashboard job).
- Demo accounts panel on login with one-tap fill.
- Demo panel gated behind NEXT_PUBLIC_SHOW_DEMO_LOGINS (production
  login never advertises test accounts).
- Booking page copy matches live backend (was pre-backend wording).
- Auth-aware landing header (Open app vs Sign in).
- PWA manifest + icons + SW (webpack-pinned builds).
- Removed dead setAppointmentStatus (zero callers; board uses updateAppointmentStatus).
- Supabase client accepts publishable key (was anon-only fallback).
- Admin link tables fall back to role words (was UUID shards).
- Public /coaches no longer trips coach guard (segment-boundary match).
- Fixed doubled title suffix on subscriptions + coach profile.

## Training
- Start-workout mode: set rows (kg/reps/WU), add/remove sets, reorder
  persisted, prefill from last session, history, rest timer with presets.
- Week badge shows Done once today log exists (was always time).
- Bad numbers return honest form error (was uncaught throw).
- Coach client-logs view (every set, newest first).
- Coach home recent list shows client names (was UUID shards).
- Roster hides blank email line on live rows (no email column by design).
- Body metrics + performance metrics charts, user weight logging,
  coach metric logging, progress photo upload (signed URLs).
- Removed unused history setCount (UI shows date + logged state only).

## Nutrition
- Templates (live), template assign-to-client, meal logging, food library
  per-100g (food/supplement/drink), meal ingredients with gram math,
  client check-off + comments, extras logging, water logger, day totals,
  coach day-overview (checks, comments, water per client).
- Client plans board (live): assigned plans read from real columns
  (title/created_at + meals.client_id linkage + meal_checks adherence).
  No fabricated end dates — ongoing plans show Since date + meal count;
  zero-meal plans show draft/Unassigned. Mock fallback only when zero
  assigned plans exist.

## Discovery
- Approved-only directory (anon-readable), filters + search, profiles with
  bio/specialties/free-text/certs/years/WhatsApp deep-link/free-paid badge.
- Consult request → coach inbox → accept/decline → two-way chat.
- Thread headers resolve other side via conversation_participants
  (silent-side threads no longer show self).
- Pending threads resolve counterpart via consult_requests; orphan
  threads show role word (never self).
- Retried consult accept survives already-member join (23505).
- Chat send revalidates both inboxes (fresh threads on reload).
- Coach profile editor, admin approval queue (approve/unlist hides directory).

## Scheduling
- Appointments table, coach plan-a-session form, live board with stats,
  Done/Cancel, .ics download (Apple/Google/Outlook), client upcoming block.
- Coach board threads real client ids (Active-clients stat true).

## Platform
- Superadmin (owner) role: Admin → Users page — set roles, disable/enable
  accounts; suspended users bounce to /suspended and can't log in or mutate.
- Superadmin login lands /admin directly (was /dashboard bounce).
- OAuth callback + bell home route superadmin to /admin (matched login).
- Owner portal profile icon uses shield (matched admin).
- Admin home backend badge reflects real connection (was hardcoded Live).
- Coach roster shows real join dates (was blank).
- Arabic foundation: RTL shell, Cairo font, locale cookie toggle, nav + auth
  dictionary, user-portal page chrome translated.
- Perf: cached viewer per request, loading skeletons, targeted revalidation.
- Lint zero errors. Mobile 390px clean on all verified pages.
- Knowledge graph: `graphify-out/` (gitignored) auto-rebuilt by post-commit hook.
