import { redirect } from "next/navigation";
import UsersTable from "@/components/users-table";
import { listUsers } from "@/lib/coaches";
import { getViewer } from "@/lib/supabase/server";

export default async function AdminUsersPage() {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "superadmin") {
    redirect("/admin");
  }

  const users = await listUsers();

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Users</h1>
      <p className="mt-1 text-sm text-slate-400">
        {users.length} accounts. Set roles, disable or re-enable. Superadmins
        are protected.
      </p>
      <div className="mt-6">
        <UsersTable users={users} />
      </div>
    </div>
  );
}
