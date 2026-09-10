import ScheduleBoard from "@/components/schedule-board";
import AppointmentForm from "@/components/appointment-form";
import { mockSchedule, type ScheduleItem } from "@/data/mockSchedule";
import {
  getCoachAppointments,
  updateAppointmentStatus,
} from "@/lib/schedule";
import { getCoachClients } from "@/lib/nutrition-queries";

export default async function CoachSchedulePage() {
  const [{ items, live }, clients] = await Promise.all([
    getCoachAppointments(),
    getCoachClients(),
  ]);

  const boardItems: ScheduleItem[] = live
    ? items.map((a) => ({
        id: a.id,
        clientName: a.clientName,
        clientId: a.clientId,
        date: a.date,
        startTime: a.startTime,
        endTime: a.endTime,
        sessionType: a.sessionType,
        status: a.status,
        notes: a.notes,
      }))
    : mockSchedule;

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Schedule</h1>
      <p className="mt-1 text-sm text-slate-400">
        Training sessions and appointments.
        {!live && " • preview data (schedule a session to go live)"}
      </p>
      <div className="mt-6">
        <ScheduleBoard
          items={boardItems}
          icsBase={live ? "/api/appointments" : undefined}
          onStatus={live ? updateAppointmentStatus : undefined}
        />
      </div>
      {clients.length > 0 && <AppointmentForm clients={clients} />}
    </div>
  );
}
