import ApprovalQueue from "@/components/approval-queue";
import { listCoachesForAdmin } from "@/lib/coaches";
import { getDict } from "@/lib/i18n";

export default async function AdminCoachesPage() {
  const [coaches, t] = await Promise.all([listCoachesForAdmin(), getDict()]);
  const pending = coaches.filter((c) => !c.approved).length;

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.nav.coaches}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {coaches.length} {t.admin.coachListings} • {pending} {t.admin.pendingCount}. {t.admin.approvedNote}
      </p>
      <div className="mt-6">
        <ApprovalQueue coaches={coaches} t={t} />
      </div>
    </div>
  );
}
