import { ArrowRight, CalendarCheck, MessageSquareText, UserCheck } from "lucide-react";
import SiteHeader from "@/components/site-header";
import { getLocale } from "@/lib/i18n";

export const metadata = {
  title: "Book a demo",
  description: "See GYMers in action with a personal walkthrough.",
};

const steps = [
  { icon: CalendarCheck, title: "Pick a time", text: "Choose a slot that suits your schedule." },
  { icon: UserCheck, title: "Meet your guide", text: "A 20-minute walkthrough of coach and client views." },
  { icon: MessageSquareText, title: "Get answers", text: "Pricing, migration, onboarding — ask anything." },
];

export default async function BookingPage() {
  const locale = await getLocale();
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-brand-400">
          Demo
        </p>
        <h1 className="mx-auto mt-3 max-w-xl text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
          See GYMers in action
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-slate-400">
          No sales calls. Create a free account and explore every role
          instantly.
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
        <div className="mt-10 text-center">
          <a
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-3.5 font-semibold text-white shadow-xl shadow-brand-500/30 transition-all hover:bg-brand-400"
          >
            Create free account <ArrowRight size={18} />
          </a>
        </div>
      </main>
    </div>
  );
}

