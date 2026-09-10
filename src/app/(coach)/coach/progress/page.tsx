import ProgressBoard from "@/components/progress-board";
import { mockClients } from "@/data/progress/mockData";
import { getCoachProgress } from "@/lib/progress-queries";

export default async function CoachProgressPage() {
  // Check-ins read live from check_ins; clients without any show
  // real metrics with an honestly empty check-in list.
  const { clients, live } = await getCoachProgress();

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Client Progress</h1>
      <p className="mt-1 text-sm text-slate-400">
        Metrics, trends, and check-ins per client.
        {!live && " • preview data (log metrics for live charts)"}
      </p>
      <div className="mt-6">
        <ProgressBoard clients={live ? clients : mockClients} live={live} />
      </div>
    </div>
  );
}
