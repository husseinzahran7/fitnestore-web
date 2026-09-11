import ScheduleBoard from "@/components/schedule-board";
import AppointmentForm from "@/components/appointment-form";
import type { ScheduleItem } from "@/data/mockSchedule";
import {
  getCoachAppointments,
  updateAppointmentStatus,
} from "@/lib/schedule";
import { getCoachClients } from "@/lib/nutrition-queries";
import { getDict } from "@/lib/i18n";

export default async function CoachSchedulePage() {
  const [{ items, live }, clients, t] = await Promise.all([
    getCoachAppointments(),
    getCoachClients(),
    getDict(),
  ]);

  const boardItems: ScheduleItem[] = items.map((a) => ({
    id: a.id,
    clientName: a.clientName,
    clientId: a.clientId,
    date: a.date,
    startTime: a.startTime,
    endTime: a.endTime,
    sessionType: a.sessionType,
    status: a.status,
    notes: a.notes,
  }));

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.coach.scheduleTitle}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.coach.scheduleDesc}
      </p>
      <div className="mt-6">
        <ScheduleBoard
          items={boardItems}
          icsBase={live ? "/api/appointments" : undefined}
          onStatus={live ? updateAppointmentStatus : undefined}
          t={t}
        />
      </div>
      {clients.length > 0 && <AppointmentForm clients={clients} t={t} />}
    </div>
  );
}
