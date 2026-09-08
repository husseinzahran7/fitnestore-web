import UserProgress from "@/components/user-progress";
import CheckinSection from "@/components/checkin-section";
import {
  userBodyMeasurements,
  userProgressPhotos,
  userStrengthProgress,
  userWeightProgress,
} from "@/data/userProgress";
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
        {!live && t.pages.previewProgress}
      </p>
      <div className="mt-6">
        <UserProgress
          weight={live ? data.weight : userWeightProgress}
          strength={live ? data.strength : userStrengthProgress}
          measurements={live ? data.measurements : userBodyMeasurements}
          photos={live ? data.photos : userProgressPhotos}
          photosLive={data.photosLive}
          live={live}
        />
        {live && <CheckinSection checkins={checkins} />}
      </div>
    </div>
  );
}
