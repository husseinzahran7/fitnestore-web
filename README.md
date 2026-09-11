# GYMers

Coaching platform for gym coaches and their clients. Clients train solo for free or subscribe with a coach (training + nutrition + messaging + progress). Coaches run roster, sessions, nutrition, progress from one screen. Admins approve coaches, manage policies and subscriptions.

## Run it

```bash
cp .env.example .env.local   # fill values below
pnpm install
pnpm dev                     # --webpack pinned; Turbopack crashes on PWA config
```

Open http://localhost:3000. Stop with `Ctrl+C`. Port busy? `Get-Process node | Stop-Process`.

## Env

| Var | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | e.g. `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API | `sb_publishable_...` (anon key also accepted) |
| `NEXT_PUBLIC_SHOW_DEMO_LOGINS` | local only | `true` shows Fill buttons on `/login`. Never set in production. |

Missing env → pages fall back to preview mocks where available, mutations return honest errors.

## Test accounts (password `Test1234!`)

Fill buttons appear on `/login` when `NEXT_PUBLIC_SHOW_DEMO_LOGINS=true`.

| Email | Role | Proves |
|---|---|---|
| `gymers.test.user@gmail.com` | user | dashboard, schedule + tracking, nutrition, progress, messages, settings |
| `gymers.test.coach@gmail.com` | coach | roster + toggle + logs, schedule, nutrition, progress, profile, inbox |
| `gymers.test.admin@gmail.com` | admin | coach approvals, policies, settings |

## Routes by role

- Public: `/`, `/coaches`, `/coaches/[id]`, `/pricing`, `/booking`, `/login`, `/register`
- User → `/dashboard` (schedule, nutrition, progress, messages, settings)
- Coach → `/coach` (clients, schedule, nutrition, progress, messages, profile, settings)
- Admin → `/admin` (coaches queue, subscriptions, policies, users for superadmin, settings)

Wrong role bounces to its home. Signed-out users hitting guarded pages go to `/login?next=...`. Disabled accounts see `/suspended`.

## Docs

- `READY.md` — run + live-vs-mock matrix + test accounts
- `HUMAN_TODO.md` — deploy, Google OAuth, phone QA checklist
- `CHANGELOG.md` — what shipped, by area
- `docs/ARCHITECTURE.md`, `docs/FLOWS.md`, `docs/ROLES.md`, `docs/SCHEMA.md`

## Deploy

Vercel import → set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → Deploy. Then Supabase → Authentication → URL Configuration → Redirect URLs → add `https://<your-app>.vercel.app/auth/callback`. Google sign-in additionally needs OAuth Client ID + Secret in Supabase → Providers → Google (see `HUMAN_TODO.md`).

## Scripts

- `pnpm dev` — local dev (webpack)
- `pnpm build` — production build (webpack)
- `pnpm start` — serve production build
- `pnpm lint` — eslint
