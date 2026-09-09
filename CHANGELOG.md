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
- Auth-aware landing header (Open app vs Sign in).
- PWA manifest + icons + SW (webpack-pinned builds).

## Training
- Start-workout mode: set rows (kg/reps/WU), add/remove sets, reorder
  persisted, prefill from last session, history, rest timer with presets.
- Coach client-logs view (every set, newest first).
- Body metrics + performance metrics charts, user weight logging,
  coach metric logging, progress photo upload (signed URLs).

## Nutrition
- Templates (live), template assign-to-client, meal logging, food library
  per-100g (food/supplement/drink), meal ingredients with gram math,
  client check-off + comments, extras logging, water logger, day totals,
  coach day-overview (checks, comments, water per client).

## Discovery
- Approved-only directory (anon-readable), filters + search, profiles with
  bio/specialties/free-text/certs/years/WhatsApp deep-link/free-paid badge.
- Consult request → coach inbox → accept/decline → two-way chat.
- Coach profile editor, admin approval queue (approve/unlist hides directory).

## Scheduling
- Appointments table, coach plan-a-session form, live board with stats,
  Done/Cancel, .ics download (Apple/Google/Outlook), client upcoming block.

## Platform
- Superadmin (owner) role: Admin → Users page — set roles, disable/enable
  accounts; suspended users bounce to /suspended and can't log in or mutate.
- Arabic foundation: RTL shell, Cairo font, locale cookie toggle, nav + auth
  dictionary, user-portal page chrome translated.
- Perf: cached viewer per request, loading skeletons, targeted revalidation.
- Lint zero errors. Mobile 390px clean on all verified pages.
- Knowledge graph: `graphify-out/` (gitignored) auto-rebuilt by post-commit hook.
