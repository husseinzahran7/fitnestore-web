"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CoachCard, CoachDetail, ConsultState } from "@/lib/coach-data";

export async function listCoaches(): Promise<CoachCard[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coach_profiles")
      .select(
        "profile_id, display_name, bio, specialties, specialties_other, years_experience, certifications, offers_free_consult, whatsapp"
      )
      .eq("approved", true)
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return [];

    return data.map((c) => ({
      id: c.profile_id,
      name: String(c.display_name ?? "Coach"),
      bio: String(c.bio ?? ""),
      specialties: (c.specialties as string[] | null) ?? [],
      specialtiesOther: String(c.specialties_other ?? ""),
      years: Number(c.years_experience ?? 0),
      certifications: (c.certifications as string[] | null) ?? [],
      freeConsult: !!c.offers_free_consult,
      hasWhatsapp: String(c.whatsapp ?? "").replace(/\D/g, "").length > 0,
    }));
  } catch {
    return [];
  }
}

export async function getCoach(id: string): Promise<CoachDetail | null> {
  const all = await listCoaches();
  const found = all.find((c) => c.id === id);
  if (!found) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("coach_profiles")
      .select("whatsapp")
      .eq("profile_id", id)
      .eq("approved", true)
      .single();
    return {
      ...found,
      whatsapp: String(data?.whatsapp ?? "").replace(/\D/g, ""),
    };
  } catch {
    return { ...found, whatsapp: "" };
  }
}

export async function requestConsult(
  _prev: ConsultState,
  formData: FormData
): Promise<ConsultState> {
  const coachId = String(formData.get("coachId") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, 500);
  if (!coachId) return { error: "Invalid request." };

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet." };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to request a consult." };

  const coach = await getCoach(coachId);
  if (!coach) return { error: "Coach not found." };

  const label = coach.freeConsult ? "Free consult request" : "Paid session request";
  const { data: conv, error: convError } = await supabase
    .from("conversations")
    .insert({ created_by: user.id })
    .select("id")
    .single();
  if (convError || !conv) return { error: "Couldn't start chat. Try again." };

  // Self membership first, then the request row the coach will accept.
  const { error: p1 } = await supabase
    .from("conversation_participants")
    .insert({ conversation_id: conv.id, profile_id: user.id });
  if (p1) return { error: "Couldn't start chat. Try again." };

  const { error: rError } = await supabase.from("consult_requests").insert({
    conversation_id: conv.id,
    coach_id: coachId,
    user_id: user.id,
    note,
  });
  if (rError) return { error: "Couldn't send request. Try again." };

  const { error: mError } = await supabase.from("messages").insert({
    conversation_id: conv.id,
    sender_id: user.id,
    content: `${label}${note ? ` — ${note}` : ""}`,
  });
  if (mError) return { error: "Couldn't send request. Try again." };

  revalidatePath("/dashboard/messages");
  redirect("/dashboard/messages");
}

export interface ConsultRequest {
  id: string;
  conversationId: string;
  userName: string;
  note: string;
  createdAt: string;
}

export async function getConsultRequests(): Promise<ConsultRequest[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from("consult_requests")
      .select("id, conversation_id, user_id, note, created_at")
      .eq("coach_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return [];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name")
      .in(
        "id",
        data.map((r) => r.user_id)
      );
    const names = new Map((profiles ?? []).map((p) => [p.id, p.name]));
    return data.map((r) => ({
      id: r.id,
      conversationId: r.conversation_id,
      userName: (names.get(r.user_id) as string) ?? "Client",
      note: String(r.note ?? ""),
      createdAt: String(r.created_at).slice(0, 10),
    }));
  } catch {
    return [];
  }
}

export type DecideState = { error?: string };

export async function decideConsult(
  _prev: DecideState,
  formData: FormData
): Promise<DecideState> {
  const requestId = String(formData.get("requestId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!requestId || (decision !== "accepted" && decision !== "declined")) {
    return { error: "Invalid request." };
  }
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet." };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're signed out. Sign in again." };

  const { data: req } = await supabase
    .from("consult_requests")
    .select("id, conversation_id")
    .eq("id", requestId)
    .eq("coach_id", user.id)
    .eq("status", "pending")
    .single();
  if (!req) return { error: "Request not found." };

  if (decision === "accepted") {
    // Own row via the plain self-insert policy — no cross-table checks.
    const { error: joinError } = await supabase
      .from("conversation_participants")
      .insert({ conversation_id: req.conversation_id, profile_id: user.id });
    if (joinError) return { error: "Couldn't join chat. Try again." };
  }
  const { error: updError } = await supabase
    .from("consult_requests")
    .update({ status: decision })
    .eq("id", requestId);
  if (updError) return { error: "Couldn't update. Try again." };

  revalidatePath("/coach/messages");
  return {};
}
