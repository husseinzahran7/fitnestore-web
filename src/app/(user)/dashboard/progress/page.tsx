import UserProgress from "@/components/user-progress";
import {
  userBodyMeasurements,
  userProgressPhotos,
  userStrengthProgress,
  userWeightProgress,
} from "@/data/userProgress";
import { getUserProgress } from "@/lib/progress-queries";

export default async function UserProgressPage() {
  const { data, live } = await getUserProgress();

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Progress</h1>
      <p className="mt-1 text-sm text-slate-400">
        Your fitness journey.
        {!live && " • preview data (log metrics with your coach for live charts)"}
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
      </div>
    </div>
  );
}
