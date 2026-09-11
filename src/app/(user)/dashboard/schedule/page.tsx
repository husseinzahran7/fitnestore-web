import UserSchedule from "@/components/user-schedule";
import SubLock from "@/components/sub-lock";
import { getUserScheduleWeek } from "@/lib/schedule-queries";
import { getUserAppointments } from "@/lib/schedule";
import { getMyAppSub, getMyLinks } from "@/lib/subscriptions";
import { linkLive } from "@/lib/subscription-status";
import { getDict, getLocale } from "@/lib/i18n";

export default async function UserSchedulePage() {
  const [{ week, live }, { items: appointments }, links, appSub, t, locale] = await Promise.all([
    getUserScheduleWeek(),
    getUserAppointments(),
    getMyLinks(),
    getMyAppSub(),
    getDict(),
    getLocale(),
  ]);

  const liveLink = links.find((l) => linkLive(l)) ?? null;
  const unstarted = links.find((l) => l.status === "active" && !l.starts_at) ?? null;
  const pendingInvite = links.find((l) => l.status === "pending") ?? null;
  const hadCoach = links.some((l) => !!l.starts_at);
  // NOTE: no `live` check — RLS hides expired rows, so hidden data must lock, not preview.
  const locked = hadCoach && !liveLink && !appSub;

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.nav.schedule}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.pages.yourTrainingWeek}
        {liveLink?.ends_at && (
          <span className="ms-2 rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-bold text-green-400">
            {t.subs.activeUntil} {new Date(liveLink.ends_at).toLocaleDateString(locale)}
          </span>
        )}
        {!live && !locked && ` ${t.subs.soloNote}`}
      </p>
      {unstarted && (
        <p className="mt-2 text-xs text-slate-500">
          {t.subs.startsOnSend} ({unstarted.weeks} {t.subs.weeks})
        </p>
      )}
      {pendingInvite && (
        <p className="mt-2 rounded-xl border border-brand-500/30 bg-brand-500/[0.07] px-4 py-2.5 text-xs text-slate-300">
          {t.home.linkReqFrom} {pendingInvite.coach_name ?? t.home.yourCoachWord} — {t.home.activatesAfter}
        </p>
      )}
      <div className="mt-6">
        {locked ? (
          <SubLock
            title={t.subs.lockedTitle}
            body={t.subs.lockedBody}
            renewLabel={t.subs.renewCoach}
            appLabel={t.subs.unlockApp}
            soloNote={t.subs.soloNote}
          />
        ) : (
          <UserSchedule week={week} live={live} t={t} />
        )}
      </div>
      {!locked && appointments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">{t.home.upWithCoach}</h2>
          <ul className="mt-3 space-y-3">
            {appointments.map((a) => (
              <li
                key={a.id}
                className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-semibold">
                    {a.sessionType} • {a.coachName}
                  </div>
                  <div className="text-sm text-slate-400">
                    {a.date} • {a.startTime} – {a.endTime}
                  </div>
                </div>
                <a
                  href={`/api/appointments/${a.id}/ics`}
                  className="w-fit rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/20"
                >
                  {t.common.addToCalendar}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
