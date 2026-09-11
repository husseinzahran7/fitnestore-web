import Link from "next/link";
import { getClientLogs } from "@/lib/tracking";
import { getDict } from "@/lib/i18n";

export default async function ClientLogsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ clientName, logs, live }, t] = await Promise.all([
    getClientLogs(id),
    getDict(),
  ]);

  if (!live) {
    return (
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t.coach.logsTitle}</h1>
        <p className="mt-2 text-sm text-slate-400">
          {t.coach.logsNotFound}{" "}
          <Link href="/coach/clients" className="font-semibold text-brand-400">
            {t.coach.logsBack}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/coach/clients"
        className="text-sm font-semibold text-slate-400 hover:text-white"
      >
        <span aria-hidden className="rtl:-scale-x-100">←</span> {t.nav.clients}
      </Link>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
        {clientName} • {t.coach.logs}
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.coach.logsDesc}
      </p>
      <div className="mt-6 space-y-4">
        {logs.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
            {t.coach.logsEmpty}
          </p>
        )}
        {logs.map((l) => (
          <section
            key={l.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-bold">{l.title}</h2>
              <span className="text-sm text-slate-400">{l.performedOn}</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {l.sets.map((s, i) => (
                <li key={i} className="flex items-center justify-between gap-2">
                  <span>
                    <span className="me-2 text-xs font-bold text-slate-500">
                      {s.setNo}
                    </span>
                    {s.exercise}
                    {s.warmup && (
                      <span className="ms-2 rounded-full bg-orange-500/20 px-2 py-0.5 text-[11px] font-bold text-orange-400">
                        {t.coach.warmupShort}
                      </span>
                    )}
                  </span>
                  <span className="text-slate-400">
                    {s.weight !== "—" ? `${s.weight} ${t.coach.kgShort}` : "—"} • {s.reps !== "—" ? `${s.reps} ${t.track.repsWord}` : "—"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
