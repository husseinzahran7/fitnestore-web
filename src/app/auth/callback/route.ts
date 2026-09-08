import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /auth/callback?code=... — Supabase OAuth (Google) return path.
// Exchanges the code, provisions a profiles row for first-timers,
// then role-routes exactly like password login.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      role: "user",
      name:
        data.user.user_metadata?.full_name ??
        data.user.email?.split("@")[0] ??
        "Member",
    });
    return NextResponse.redirect(`${origin}/dashboard`);
  }
  if (profile.role === "coach") return NextResponse.redirect(`${origin}/coach`);
  if (profile.role === "admin") return NextResponse.redirect(`${origin}/admin`);
  if (next !== "/") return NextResponse.redirect(`${origin}${next}`);
  return NextResponse.redirect(`${origin}/dashboard`);
}
