import { NextResponse } from "next/server";
import { createClient, getViewer } from "@/lib/supabase/server";

// GET /api/notifications → { count, href } for the header bell.
// Coach: pending consult requests → /coach/messages.
// Admin: unapproved coach listings → /admin/coaches.
// Users get no bell (shell hides it for the user role).
export async function GET() {
  try {
    const viewer = await getViewer();
    if (!viewer) return NextResponse.json({ count: 0, href: "/login" });

    const supabase = await createClient();
    if (viewer.role === "coach") {
      const { count } = await supabase
        .from("consult_requests")
        .select("id", { count: "exact", head: true })
        .eq("coach_id", viewer.id)
        .eq("status", "pending");
      return NextResponse.json({ count: count ?? 0, href: "/coach/messages" });
    }
    if (viewer.role === "admin") {
      const { count } = await supabase
        .from("coach_profiles")
        .select("profile_id", { count: "exact", head: true })
        .eq("approved", false);
      return NextResponse.json({ count: count ?? 0, href: "/admin/coaches" });
    }
    return NextResponse.json({ count: 0, href: "/dashboard" });
  } catch {
    return NextResponse.json({ count: 0, href: "/" });
  }
}
