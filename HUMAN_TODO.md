# HUMAN TODO — actions only you can do

Check off top to bottom. Nothing here needs code changes — Muse already shipped everything else.

## 1. Deploy live link (phone + web)

- [ ] Terminal: `vercel login` (browser SSO, one click).
- [ ] Tell Muse "deploy" — CLI is installed, envs come from `.env.local`, link lands here.
- [ ] Or dashboard path: `vercel.com` → Add New → Import `husseinzahran7/fitnestore-web` → env vars `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (values in `.env.local`) → Deploy.
- [ ] Supabase → Authentication → URL Configuration → Redirect URLs → add `https://<your-app>.vercel.app/auth/callback`.

## 2. Google sign-in (button shows 400 until this is done)

- [ ] Google Cloud Console → APIs & Services → Credentials → Create OAuth client (Web application).
- [ ] Authorized redirect URI: `https://rucibulzpxzunqezlhby.supabase.co/auth/v1/callback` (exact).
- [ ] Supabase → Authentication → Providers → Google → Enable → paste Client ID + Secret → Save.
- [ ] Retest login → Continue with Google. Takes effect instantly, no redeploy.

## 3. Appointments proposal (coach schedule stays mock until approved)

- [ ] Read `fitnestore-hub/docs/PROPOSAL_0004_APPOINTMENTS.md`.
- [ ] Answer the 3 open questions (split tables, session_type text vs enum, client self-booking).
- [ ] Tell Muse "apply 0004" — migration runs, schedule page wires live, verified in browser.

## 4. Real-phone QA (after deploy link exists)

- [ ] Open link on iPhone Safari + Android Chrome. Add to Home Screen, open standalone.
- [ ] Walk user flow (login → schedule → progress → messages → settings) and coach flow (clients → toggle → nutrition → progress → messages).
- [ ] Report visual breaks with phone model + screenshot.

## 5. GitHub hygiene (whenever)

- [ ] `fitnestore-hub/` has pre-existing uncommitted work from before this effort — review + commit separately. Muse never touched it except `supabase/migrations/` parity files + one docs proposal.
- [ ] Rotate Supabase keys if `.env.local` was ever pasted anywhere public (it never left this machine in our sessions).
