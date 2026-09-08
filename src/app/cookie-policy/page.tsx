import SiteHeader from "@/components/site-header";

export const metadata = { title: "Cookie Policy" };

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Cookie Policy</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-300">
          <p>We use strictly-necessary cookies for sign-in sessions and preferences. No advertising trackers.</p>
          <p>Disabling cookies will sign you out.</p>
        </div>
      </main>
    </div>
  );
}
