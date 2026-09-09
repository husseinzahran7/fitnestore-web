# Roles & Permissions

| Capability | user | coach | admin | superadmin |
|---|---|---|---|---|
| Own dashboard, schedule, nutrition, progress, messages, settings | ✓ | – | – | – |
| Track workouts, log weight/photos/check-ins/meals/water | ✓ | – | – | – |
| Browse coaches, request consult, WhatsApp | ✓ | – | – | – |
| Roster, toggle status, client logs | – | own clients | – | all |
| Plan sessions, nutrition, meals, food library | – | own | – | all |
| Client progress + metrics logging | – | own clients | – | all |
| Own public coach profile | – | ✓ | – | – |
| Accept/decline consults, reply in threads | – | ✓ | – | – |
| Approve/unlist coaches, edit policies | – | – | ✓ | ✓ |
| Manage users: set roles, disable/enable accounts | – | – | – | ✓ |
| Everything admin can do | – | – | ✓ | ✓ |

## Notes

- `superadmin` is you (the owner). First one is set via SQL; afterwards
  managed in Admin → Users. Admins cannot touch superadmins.
- Disabled accounts are signed out everywhere and see `/suspended`.
- Coaches appear in the public directory only when `approved = true`.
- `private.is_admin()` is true for admin AND superadmin; RLS keeps working
  with zero policy rewrites. `private.is_superadmin()` gates user management.
