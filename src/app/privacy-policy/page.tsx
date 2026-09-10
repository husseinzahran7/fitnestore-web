import SiteHeader from "@/components/site-header";
import { getLocale } from "@/lib/i18n";

export const metadata = { title: "Privacy Policy" };

export default async function PrivacyPage() {
  const locale = await getLocale();
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-300">
          <p>We store your profile, training data, messages, and progress photos to run the service. Coaches see their own clients&apos; data; admins see platform data.</p>
          <p>We never sell personal data. Contact support any time to export or delete your data.</p>
        </div>
      </main>
    </div>
  );
}

