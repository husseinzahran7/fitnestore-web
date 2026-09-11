import Link from "next/link";
import TrackSession from "@/components/track-session";
import { getTrackSession } from "@/lib/tracking";
import { getDict } from "@/lib/i18n";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ title, exercises, history, live }, t] = await Promise.all([getTrackSession(id), getDict()]);

  if (!live) {
    return (
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t.track.trackTitle}</h1>
        <p className="mt-2 text-sm text-slate-400">
          {t.track.notFound}{" "}
          <Link href="/dashboard/schedule" className="font-semibold text-brand-400">
            {t.track.backSchedule}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/dashboard/schedule"
        className="text-sm font-semibold text-slate-400 hover:text-white"
      >
        <span aria-hidden className="rtl:-scale-x-100">←</span> {t.track.backSchedule}
      </Link>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.track.logEvery}
      </p>
      <div className="mt-6">
        <TrackSession
          sessionId={id}
          title={title}
          exercises={exercises}
          history={history}
          t={t}
        />
      </div>
    </div>
  );
}
