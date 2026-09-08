# GYMers — Ready for Workflow Testing

Verified live 2026-09-08 via Playwright against local dev + Supabase project
`rucibulzpxzunqezlhby`. Build green, zero console errors on every page,
no horizontal scroll at 390px (home, progress, messages).

## Run it

```bash
cd fitnestore-web
cp .env.example .env.local   # fill NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
pnpm install
pnpm dev --webpack           # dev script already pins --webpack; Turbopack crashes on the PWA config
```

## Test accounts (password `Test1234!`)

| Email | Role | Proves |
|---|---|---|
| `gymers.test.user@gmail.com` | user | dashboard, schedule, progress, messages, settings |
| `gymers.test.coach@gmail.com` | coach | roster + toggle, templates, progress, messages |
| `gymers.test.admin@gmail.com` | admin | policies, settings |

## Live vs mock matrix

| Surface | State |
|---|---|
| Auth + role routing + guards | LIVE (all 3 roles, signed-out → login?next, cross-role bounce) |
| Coach clients list + activate/deactivate | LIVE, persisted both ways |
| User schedule | LIVE (seeded session) |
| Nutrition templates | LIVE (2 seeded rows, honest usage counts) |
| Messages list + send | LIVE (round-trip persisted) |
| User progress weight/strength/measure | LIVE (seeded 4 weeks) |
| Weight logging | LIVE (writes body_metrics as owner) |
| Settings name ×3 roles | LIVE (persisted) |
| Admin policies + public policy pages | LIVE (3 seeded rows, anon-readable) |
| Coach schedule appointments | MOCK — proposal at `fitnestore-hub/docs/PROPOSAL_0004_APPOINTMENTS.md`, tables not applied yet |
| Coach discovery (browse, profiles, WhatsApp, consult request + accept) | LIVE (approved-only directory, anon-readable) |
| Client meal plans | MOCK — meals rows lack dates/status/adherence columns |
| Check-ins | EMPTY — no backend table; board renders honestly empty |
| Progress photos | LIVE (upload JPEG/PNG/WebP ≤5MB, private bucket + signed URLs) |

## Schema notes (deviations from locked 0001 found by testing)

- Fresh-DB apply order is tables → function → policies (SQL function bodies
  validate at creation). Hub folder mirrors prod: `0001` (note added),
  `0002_init_policies.sql`, `0003_profiles_self_insert.sql`,
  `0004_profiles_self_update.sql`, `0005_body_metrics_owner_insert.sql`.
- 0003–0005 close real gaps the app code already assumed: first-login
  profile insert, self name update, owner weight logging. Without them the
  UI reports success while RLS drops the write.

## Human tasks left

1. Deploy preview (Vercel: import repo, set the two `NEXT_PUBLIC_` env vars,
   `pnpm build --webpack` is already the build command).
2. Real-phone QA: Add to Home Screen, standalone open, touch targets,
   safe-area on the three 390px-verified pages and the rest.
3. Approve/reject `PROPOSAL_0004_APPOINTMENTS.md` (3 open questions inside).
4. `fitnestore-hub/` has pre-existing uncommitted work (predates this
   effort) — review + commit separately. `fitnestore-web/` is not a git repo;
   init + first commit when ready.
