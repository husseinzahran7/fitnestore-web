import SiteHeader from "@/components/site-header";
import { getLocale } from "@/lib/i18n";

export const metadata = { title: "Account suspended" };

export default async function SuspendedPage() {
  const locale = await getLocale();
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-md px-4 pb-20 pt-32 text-center sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Account suspended
        </h1>
        <p className="mt-3 text-slate-400">
          Your account was disabled by the platform team. Contact support if
          you believe this is a mistake.
        </p>
        <a
          href="/login"
          className="mt-8 inline-block rounded-full bg-brand-500 px-8 py-3 text-sm font-bold text-white hover:bg-brand-400"
        >
          Back to sign in
        </a>
      </main>
    </div>
  );
}

