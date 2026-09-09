export type Role = "user" | "coach" | "admin" | "superadmin";

export function homeForRole(role: Role): string {
  if (role === "coach") return "/coach";
  if (role === "admin" || role === "superadmin") return "/admin";
  return "/dashboard";
}
