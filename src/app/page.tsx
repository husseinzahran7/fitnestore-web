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
import { getDict, getLocale } from "@/lib/i18n";
import type { Dict } from "@/lib/locale";

const coachFeatures = (t: Dict["landing"]) => [
  {
    icon: Users,
    title: t.f1t,
    text: t.f1d,
  },
  {
    icon: CalendarCheck,
    title: t.f2t,
    text: t.f2d,
  },
  {
    icon: Apple,
    title: t.f3t,
    text: t.f3d,
  },
  {
    icon: BarChart3,
    title: t.f4t,
    text: t.f4d,
  },
  {
    icon: MessageSquareText,
    title: t.f5t,
    text: t.f5d,
  },
  {
    icon: Check,
    title: t.f6t,
    text: t.f6d,
  },
];

const marquee = (t: Dict["landing"]) => [
  t.mq1,
  t.mq2,
  t.mq3,
  t.mq4,
  t.mq5,
  t.mq6,
  t.mq7,
  t.mq8,
];

const tiersEn = [
  {
    name: "Solo",
    price: "Free",
    per: "",
    pitch: "Train on your own and track your progress with no coach.",
    cta: "Start free",
    href: "/register",
    features: ["Your own workouts", "Log weight and progress", "Meal and water logs", "Free forever"],
  },
  {
    name: "With a coach",
    price: "Per weeks",
    per: "4 / 8 / 12 … up to 52",
    pitch: "You pay your coach directly. Starts when your coach sends your first plan.",
    cta: "Find a coach",
    href: "/coaches",
    hot: true,
    features: [
      "Training + nutrition plan from your coach",
      "WhatsApp contact with your coach",
      "Ongoing progress tracking",
      "History kept and shareable",
    ],
  },
  {
    name: "History unlock",
    price: "Per weeks",
    per: "After expiry",
    pitch: "Coach subscription ended? Unlock old plans read-only and keep training solo.",
    cta: "See pricing",
    href: "/pricing",
    features: ["Read your past plans", "No coach tracking", "Back to free solo mode", "Re-subscribe anytime"],
  },
];

const tiersAr = [
  {
    name: "وحدك",
    price: "مجاناً",
    per: "",
    pitch: "تدرّب لحسابك وتابع تقدمك بدون مدرب.",
    cta: "ابدأ مجاناً",
    href: "/register",
    features: ["تمارينك الخاصة", "تسجيل القياسات والتقدم", "سجل الوجبات والماء", "تطبيق مجاني"],
  },
  {
    name: "مع مدرب",
    price: "بالأسابيع",
    per: "4 / 8 / 12 … حتى 52",
    pitch: "تدفع لمدربك مباشرة. يبدأ اشتراكك عندما يرسل مدربك أول خطة.",
    cta: "اعثر على مدرب",
    href: "/coaches",
    hot: true,
    features: [
      "خطة تمارين وتغذية من مدربك",
      "تواصل واتساب مع المدرب",
      "متابعة تقدمك أولاً بأول",
      "سجلّك محفوظ ويمكن مشاركته",
    ],
  },
  {
    name: "فتح السجل",
    price: "بالأسابيع",
    per: "بعد انتهاء الاشتراك",
    pitch: "انتهى اشتراكك مع المدرب؟ افتح خططك القديمة للقراءة فقط وواصل وحدك.",
    cta: "شاهد الأسعار",
    href: "/pricing",
    features: ["قراءة خططك السابقة", "بدون متابعة من المدرب", "ارجع لوضعك المجاني", "جدّد مع أي مدرب متى شئت"],
  },
];

export default async function Home() {
  const locale = await getLocale();
  const t = await getDict();
  const ar = locale === "ar";
  const tiers = ar ? tiersAr : tiersEn;
  const features = coachFeatures(t.landing);
  const strip = marquee(t.landing);
  const checklist = [t.landing.c1, t.landing.c2, t.landing.c3, t.landing.c4];
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader locale={locale} />
      <main>
        <Hero t={t} />

        {/* marquee */}
        <div className="overflow-hidden border-y border-white/10 bg-white/[0.02] py-4">
          <div className="flex w-max animate-marquee gap-10 pe-10">
            {[...strip, ...strip].map((m, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-slate-400"
              >
                {m} <span className="ms-10 text-brand-500">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* coaches */}
        <section id="coaches" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-brand-400">
              {t.landing.eyebrowCoach}
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t.landing.coachH}
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
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
                {t.landing.eyebrowClients}
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {t.landing.clientsH}
              </h2>
              <p className="mt-4 max-w-lg leading-relaxed text-slate-400">
                {t.landing.clientsP}
              </p>
              <ul className="mt-6 space-y-3">
                {checklist.map(
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
                    {t.landing.mockToday}
                  </p>
                  <div className="mt-4 space-y-3">
                    {(ar
                      ? [
                          ["ضغط الصدر", "4 × 8–10", "78%"],
                          ["الضغط العلوي", "3 × 10–12", "64%"],
                          ["صدر علوي دمبل", "3 × 10–12", "41%"],
                        ]
                      : [
                          ["Bench Press", "4 × 8–10", "78%"],
                          ["Overhead Press", "3 × 10–12", "64%"],
                          ["Incline DB Press", "3 × 10–12", "41%"],
                        ]
                    ).map(([n, s, w]) => (
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
                    {t.landing.mockStart}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* pricing */}
        <section id="pricing" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-brand-400">{t.landing.pricingEyebrow}</p>
            <h2 className="mx-auto mt-3 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t.landing.pricingH}
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {tiers.map((tr, i) => (
              <Reveal key={tr.name} delay={i * 0.08}>
                <div
                  className={`relative h-full rounded-2xl border p-7 ${
                    tr.hot
                      ? "border-brand-500 bg-brand-500/[0.08] shadow-xl shadow-brand-500/10"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  {tr.hot && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      {t.landing.popular}
                    </span>
                  )}
                  <h3 className="text-lg font-bold">{tr.name}</h3>
                  <p className="mt-1 text-3xl font-extrabold">{tr.price}</p>
                  {tr.per && <p className="mt-1 text-sm font-semibold text-brand-400">{tr.per}</p>}
                  <p className="mt-2 text-sm text-slate-400">{tr.pitch}</p>
                  <ul className="mt-5 space-y-2.5">
                    {tr.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-200">
                        <Check size={15} className="shrink-0 text-brand-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={tr.href}
                    className={`mt-6 flex items-center justify-center gap-1.5 rounded-full py-3 text-sm font-semibold transition-all ${
                      tr.hot
                        ? "bg-brand-500 text-white hover:bg-brand-400"
                        : "border border-white/20 text-white hover:bg-white/10"
                    }`}
                  >
                    {tr.cta}
                    <ArrowRight size={15} className="rtl:-scale-x-100" />
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
                {t.landing.ctaH}
              </h2>
              <p className="relative mx-auto mt-3 max-w-xl text-slate-400">
                {t.landing.ctaP}
              </p>
              <a
                href="/register"
                className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-3.5 font-semibold text-white shadow-xl shadow-brand-500/30 transition-all hover:scale-105 hover:bg-brand-400"
              >
                {t.landing.ctaBtn}
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
            © 2026 GYMers. {t.landing.footerBuilt}
          </p>
        </div>
      </footer>
    </div>
  );
}
