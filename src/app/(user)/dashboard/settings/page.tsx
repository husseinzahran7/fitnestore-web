import { redirect } from "next/navigation";
import SettingsForm from "@/components/settings-form";
import { getViewer } from "@/lib/supabase/server";
import { getDict } from "@/lib/i18n";

export default async function UserSettingsPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  const t = await getDict();
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.nav.settings}</h1>
      <p className="mt-1 text-sm text-slate-400">{t.pages.yourProfile}</p>
      <div className="mt-6">
        <SettingsForm viewer={viewer} t={t} />
      </div>
    </div>
  );
}
