import UserSchedule from "@/components/user-schedule";
import { weeklyWorkouts } from "@/data/mockWorkouts";
import { getUserScheduleWeek } from "@/lib/schedule-queries";

export default async function UserSchedulePage() {
  const { week, live } = await getUserScheduleWeek();

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Schedule</h1>
      <p className="mt-1 text-sm text-slate-400">
        Your training week.
        {!live && " • preview data (connect Supabase for live schedule)"}
      </p>
      <div className="mt-6">
        <UserSchedule week={live ? week : weeklyWorkouts} live={live} />
      </div>
    </div>
  );
}
