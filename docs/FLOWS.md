# User Flows (tested end to end in browser)

## Client
Register → confirm → login → /dashboard → schedule (Start → log sets,
reorder, rest timer, finish → history + prefill next time) → nutrition
(meals, check + comment, extras, water) → progress (charts, weight log,
photos, check-in) → messages (chat) → settings (rename persists).

## Coach
Register → admin sees listing (after profile created) → approves → directory
shows coach → user requests consult → inbox → accept → two-way chat →
clients roster → toggle status, per-client logs → plan sessions (.ics) →
nutrition templates, assign, meals, food library → log metrics →
progress board → own profile editor → settings.

## Admin
Login → /admin → coaches queue (approve/unlist) → policies (live edit
in Supabase) → settings. Superadmin additionally: Admin → Users —
roles, disable/enable.

## Coach discovery (signed out)
Landing → Find a coach → filter/search → profile (WhatsApp deep-link,
free/paid badge) → sign in → request → messages.

## Booking (/booking)
Live coach list (approved only) → per-coach Request free/paid button →
`/coaches/[id]` consult form → creates conversation + first message →
coach inbox → accept → two-way chat. Booking IS the consult request;
no separate slot table. Signed-out visitors are asked to sign in first.

## Subscriptions (offline provider — launch decision)
Pay provider = manual offline (cash / transfer, agreed outside the app).
Admin activates by user ID + weeks in Admin → Subscriptions; `payment_ref`
stores the reference and is the future Stripe/Paymob extension point.
Clock starts on first coach send (`starts_at` NULL until then).
Auto-expire: pg_cron `expire-links-daily` 03:00 UTC sweeps both
`coach_links` and `app_subs` (verified succeeding in
`cron.job_run_details`); the admin "Expire due now" button is on-demand
only and the page notes the schedule.

## Notifications (bell)
GET `/api/notifications` returns `{ count, href, home, items }` per role:
coach = pending consults, admin = unapproved listings, user = 7-day
appointments + links expiring within 7 days. Bell shows a dropdown list,
polls every 30s, and subscribes over Supabase Realtime to the role's
source tables (polling covers projects without those tables in the
realtime publication). Push (FCM/VAPID) and email are NOT implemented —
human follow-ups after launch.
