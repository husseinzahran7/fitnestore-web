import { ArrowRight, CalendarCheck, MessageSquareText, UserCheck } from "lucide-react";
import SiteHeader from "@/components/site-header";
import { listCoaches } from "@/lib/coaches";
import { getDict, getLocale } from "@/lib/i18n";

export async function generateMetadata() {
  return {
    title: "Book a session",
    description: "Pick an approved coach and request a consult. Booking opens a chat thread with your coach.",
  };
}

const steps = [
  { icon: CalendarCheck, title: "Pick a coach", text: "Choose from approved coaches below." },
  { icon: UserCheck, title: "Request a consult", text: "Send your goal in a sentence." },
  { icon: MessageSquareText, title: "Chat + train", text: "Your coach accepts and the plan starts." },
];

export default async function BookingPage() {
  const [locale, t, coaches] = await Promise.all([getLocale(), getDict(), listCoaches()]);
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-brand-400">
          Booking
        </p>
        <h1 className="mx-auto mt-3 max-w-xl text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
          Book a session with a coach
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-slate-400">
          Pick an approved coach below and send a consult request. Booking opens
          a chat thread — no separate slot table, the request IS the booking.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {steps.map((s) => (
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
          Approved coaches
        </h2>
        {coaches.length === 0 ? (
          <p className="mx-auto mt-6 max-w-lg rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-slate-400">
            No approved coaches yet. Check back soon.
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
                    {c.years} yrs exp •{" "}
                    <span className={c.freeConsult ? "text-green-400" : "text-orange-400"}>
                      {c.freeConsult ? "Free consult" : "Paid sessions only"}
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
            Create free account <ArrowRight size={18} className="rtl:-scale-x-100" />
          </a>
          <p className="mt-3 text-xs text-slate-500">{t.coaches.whatsappNote}</p>
        </div>
      </main>
    </div>
  );
}
