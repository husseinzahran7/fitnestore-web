import { createClient } from "@/lib/supabase/server";
import { getDict } from "@/lib/i18n";
import type { Dict } from "@/lib/locale";

interface Policy {
  slug: string;
  title: string;
  body: string;
  updated_at: string;
}

function fallbackPolicies(t: Dict): Policy[] {
  return [
    {
      slug: "terms-of-service",
      title: "Terms of Service",
      body: t.admin.fallbackTerms,
      updated_at: "2026-01-01",
    },
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      body: t.admin.fallbackPrivacy,
      updated_at: "2026-01-01",
    },
    {
      slug: "cookie-policy",
      title: "Cookie Policy",
      body: t.admin.fallbackCookies,
      updated_at: "2026-01-01",
    },
  ];
}

async function loadPolicies(): Promise<{ policies: Policy[] | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_policies")
      .select("slug, title, body, updated_at")
      .order("title");
    if (error || !data || data.length === 0) return { policies: null };
    return { policies: data as Policy[] };
  } catch {
    return { policies: null };
  }
}

export default async function AdminPoliciesPage() {
  const [{ policies: livePolicies }, t] = await Promise.all([loadPolicies(), getDict()]);
  const live = !!livePolicies;
  const policies = livePolicies ?? fallbackPolicies(t);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.nav.policies}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.admin.policiesDesc}
        {!live && ` ${t.admin.fallbackNote}`}
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
