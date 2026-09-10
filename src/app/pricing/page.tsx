import { ArrowRight, Check } from "lucide-react";
import SiteHeader from "@/components/site-header";
import { getLocale } from "@/lib/i18n";

export const metadata = {
  title: "Pricing",
  description: "GYMers pricing: train free solo, or train with a coach by the week.",
};

export default async function PricingPage() {
  const locale = await getLocale();
  const ar = locale === "ar";

  const tiers = [
    {
      name: ar ? "وحدك" : "Solo",
      price: ar ? "مجاناً" : "Free",
      per: "",
      pitch: ar
        ? "تدرّب لحسابك وتابع تقدمك بدون مدرب."
        : "Train on your own and track your progress with no coach.",
      features: ar
        ? ["تمارينك الخاصة", "تسجيل القياسات والتقدم", "سجل الوجبات والماء", "تطبيق مجاني"]
        : ["Your own workouts", "Log weight and progress", "Meal and water logs", "Free forever"],
      cta: ar ? "ابدأ مجاناً" : "Start free",
      href: "/register",
      hot: false,
    },
    {
      name: ar ? "مع مدرب" : "With a coach",
      price: ar ? "بالأسابيع" : "Per weeks",
      per: ar ? "4 / 8 / 12 … حتى 52" : "4 / 8 / 12 … up to 52",
      pitch: ar
        ? "تدفع لمدربك مباشرة. يبدأ اشتراكك عندما يرسل مدربك أول خطة."
        : "You pay your coach directly. Your subscription starts when your coach sends your first plan.",
      features: ar
        ? ["خطة تمارين وتغذية من مدربك", "تواصل واتساب مع المدرب", "متابعة تقدمك أولاً بأول", "سجلّك محفوظ ويمكن مشاركته"]
        : ["Training + nutrition plan from your coach", "WhatsApp contact with your coach", "Ongoing progress tracking", "History kept and shareable"],
      cta: ar ? "اعثر على مدرب" : "Find a coach",
      href: "/coaches",
      hot: true,
    },
    {
      name: ar ? "فتح السجل" : "History unlock",
      price: ar ? "بالأسابيع" : "Per weeks",
      per: ar ? "بعد انتهاء الاشتراك" : "After expiry",
      pitch: ar
        ? "انتهى اشتراكك مع المدرب؟ افتح خططك القديمة للقراءة فقط وواصل وحدك."
        : "Coach subscription ended? Unlock your old plans read-only and keep training solo.",
      features: ar
        ? ["قراءة خططك السابقة", "بدون متابعة من المدرب", "ارجع لوضعك المجاني", "جدّد مع أي مدرب متى شئت"]
        : ["Read your past plans", "No coach tracking", "Back to free solo mode", "Re-subscribe with any coach anytime"],
      cta: ar ? "تواصل معنا" : "Contact us",
      href: "/coaches",
      hot: false,
    },
  ];

  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-brand-400">
          {ar ? "الأسعار" : "Pricing"}
        </p>
        <h1 className="mx-auto mt-3 max-w-xl text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
          {ar ? "ابدأ مجاناً. ادفع لمدربك عندما تكون جاهزاً." : "Start free. Pay your coach when you're ready."}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-400">
          {ar
            ? "لا دفع داخل التطبيق — تتفق مع مدربك خارج التطبيق ويفعّل الإدارة اشتراكك."
            : "No in-app payments — you agree with your coach outside the app and admin activates your subscription."}
        </p>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border p-7 ${
                t.hot
                  ? "border-brand-500 bg-brand-500/[0.08]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {t.hot && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {ar ? "الأكثر اختياراً" : "Most popular"}
                </span>
              )}
              <h2 className="text-lg font-bold">{t.name}</h2>
              <p className="mt-1 text-3xl font-extrabold">{t.price}</p>
              {t.per && <p className="mt-1 text-sm font-semibold text-brand-400">{t.per}</p>}
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{t.pitch}</p>
              <ul className="mt-5 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check size={15} className="shrink-0 text-brand-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={t.href}
                className={`mt-6 flex items-center justify-center gap-1.5 rounded-full py-3 text-sm font-semibold ${
                  t.hot
                    ? "bg-brand-500 text-white hover:bg-brand-400"
                    : "border border-white/20 hover:bg-white/10"
                }`}
              >
                {t.cta} <ArrowRight size={15} className="rtl:-scale-x-100" />
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
