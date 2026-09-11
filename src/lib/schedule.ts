"use server";

import { revalidatePath } from "next/cache";
import { createClient, requireActive } from "@/lib/supabase/server";
import { getDict } from "@/lib/i18n";

export type ApptState = { error?: string; ok?: boolean };

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  status: "upcoming" | "completed" | "cancelled";
  notes: string;
}

async function myClientId(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("clients")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  return data?.id ?? null;
}

function toView(
  r: {
    id: string;
    client_id?: string;
    date: string;
    start_time: string;
    end_time: string;
    session_type: string;
    status: string;
    notes: string;
  },
  name: string
): Appointment {
  return {
    id: r.id,
    clientId: String(r.client_id ?? ""),
    clientName: name,
    date: String(r.date),
    startTime: String(r.start_time ?? ""),
    endTime: String(r.end_time ?? ""),
    sessionType: String(r.session_type ?? ""),
    status: (r.status === "completed" || r.status === "cancelled"
      ? r.status
      : "upcoming") as Appointment["status"],
    notes: String(r.notes ?? ""),
  };
}

export async function getCoachAppointments(): Promise<{
  items: Appointment[];
  live: boolean;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { items: [], live: false };
    const { data: rows, error } = await supabase
      .from("appointments")
      .select("id, client_id, date, start_time, end_time, session_type, status, notes")
      .eq("coach_id", user.id)
      .order("date", { ascending: true });
    if (error || !rows || rows.length === 0) return { items: [], live: false };

    const { data: clients } = await supabase
      .from("clients")
      .select("id, profile_id")
      .in(
        "id",
        rows.map((r) => r.client_id)
      );
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name")
      .in("id", (clients ?? []).map((c) => c.profile_id));
    const byClient = new Map((clients ?? []).map((c) => [c.id, c.profile_id]));
    const names = new Map((profiles ?? []).map((p) => [p.id, p.name]));
    return {
      live: true,
      items: rows.map((r) =>
        toView(r, (names.get(byClient.get(r.client_id) ?? "") as string) ?? "Client")
      ),
    };
  } catch {
    return { items: [], live: false };
  }
}

export async function getUserAppointments(): Promise<{
  items: Array<Omit<Appointment, "clientName"> & { coachName: string }>;
  live: boolean;
}> {
  try {
    const supabase = await createClient();
    const clientId = await myClientId(supabase);
    if (!clientId) return { items: [], live: false };
    // Trainee "upcoming" list: only upcoming sessions from today on.
    // Past/completed history lives with the coach logs, not here.
    const today = new Date().toISOString().slice(0, 10);
    const { data: rows, error } = await supabase
      .from("appointments")
      .select("id, coach_id, date, start_time, end_time, session_type, status, notes")
      .eq("client_id", clientId)
      .eq("status", "upcoming")
      .gte("date", today)
      .order("date", { ascending: true });
    if (error || !rows || rows.length === 0) return { items: [], live: false };
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name")
      .in(
        "id",
        rows.map((r) => r.coach_id)
      );
    const names = new Map((profiles ?? []).map((p) => [p.id, p.name]));
    return {
      live: true,
      items: rows.map((r) => ({
        ...toView(r, ""),
        coachName: (names.get(r.coach_id) as string) ?? "Coach",
      })),
    };
  } catch {
    return { items: [], live: false };
  }
}

export async function createAppointment(
  _prev: ApptState,
  formData: FormData
): Promise<ApptState> {
  const clientId = String(formData.get("clientId") ?? "");
  const date = String(formData.get("date") ?? "");
  const startTime = String(formData.get("startTime") ?? "").trim().slice(0, 10);
  const endTime = String(formData.get("endTime") ?? "").trim().slice(0, 10);
  const sessionType =
    String(formData.get("sessionType") ?? "Personal Training").trim().slice(0, 80) ||
    "Personal Training";
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 500);
  const t = await getDict();
  if (!clientId || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !startTime || !endTime) {
    return { error: t.errors.apptFields };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: t.errors.noSupabase };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t.errors.signedOut };
  if (!(await requireActive())) return { error: t.errors.suspended };

  // RLS coach-manage is the real gate (own rows or admin).
  // Subscription gate first for a clear message.
  const { coachMaySend } = await import("@/lib/subscriptions");
  const gate = await coachMaySend(clientId);
  if (!gate.ok) return { error: gate.error ?? "Subscription expired." };
  const { error } = await supabase.from("appointments").insert({
    coach_id: user.id,
    client_id: clientId,
    date,
    start_time: startTime,
    end_time: endTime,
    session_type: sessionType,
    notes,
  });
  if (error) return { error: t.errors.cantSave };
  const { startClockForClientId } = await import("@/lib/subscriptions");
  await startClockForClientId(clientId);
  revalidatePath("/coach/schedule");
  return { ok: true };
}

export async function updateAppointmentStatus(
  id: string,
  status: string
): Promise<{ error?: string }> {
  const t = await getDict();
  if (!id || !["upcoming", "completed", "cancelled"].includes(status)) {
    return { error: t.errors.invalid };
  }
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: t.errors.noSupabase };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t.errors.signedOut };
  if (!(await requireActive())) return { error: t.errors.suspended };
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);
  if (error) return { error: t.errors.cantSave };
  revalidatePath("/coach/schedule");
  return {};
}
