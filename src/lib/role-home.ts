export type Role = "user" | "coach" | "admin";

export function homeForRole(role: Role): string {
  if (role === "coach") return "/coach";
  if (role === "admin") return "/admin";
  return "/dashboard";
}
