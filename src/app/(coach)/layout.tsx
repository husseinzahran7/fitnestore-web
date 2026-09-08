import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard-shell";
import { getViewer } from "@/lib/supabase/server";
import { getDict, getLocale } from "@/lib/i18n";
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
  const [t, locale] = await Promise.all([getDict(), getLocale()]);
  return (
    <DashboardShell role="coach" viewer={viewer} t={t} locale={locale}>
      {children}
    </DashboardShell>
  );
}
