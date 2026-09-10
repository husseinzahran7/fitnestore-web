import Link from "next/link";
import SiteHeader from "@/components/site-header";
import ConsultRequestForm from "@/components/consult-request-form";
import { getCoach } from "@/lib/coaches";
import { getDict, getLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coach = await getCoach(id);
  return { title: coach ? coach.name : "Coach" };
}

export default async function CoachProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [coach, locale, t] = await Promise.all([getCoach(id), getLocale(), getDict()]);
  const backLabel = locale === "ar" ? "كل المدربين" : "All coaches";

  if (!coach) {
    return (
      <div className="min-h-screen bg-ink-950 text-slate-100">
        <SiteHeader locale={locale} />
        <main className="mx-auto max-w-3xl px-4 pb-20 pt-28">
          <p className="text-sm text-slate-400">
            {locale === "ar" ? "المدرب غير موجود." : "Coach not found."}{" "}
            <Link href="/coaches" className="font-semibold text-brand-400">
              {t.nav.coaches}
            </Link>
          </p>
        </main>
      </div>
    );
  }

  const waText = encodeURIComponent(
    locale === "ar"
      ? `مرحباً ${coach.name}، أريد التدرب معك عبر GYMers.`
      : `Hi ${coach.name}, I want to train with you via GYMers.`
  );

  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <Link
          href="/coaches"
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-400 hover:text-white"
        >
          <span aria-hidden className="rtl:-scale-x-100">←</span> {backLabel}
        </Link>
        <div className="mt-4 flex items-center gap-4">
          {coach.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coach.avatarUrl}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/15 text-2xl font-bold text-brand-400">
              {coach.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{coach.name}</h1>
            <p className="mt-1 text-sm text-slate-400">
              {coach.years} {locale === "ar" ? "سنوات خبرة" : "years experience"}
            </p>
          </div>
          <span
            className={`ms-auto shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
              coach.freeConsult
                ? "bg-green-500/15 text-green-400"
                : "bg-orange-500/15 text-orange-400"
            }`}
          >
            {coach.freeConsult
              ? locale === "ar"
                ? "استشارة مجانية"
                : "Free consult"
              : locale === "ar"
                ? "حصص مدفوعة فقط"
                : "Paid sessions only"}
          </span>
        </div>

        {coach.bio && (
          <p className="mt-6 leading-relaxed text-slate-300">{coach.bio}</p>
        )}

        {coach.specialties.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              {locale === "ar" ? "التخصصات" : "Specialties"}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {coach.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {coach.specialtiesOther && (
          <p className="mt-3 text-sm text-slate-300">
            {locale === "ar" ? "أيضاً: " : "Also: "}{coach.specialtiesOther}
          </p>
        )}

        {coach.certifications.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              {locale === "ar" ? "الشهادات" : "Certifications"}
            </h2>
            <ul className="mt-2 space-y-1.5">
              {coach.certifications.map((c) => (
                <li key={c} className="text-sm text-slate-200">
                  ✓ {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {coach.whatsapp && (
            <a
              href={`https://wa.me/${coach.whatsapp}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-6 py-3.5 text-sm font-bold text-green-400 transition-all hover:bg-green-500/20"
            >
              {t.coaches.whatsapp}
            </a>
          )}
          <div className={coach.whatsapp ? "" : "sm:col-span-2"}>
            <ConsultRequestForm
              coachId={coach.id}
              freeConsult={coach.freeConsult}
              strings={{
                placeholder: t.coaches.goalPlaceholder,
                free: t.coaches.requestFree,
                paid: t.coaches.requestPaid,
                sending: locale === "ar" ? "جارٍ الإرسال…" : "Sending…",
              }}
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">{t.coaches.whatsappNote}</p>
      </main>
    </div>
  );
}
