import ProgressBoard from "@/components/progress-board";
import { getCoachProgress } from "@/lib/progress-queries";
import { getDict } from "@/lib/i18n";

export default async function CoachProgressPage() {
  // Check-ins read live from check_ins; clients without any show
  // real metrics with an honestly empty check-in list.
  const [{ clients, live }, t] = await Promise.all([getCoachProgress(), getDict()]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.coach.progressTitle}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.coach.progressDesc}
      </p>
      <div className="mt-6">
        <ProgressBoard clients={clients} live={live} t={t} />
      </div>
    </div>
  );
}
