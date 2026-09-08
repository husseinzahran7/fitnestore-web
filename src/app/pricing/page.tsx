import { ArrowRight, Check } from "lucide-react";
import SiteHeader from "@/components/site-header";

export const metadata = {
  title: "Pricing",
  description: "GYMers pricing for solo coaches, pros, and gyms.",
};

const tiers = [
  {
    name: "Starter",
    price: "Free",
    pitch: "Solo coaches testing the waters.",
    features: ["Up to 5 clients", "Workout programs", "Client messaging", "PWA mobile app"],
  },
  {
    name: "Coach Pro",
    price: "$19",
    pitch: "Working coaches growing their roster.",
    hot: true,
    features: ["Unlimited clients", "Nutrition plans + adherence", "Progress analytics", "Session scheduling", "Priority support"],
  },
  {
    name: "Gym",
    price: "Custom",
    pitch: "Gyms and teams of coaches.",
    features: ["Multi-coach workspace", "Admin console", "Content library", "Onboarding help"],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-brand-400">
          Pricing
        </p>
        <h1 className="mx-auto mt-3 max-w-xl text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
          Start free. Grow when you grow.
        </h1>
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
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Most popular
                </span>
              )}
              <h2 className="text-lg font-bold">{t.name}</h2>
              <p className="mt-1 text-3xl font-extrabold">
                {t.price}
                {t.price.startsWith("$") && (
                  <span className="text-base font-medium text-slate-400">/mo</span>
                )}
              </p>
              <p className="mt-2 text-sm text-slate-400">{t.pitch}</p>
              <ul className="mt-5 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check size={15} className="shrink-0 text-brand-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/register"
                className={`mt-6 flex items-center justify-center gap-1.5 rounded-full py-3 text-sm font-semibold ${
                  t.hot
                    ? "bg-brand-500 text-white hover:bg-brand-400"
                    : "border border-white/20 hover:bg-white/10"
                }`}
              >
                Get started <ArrowRight size={15} />
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
