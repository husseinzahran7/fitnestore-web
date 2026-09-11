# Schema Index

Canonical schema lives in Supabase project `rucibulzpxzunqezlhby`,
applied in order. (`fitnestore-hub/` retired — do not reference it.)
TODO: export canonical migrations into `supabase/migrations/` in this repo.
`0001` order note: create tables before `private.is_admin()`.

| # | File | Adds |
|---|---|---|
| 0001 | `0001_init.sql` | profiles, clients, conversations + junction, messages, metrics ×2, plans/sessions/exercises, nutrition/meals, content, site_policies, storage `progress_photos` |
| 0002 | `0002_init_policies.sql` | `is_admin()`, all RLS, grants, photo policies |
| 0003 | `0003_profiles_self_insert.sql` | first-login provisioning |
| 0004 | `0004_profiles_self_update.sql` | display-name edit |
| 0005 | `0005_body_metrics_owner_insert.sql` | user weight logging |
| 0006 | `0006_tracking_coach_profiles.sql` | workout_logs, set_logs, exercises.position, coach_profiles |
| 0007 | `0007_exercises_owner_reorder.sql` | drag-drop order writes |
| 0008→0013 | consult flow | `consult_requests` + request/accept (see files; 0008–0012 document two dead ends: RETURNING needs SELECT, no policy cycles) |
| 0014–0015 | avatars | public bucket + `coach_profiles.avatar_path` |
| 0016 | `0016_food_library.sql` | food_items, meal_ingredients, meal_checks, water_logs |
| 0017 | `0017_appointments.sql` | dated appointments + .ics |
| 0018 | `0018_check_ins.sql` | weekly check-ins |
| 0019 | `0019_food_logs_drink.sql` | client extras + drink kind |
| 0020 | `0020_superadmin.sql` | superadmin role, `is_superadmin()`, `profiles.disabled` |

Hard lessons (do not regress): SQL function bodies validate at creation;
INSERT…RETURNING needs a SELECT policy; no policy may reference its own
table (planner rejects the cycle); PostgREST returns success on zero-row
RLS-filtered updates — verify writes by reading back.
