import { NextResponse } from "next/server";
import { createClient, getViewer } from "@/lib/supabase/server";

export interface NotifItem {
  id: string;
  label: string;
  detail?: string;
  href: string;
}

// GET /api/notifications → { count, href, home, items } for the header bell.
// Coach: pending consult requests → /coach/messages.
// Admin: unapproved coach listings → /admin/coaches.
// User: upcoming appointments (7d) + links expiring within 7d → /dashboard/schedule.
// The bell polls this endpoint and subscribes to the same tables over
// Supabase Realtime; push/email remain human follow-ups (see docs).
export async function GET() {
  try {
    const viewer = await getViewer();
    if (!viewer) return NextResponse.json({ count: 0, href: "/login", home: null, items: [] });

    const supabase = await createClient();
    const home =
      viewer.role === "coach"
        ? "/coach"
        : viewer.role === "admin" || viewer.role === "superadmin"
          ? "/admin"
          : "/dashboard";

    if (viewer.role === "coach") {
      const { data } = await supabase
        .from("consult_requests")
        .select("id, user_id, note, created_at")
        .eq("coach_id", viewer.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(10);
      const rows = data ?? [];
      const { data: profiles } = rows.length
        ? await supabase.from("profiles").select("id, name").in("id", rows.map((r) => r.user_id))
        : { data: [] };
      const names = new Map((profiles ?? []).map((p) => [p.id, p.name]));
      const items: NotifItem[] = rows.map((r) => ({
        id: r.id,
        label: String(names.get(r.user_id) ?? "New consult request"),
        detail: String(r.note ?? "").slice(0, 80),
        href: "/coach/messages",
      }));
      return NextResponse.json({ count: rows.length, href: "/coach/messages", home, items });
    }

    if (viewer.role === "admin" || viewer.role === "superadmin") {
      const { data } = await supabase
        .from("coach_profiles")
        .select("profile_id, display_name")
        .eq("approved", false)
        .order("created_at", { ascending: false })
        .limit(10);
      const rows = data ?? [];
      const items: NotifItem[] = rows.map((r) => ({
        id: r.profile_id,
        label: String(r.display_name ?? "Coach application"),
        href: "/admin/coaches",
      }));
      return NextResponse.json({ count: rows.length, href: "/admin/coaches", home, items });
    }

    // User: upcoming week appointments + links expiring within 7 days.
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("profile_id", viewer.id)
      .single();
    const items: NotifItem[] = [];
    if (client?.id) {
      const today = new Date().toISOString().slice(0, 10);
      const weekOut = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);
      const { data: appts } = await supabase
        .from("appointments")
        .select("id, date, start_time, session_type")
        .eq("client_id", client.id)
        .eq("status", "upcoming")
        .gte("date", today)
        .lte("date", weekOut)
        .order("date", { ascending: true })
        .limit(10);
      for (const a of appts ?? []) {
        items.push({
          id: a.id,
          label: String(a.session_type ?? "Session"),
          detail: `${String(a.date)} ${String(a.start_time ?? "")}`.trim(),
          href: "/dashboard/schedule",
        });
      }
    }
    const { data: links } = await supabase
      .from("coach_links")
      .select("id, ends_at, coach_name")
      .eq("trainee_id", viewer.id)
      .eq("status", "active")
      .not("ends_at", "is", null)
      .lte("ends_at", new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString())
      .limit(5);
    for (const l of links ?? []) {
      items.push({
        id: l.id,
        label: `Plan ends ${String(l.ends_at).slice(0, 10)}`,
        detail: String(l.coach_name ?? ""),
        href: "/dashboard",
      });
    }
    return NextResponse.json({ count: items.length, href: "/dashboard", home, items });
  } catch {
    return NextResponse.json({ count: 0, href: "/", home: null, items: [] });
  }
}
