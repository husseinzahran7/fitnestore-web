import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Role } from "@/lib/role-home";

function env(name: string): string | undefined {
  return (
    process.env[`NEXT_PUBLIC_SUPABASE_${name}`] ??
    (name === "KEY" ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined)
  );
}

export async function createClient() {
  const cookieStore = await cookies();
  const url = env("URL");
  const key = env("KEY");
  if (!url || !key) {
    throw new Error(
      "Supabase not configured. Copy .env.example to .env.local and fill values."
    );
  }
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — proxy refreshes the session.
        }
      },
    },
  });
}

export interface Viewer {
  id: string;
  email?: string;
  name: string;
  role: Role;
  membership?: string;
}

/** Session + profile, or null when signed out / unconfigured. Never throws.
 * Cached per request — layouts + pages + queries share one auth call. */
export const getViewer: () => Promise<Viewer | null> = cache(async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, name, membership")
      .eq("id", user.id)
      .single();
    const role: Role =
      profile?.role === "coach" || profile?.role === "admin"
        ? profile.role
        : "user";
    return {
      id: user.id,
      email: user.email ?? undefined,
      name:
        (profile?.name as string | undefined) ??
        user.email?.split("@")[0] ??
        "Member",
      role,
      membership: (profile?.membership as string | undefined) ?? undefined,
    };
  } catch {
    return null;
  }
});
