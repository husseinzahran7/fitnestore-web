import type { ClientDayView } from "@/lib/foods";
import type { Dict } from "@/lib/locale";

export default function ClientDayOverview({
  days,
  t,
}: {
  days: ClientDayView[];
  t: Dict;
}) {
  if (days.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="font-bold">{t.coach.dayOverview}</h2>
      <p className="mt-1 text-sm text-slate-400">
        {t.coach.dayOverviewDesc}
      </p>
      <div className="mt-4 space-y-3">
        {days.map((d) => (
          <div
            key={d.clientId}
            className="rounded-xl border border-white/10 bg-ink-950/60 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">{d.name}</span>
              <span className="text-sm text-slate-300">
                {t.coach.water}:{" "}
                <span className="font-mono font-bold text-brand-400">
                  {(d.waterMl / 1000).toFixed(2).replace(/\.?0+$/, "")} L
                </span>
              </span>
            </div>
            {d.checked.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">
                {t.coach.nothingEaten}
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5 text-sm">
                {d.checked.map((c, i) => (
                  <li key={i} className="flex flex-wrap gap-x-2">
                    <span className="font-semibold text-green-400">✓</span>
                    <span>{c.meal}</span>
                    {c.comment && (
                      <span className="text-slate-400">“{c.comment}”</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
