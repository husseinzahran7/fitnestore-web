import { redirect } from "next/navigation";
import SettingsForm from "@/components/settings-form";
import { getViewer } from "@/lib/supabase/server";

export default async function CoachSettingsPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-slate-400">Your coach profile.</p>
      <div className="mt-6">
        <SettingsForm viewer={viewer} />
      </div>
    </div>
  );
}
