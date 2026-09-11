import { redirect } from "next/navigation";
import UsersTable from "@/components/users-table";
import { listUsers } from "@/lib/coaches";
import { getViewer } from "@/lib/supabase/server";
import { getDict } from "@/lib/i18n";

export default async function AdminUsersPage() {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "superadmin") {
    redirect("/admin");
  }

  const [users, t] = await Promise.all([listUsers(), getDict()]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.nav.users}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {users.length} {t.admin.usersDesc}
      </p>
      <div className="mt-6">
        <UsersTable users={users} t={t} />
      </div>
    </div>
  );
}
