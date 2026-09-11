# GYMers — Ready for Workflow Testing

Verified live via Playwright against local dev + Supabase project
`rucibulzpxzunqezlhby`. Build green, lint zero errors, zero console errors
on every page, no horizontal scroll at 390px on all verified pages.

## Run it

```bash
cp .env.example .env.local   # fill NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
pnpm install
pnpm dev                     # --webpack pinned; Turbopack crashes on PWA config
```
Login demo panel needs `NEXT_PUBLIC_SHOW_DEMO_LOGINS=true` (local only).

Stop it: `Ctrl+C`. Port busy? `Get-Process node | Stop-Process`.

## Test accounts (password `Test1234!`, Fill buttons on login page)

| Email | Role | Proves |
|---|---|---|
| `gymers.test.user@gmail.com` | user | dashboard, schedule + tracking, nutrition, progress, messages, settings |
| `gymers.test.coach@gmail.com` | coach | roster + toggle + logs, schedule, nutrition, progress, profile, inbox |
| `gymers.test.admin@gmail.com` | admin | coaches approvals, policies, settings |

## Live vs mock matrix

| Surface | State |
|---|---|
| Auth + role routing + guards + ?next= return | LIVE, all 3 roles |
| Auth-aware landing header (Open app vs Sign in) | LIVE |
| Google OAuth code | LIVE code, provider switch = human dashboard job |
| Coach clients + activate/deactivate + Logs view | LIVE, persisted |
| Start-workout mode (sets, warmup, reorder, prefill, history, rest timer) | LIVE |
| User schedule + coach appointments + .ics + Done/Cancel | LIVE |
| Nutrition templates + assign + meal log + food library + ingredients | LIVE |
| Client meals (totals, check + comment, extras, water) + coach day overview | LIVE |
| Messages + send + consult request/accept/decline inbox | LIVE, two-way proven |
| User progress + weight log + photos + check-ins; coach metrics + board | LIVE |
| Coach discovery (browse, profiles, WhatsApp, free/paid badges) | LIVE, approved-only |
| Coach profile editor + admin approval queue | LIVE |
| Arabic (RTL shell, nav, user pages; toggle everywhere) | LIVE foundation |
| Notifications bell (requests/approvals counts) | LIVE |
| Admin policies + public pages | LIVE, anon-readable |
| Superadmin users (roles, disable/enable, suspend flow) | LIVE |
| Docs (`docs/`: architecture, roles, flows, schema) + CHANGELOG | current |
| Client meal plans board | LIVE (derived: created_at start, meal counts, checks adherence; drafts until first meal logged) |
| Check-ins | LIVE (table 0018, both sides) |

## Schema (Supabase project `rucibulzpxzunqezlhby`, applied in order — see `docs/SCHEMA.md`)

0001 (+order note), 0002 policies, 0003 self-insert, 0004 self-update,
0005 metrics owner-insert, 0006 tracking+coach_profiles, 0007 reorder,
0008→0013 consult flow (recursion lessons inside), 0014–0015 avatars,
0016 food library, 0017 appointments, 0018 check-ins, 0019 food_logs+drink.

## Human tasks left

1. Deploy preview (Vercel import + 2 env vars + redirect URL).
2. Google provider switch (ID/secret + redirect).
3. Real-phone QA + subscription provider decision.

## Docs

- `CHANGELOG.md` — what shipped, by area.
- `HUMAN_TODO.md` — your checklist.
- `graphify-out/` — knowledge graph (gitignored, post-commit hook rebuilds).
