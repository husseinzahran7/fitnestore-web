import SiteHeader from "@/components/site-header";
import { getDict, getLocale } from "@/lib/i18n";

export async function generateMetadata() {
  const t = await getDict();
  return { title: t.site.suspTitle };
}

export default async function SuspendedPage() {
  const [locale, t] = await Promise.all([getLocale(), getDict()]);
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-md px-4 pb-20 pt-32 text-center sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {t.site.suspTitle}
        </h1>
        <p className="mt-3 text-slate-400">
          {t.site.suspBody}
        </p>
        <a
          href="/login"
          className="mt-8 inline-block rounded-full bg-brand-500 px-8 py-3 text-sm font-bold text-white hover:bg-brand-400"
        >
          {t.site.backSignin}
        </a>
      </main>
    </div>
  );
}

