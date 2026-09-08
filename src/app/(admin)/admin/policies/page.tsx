import { createClient } from "@/lib/supabase/server";

interface Policy {
  slug: string;
  title: string;
  body: string;
  updated_at: string;
}

const FALLBACK: Policy[] = [
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    body: "GYMers connects coaches with clients for training programs, nutrition plans, and progress tracking. Coaches are responsible for the safety and suitability of the programs they prescribe. Accounts breaking platform rules may be suspended.",
    updated_at: "2026-01-01",
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    body: "We store your profile, training data, messages, and progress photos to run the service. Coaches see their own clients' data; admins see platform data. We never sell personal data. Contact support to export or delete your data.",
    updated_at: "2026-01-01",
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    body: "We use strictly-necessary cookies for sign-in sessions and preferences. No advertising trackers. Disabling cookies will sign you out.",
    updated_at: "2026-01-01",
  },
];

async function loadPolicies(): Promise<{ policies: Policy[]; live: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_policies")
      .select("slug, title, body, updated_at")
      .order("title");
    if (error || !data || data.length === 0) return { policies: FALLBACK, live: false };
    return { policies: data as Policy[], live: true };
  } catch {
    return { policies: FALLBACK, live: false };
  }
}

export default async function AdminPoliciesPage() {
  const { policies, live } = await loadPolicies();

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Policies</h1>
      <p className="mt-1 text-sm text-slate-400">
        Platform legal content.
        {!live && " Showing built-in copy (connect Supabase to manage live)."}
      </p>
      <div className="mt-6 space-y-4">
        {policies.map((p) => (
          <article
            key={p.slug}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold">{p.title}</h2>
              <span className="font-mono text-xs text-slate-500">
                /{p.slug} • {p.updated_at.slice(0, 10)}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{p.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
