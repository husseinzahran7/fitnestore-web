import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard-shell";
import { getViewer } from "@/lib/supabase/server";
import { homeForRole } from "@/lib/role-home";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.role !== "user") redirect(homeForRole(viewer.role));
  return (
    <DashboardShell role="user" viewer={viewer}>
      {children}
    </DashboardShell>
  );
}
