import SiteHeader from "@/components/site-header";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-300">
          <p>GYMers connects coaches with clients for training programs, nutrition plans, and progress tracking.</p>
          <p>Coaches are responsible for the safety and suitability of the programs they prescribe. Accounts breaking platform rules may be suspended.</p>
        </div>
      </main>
    </div>
  );
}
