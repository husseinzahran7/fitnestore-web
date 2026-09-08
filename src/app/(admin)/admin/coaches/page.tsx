import ApprovalQueue from "@/components/approval-queue";
import { listCoachesForAdmin } from "@/lib/coaches";

export default async function AdminCoachesPage() {
  const coaches = await listCoachesForAdmin();
  const pending = coaches.filter((c) => !c.approved).length;

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Coaches</h1>
      <p className="mt-1 text-sm text-slate-400">
        {coaches.length} listings • {pending} pending approval. Approved
        coaches appear in the public directory.
      </p>
      <div className="mt-6">
        <ApprovalQueue coaches={coaches} />
      </div>
    </div>
  );
}
