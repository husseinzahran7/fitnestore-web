import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard-shell";
import { getViewer } from "@/lib/supabase/server";
import { getDict, getLocale } from "@/lib/i18n";
import { homeForRole } from "@/lib/role-home";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.disabled) redirect("/suspended");
  if (viewer.role !== "user") redirect(homeForRole(viewer.role));
  const [t, locale] = await Promise.all([getDict(), getLocale()]);
  return (
    <DashboardShell role="user" viewer={viewer} t={t} locale={locale}>
      {children}
    </DashboardShell>
  );
}
