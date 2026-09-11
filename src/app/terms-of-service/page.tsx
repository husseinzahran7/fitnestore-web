import SiteHeader from "@/components/site-header";
import { getDict, getLocale } from "@/lib/i18n";

export async function generateMetadata() {
  const t = await getDict();
  return { title: t.legal.termsTitle };
}

export default async function TermsPage() {
  const [locale, t] = await Promise.all([getLocale(), getDict()]);
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.legal.termsTitle}</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-300">
          <p>{t.legal.termsP1}</p>
          <p>{t.legal.termsP2}</p>
        </div>
      </main>
    </div>
  );
}

