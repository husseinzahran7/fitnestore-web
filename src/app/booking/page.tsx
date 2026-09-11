import { ArrowRight, CalendarCheck, MessageSquareText, UserCheck } from "lucide-react";
import SiteHeader from "@/components/site-header";
import { listCoaches } from "@/lib/coaches";
import { getDict, getLocale } from "@/lib/i18n";
import type { Dict } from "@/lib/locale";

export async function generateMetadata() {
  const t = await getDict();
  return {
    title: t.landing.bookH,
    description: t.landing.bookP,
  };
}

const steps = (t: Dict["landing"]) => [
  { icon: CalendarCheck, title: t.bookS1t, text: t.bookS1d },
  { icon: UserCheck, title: t.bookS2t, text: t.bookS2d },
  { icon: MessageSquareText, title: t.bookS3t, text: t.bookS3d },
];

export default async function BookingPage() {
  const [locale, t, coaches] = await Promise.all([getLocale(), getDict(), listCoaches()]);
  const list = steps(t.landing);
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-brand-400">
          {t.landing.bookEyebrow}
        </p>
        <h1 className="mx-auto mt-3 max-w-xl text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t.landing.bookH}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-slate-400">
          {t.landing.bookP}
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {list.map((s) => (
            <div key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
                <s.icon size={22} />
              </div>
              <h2 className="mt-3 font-bold">{s.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Real booking: pick an approved coach → consult request opens a chat thread. */}
        <h2 className="mt-12 text-center text-xl font-extrabold tracking-tight">
          {t.coaches.dirTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-slate-400">
          {t.coaches.dirDesc}
        </p>
        {coaches.length === 0 ? (
          <p className="mx-auto mt-6 max-w-lg rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-slate-400">
            {t.coaches.noCoaches}
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {coaches.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-brand-500/50"
              >
                {c.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.avatarUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-base font-bold text-brand-400">
                    {c.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold">{c.name}</div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    {c.years} {t.coaches.yrsLong} •{" "}
                    <span className={c.freeConsult ? "text-green-400" : "text-orange-400"}>
                      {c.freeConsult ? t.coaches.freeBadge : t.coaches.paidBadge}
                    </span>
                  </div>
                </div>
                <a
                  href={`/coaches/${c.id}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-colors hover:bg-brand-400"
                >
                  {c.freeConsult ? t.coaches.requestFree : t.coaches.requestPaid}
                  <ArrowRight size={16} className="rtl:-scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 text-center">
          <a
            href="/register"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 font-semibold text-slate-200 transition-all hover:bg-white/10"
          >
            {t.landing.bookCta} <ArrowRight size={18} className="rtl:-scale-x-100" />
          </a>
          <p className="mt-3 text-xs text-slate-500">{t.coaches.whatsappNote}</p>
        </div>
      </main>
    </div>
  );
}
