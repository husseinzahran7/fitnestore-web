import UserProgress from "@/components/user-progress";
import CheckinSection from "@/components/checkin-section";
import { getUserProgress, getUserCheckins } from "@/lib/progress-queries";
import { getDict } from "@/lib/i18n";

export default async function UserProgressPage() {
  const [{ data, live }, checkins, t] = await Promise.all([
    getUserProgress(),
    getUserCheckins(),
    getDict(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.nav.progress}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.pages.yourFitnessJourney}
      </p>
      <div className="mt-6">
        <UserProgress
          weight={data.weight}
          strength={data.strength}
          measurements={data.measurements}
          photos={data.photos}
          photosLive={data.photosLive}
          live={live}
          t={t}
        />
        {live && <CheckinSection checkins={checkins} t={t} />}
      </div>
    </div>
  );
}
