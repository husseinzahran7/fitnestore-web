import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard-shell";
import { getViewer } from "@/lib/supabase/server";
import { getDict, getLocale } from "@/lib/i18n";
import { homeForRole } from "@/lib/role-home";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.role !== "admin") redirect(homeForRole(viewer.role));
  const [t, locale] = await Promise.all([getDict(), getLocale()]);
  return (
    <DashboardShell role="admin" viewer={viewer} t={t} locale={locale}>
      {children}
    </DashboardShell>
  );
}
