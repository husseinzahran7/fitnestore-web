import ScheduleBoard from "@/components/schedule-board";
import { mockSchedule } from "@/data/mockSchedule";

export default async function CoachSchedulePage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Schedule</h1>
      <p className="mt-1 text-sm text-slate-400">
        Training sessions and appointments.
      </p>
      <div className="mt-6">
        <ScheduleBoard items={mockSchedule} />
      </div>
    </div>
  );
}
