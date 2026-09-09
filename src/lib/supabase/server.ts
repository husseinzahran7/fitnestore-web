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
  disabled: boolean;
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
      .select("role, name, membership, disabled")
      .eq("id", user.id)
      .single();
    const role: Role =
      profile?.role === "coach" ||
      profile?.role === "admin" ||
      profile?.role === "superadmin"
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
      disabled: !!profile?.disabled,
    };
  } catch {
    return null;
  }
});

/** False when signed out OR the account is disabled. Call at the top of
 * every mutation; layouts bounce disabled viewers to /suspended. */
export async function requireActive(): Promise<boolean> {
  const viewer = await getViewer();
  return !!viewer && !viewer.disabled;
}
