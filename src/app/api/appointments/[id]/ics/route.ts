import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function esc(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

// GET /api/appointments/[id]/ics — calendar file that opens in Apple
// Calendar, Google Calendar, and Outlook/Windows Calendar. RLS decides
// access: the caller's own rows or their coach's rows only.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data: appt, error } = await supabase
      .from("appointments")
      .select("id, date, start_time, end_time, session_type, notes, client_id")
      .eq("id", id)
      .single();
    if (error || !appt) return new NextResponse("Not found", { status: 404 });

    const { data: client } = await supabase
      .from("clients")
      .select("profile_id")
      .eq("id", appt.client_id)
      .single();
    const { data: profile } = client
      ? await supabase
          .from("profiles")
          .select("name")
          .eq("id", client.profile_id)
          .single()
      : { data: null };

    const stamp = (d: string, t: string) =>
      `${d.replace(/-/g, "")}T${t.replace(/:/g, "").padEnd(6, "0")}`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//GYMers//Sessions//EN",
      "BEGIN:VEVENT",
      `UID:${appt.id}@gymers`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${stamp(String(appt.date), String(appt.start_time))}`,
      `DTEND:${stamp(String(appt.date), String(appt.end_time))}`,
      `SUMMARY:${esc(`GYMers: ${appt.session_type} with ${profile?.name ?? "client"}`)}`,
      `DESCRIPTION:${esc(String(appt.notes ?? ""))}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    return new NextResponse(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="gymers-session-${appt.date}.ics"`,
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
