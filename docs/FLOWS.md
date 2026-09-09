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
