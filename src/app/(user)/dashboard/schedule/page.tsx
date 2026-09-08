import UserSchedule from "@/components/user-schedule";
import { weeklyWorkouts } from "@/data/mockWorkouts";
import { getUserScheduleWeek } from "@/lib/schedule-queries";
import { getUserAppointments } from "@/lib/schedule";
import { getDict } from "@/lib/i18n";

export default async function UserSchedulePage() {
  const [{ week, live }, { items: appointments }, t] = await Promise.all([
    getUserScheduleWeek(),
    getUserAppointments(),
    getDict(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.nav.schedule}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.pages.yourTrainingWeek}
        {!live && t.pages.previewSchedule}
      </p>
      <div className="mt-6">
        <UserSchedule week={live ? week : weeklyWorkouts} live={live} />
      </div>
      {appointments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Upcoming with your coach</h2>
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
                  Add to calendar
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
