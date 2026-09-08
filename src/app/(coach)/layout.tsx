import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard-shell";
import { getViewer } from "@/lib/supabase/server";
import { homeForRole } from "@/lib/role-home";

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  // Admins may enter coach routes (legacy behavior, kept).
  if (viewer.role !== "coach" && viewer.role !== "admin") {
    redirect(homeForRole(viewer.role));
  }
  return (
    <DashboardShell role="coach" viewer={viewer}>
      {children}
    </DashboardShell>
  );
}
