import {
  Apple,
  ArrowRight,
  BarChart3,
  CalendarCheck,
  Check,
  MessageSquareText,
  Users,
} from "lucide-react";
import Hero from "@/components/hero";
import Reveal from "@/components/reveal";
import SiteHeader from "@/components/site-header";

const coachFeatures = [
  {
    icon: Users,
    title: "Client roster",
    text: "Every client, plan, and subscription in one searchable home. Activate or pause accounts in one tap.",
  },
  {
    icon: CalendarCheck,
    title: "Sessions & scheduling",
    text: "Personal training, consults, assessments — scheduled, filtered, and always in sync.",
  },
  {
    icon: Apple,
    title: "Nutrition plans",
    text: "Templates plus per-client meal plans with adherence tracking built in.",
  },
  {
    icon: BarChart3,
    title: "Progress intelligence",
    text: "Weight, body fat, strength, endurance — charts your clients actually understand.",
  },
  {
    icon: MessageSquareText,
    title: "Built-in messaging",
    text: "Coach the moment, not the inbox. Conversations live next to the data.",
  },
  {
    icon: Check,
    title: "Check-ins",
    text: "Structured client check-ins with notes and metrics, week after week.",
  },
];

const marquee = [
  "Workout programs",
  "Nutrition plans",
  "Progress photos",
  "Coach messaging",
  "Session scheduling",
  "Check-ins",
  "Client roster",
  "Offline mode",
];

const tiers = [
  {
    name: "Starter",
    price: "Free",
    pitch: "Solo coaches testing the waters.",
    cta: "Start free",
    features: ["Up to 5 clients", "Workout programs", "Client messaging", "PWA mobile app"],
  },
  {
    name: "Coach Pro",
    price: "$19",
    pitch: "Working coaches growing their roster.",
    cta: "Go Pro",
    hot: true,
    features: [
      "Unlimited clients",
      "Nutrition plans + adherence",
      "Progress analytics",
      "Session scheduling",
      "Priority support",
    ],
  },
  {
    name: "Gym",
    price: "Custom",
    pitch: "Gyms and teams of coaches.",
    cta: "Talk to us",
    features: ["Multi-coach workspace", "Admin console", "Content library", "Onboarding help"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader />
      <main>
        <Hero />

        {/* marquee */}
        <div className="overflow-hidden border-y border-white/10 bg-white/[0.02] py-4">
          <div className="flex w-max animate-marquee gap-10 pr-10">
            {[...marquee, ...marquee].map((m, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-slate-400"
              >
                {m} <span className="ml-10 text-brand-500">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* coaches */}
        <section id="coaches" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-brand-400">
              For coaches
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Run your whole coaching business from one screen
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coachFeatures.map((f, i) => (
              <Reveal key={f.title} delay={Math.min(i * 0.06, 0.3)}>
                <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/50 hover:bg-white/[0.05]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <f.icon size={22} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* clients band */}
        <section id="clients" className="scroll-mt-20 border-y border-white/10 bg-ink-900">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-widest text-brand-400">
                For clients
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Your plan, in your pocket
              </h2>
              <p className="mt-4 max-w-lg leading-relaxed text-slate-400">
                Clients install GYMers straight from the browser — no app
                store. Workouts, meals, messages, and progress photos travel
                with them to the gym floor.
              </p>
              <ul className="mt-6 space-y-3">
                {["Today's workout with video-ready detail", "Meal plan + adherence streaks", "Message your coach anytime", "Photo + measurement timeline"].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-3 text-slate-200">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/15 text-brand-400">
                        <Check size={14} />
                      </span>
                      {t}
                    </li>
                  )
                )}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-white/15 bg-ink-950 p-4 shadow-2xl shadow-brand-500/10">
                <div className="rounded-[1.6rem] bg-gradient-to-b from-ink-800 to-ink-950 p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Today • Upper Body
                  </p>
                  <div className="mt-4 space-y-3">
                    {[
                      ["Bench Press", "4 × 8–10", "78%"],
                      ["Overhead Press", "3 × 10–12", "64%"],
                      ["Incline DB Press", "3 × 10–12", "41%"],
                    ].map(([n, s, w]) => (
                      <div key={n} className="rounded-xl bg-white/5 p-3.5">
                        <div className="flex justify-between text-sm font-semibold">
                          <span>{n}</span>
                          <span className="text-slate-400">{s}</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-brand-500" style={{ width: w }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-xl bg-brand-500 py-3 text-center text-sm font-bold text-white">
                    Start workout
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* pricing */}
        <section id="pricing" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-brand-400">Pricing</p>
            <h2 className="mx-auto mt-3 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Start free. Grow when you grow.
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {tiers.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div
                  className={`relative h-full rounded-2xl border p-7 ${
                    t.hot
                      ? "border-brand-500 bg-brand-500/[0.08] shadow-xl shadow-brand-500/10"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  {t.hot && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-bold">{t.name}</h3>
                  <p className="mt-1 text-3xl font-extrabold">
                    {t.price}
                    {t.price.startsWith("$") && (
                      <span className="text-base font-medium text-slate-400">/mo</span>
                    )}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">{t.pitch}</p>
                  <ul className="mt-5 space-y-2.5">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-200">
                        <Check size={15} className="shrink-0 text-brand-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#cta"
                    className={`mt-6 flex items-center justify-center gap-1.5 rounded-full py-3 text-sm font-semibold transition-all ${
                      t.hot
                        ? "bg-brand-500 text-white hover:bg-brand-400"
                        : "border border-white/20 text-white hover:bg-white/10"
                    }`}
                  >
                    {t.cta}
                    <ArrowRight size={15} />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* cta */}
        <section id="cta" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-20 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 px-6 py-16 text-center sm:px-12">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(0,128,255,0.25),transparent)]"
              />
              <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
                Coach like you mean it.
              </h2>
              <p className="relative mx-auto mt-3 max-w-xl text-slate-400">
                Join the coaches bringing their clients onto GYMers. Free to
                start, installable in seconds.
              </p>
              <a
                href="#top"
                className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-3.5 font-semibold text-white shadow-xl shadow-brand-500/30 transition-all hover:scale-105 hover:bg-brand-400"
              >
                Get started free
                <ArrowRight size={18} />
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="GYMers logo" className="h-7 w-7" />
            <span className="font-extrabold">
              GYM<span className="text-brand-500">ers</span>
            </span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 GYMers. Built for coaches and their clients.
          </p>
        </div>
      </footer>
    </div>
  );
}
