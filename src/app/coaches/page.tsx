import SiteHeader from "@/components/site-header";
import CoachBrowser from "@/components/coach-browser";
import { listCoaches } from "@/lib/coaches";
import { getDict, getLocale } from "@/lib/i18n";

export const metadata = {
  title: "Find a coach",
  description: "Browse approved coaches by specialty and request a consult.",
};

export default async function CoachesPage() {
  const [coaches, locale, t] = await Promise.all([listCoaches(), getLocale(), getDict()]);

  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-brand-400">
          {t.nav.coaches}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {locale === "ar" ? "اعثر على مدربك" : "Find your coach"}
        </h1>
        <p className="mt-3 max-w-lg text-slate-400">
          {locale === "ar"
            ? "كل مدرب هنا معتمد على المنصة. اطلب استشارة مجانية حيث تُعرض، أو تواصل واتساب مباشرة."
            : "Every coach here is approved on the platform. Request a free consult where offered, or chat on WhatsApp directly."}
        </p>
        <div className="mt-8">
          <CoachBrowser coaches={coaches} searchPlaceholder={t.coaches.search} />
        </div>
      </main>
    </div>
  );
}
