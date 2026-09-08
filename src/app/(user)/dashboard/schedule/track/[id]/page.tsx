import Link from "next/link";
import TrackSession from "@/components/track-session";
import { getTrackSession } from "@/lib/tracking";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { title, exercises, history, live } = await getTrackSession(id);

  if (!live) {
    return (
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Track workout</h1>
        <p className="mt-2 text-sm text-slate-400">
          Session not found.{" "}
          <Link href="/dashboard/schedule" className="font-semibold text-brand-400">
            Back to schedule
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
        ← Schedule
      </Link>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-slate-400">
        Log every set. Values prefill from your last session.
      </p>
      <div className="mt-6">
        <TrackSession
          sessionId={id}
          title={title}
          exercises={exercises}
          history={history}
        />
      </div>
    </div>
  );
}
