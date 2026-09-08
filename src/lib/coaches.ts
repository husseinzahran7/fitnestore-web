"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CoachCard, CoachDetail, ConsultState } from "@/lib/coach-data";
import { SPECIALTIES } from "@/lib/coach-data";

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

export interface MyCoachProfile {
  displayName: string;
  bio: string;
  specialties: string[];
  specialtiesOther: string;
  years: number;
  certifications: string;
  whatsapp: string;
  freeConsult: boolean;
  approved: boolean;
  exists: boolean;
}

export async function getMyCoachProfile(): Promise<MyCoachProfile | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const [{ data: profile }, { data: row }] = await Promise.all([
      supabase.from("profiles").select("name").eq("id", user.id).single(),
      supabase.from("coach_profiles").select("*").eq("profile_id", user.id).single(),
    ]);
    return {
      displayName: String(row?.display_name ?? profile?.name ?? ""),
      bio: String(row?.bio ?? ""),
      specialties: (row?.specialties as string[] | null) ?? [],
      specialtiesOther: String(row?.specialties_other ?? ""),
      years: Number(row?.years_experience ?? 0),
      certifications: ((row?.certifications as string[] | null) ?? []).join("\n"),
      whatsapp: String(row?.whatsapp ?? ""),
      freeConsult: row?.offers_free_consult ?? true,
      approved: !!row?.approved,
      exists: !!row,
    };
  } catch {
    return null;
  }
}

export type ProfileState = { error?: string; ok?: boolean };

export async function saveCoachProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const displayName = String(formData.get("displayName") ?? "").trim().slice(0, 80);
  const bio = String(formData.get("bio") ?? "").trim().slice(0, 1000);
  const specialties = formData
    .getAll("specialties")
    .map((s) => String(s))
    .filter((s) => (SPECIALTIES as readonly string[]).includes(s));
  const specialtiesOther = String(formData.get("specialtiesOther") ?? "").trim().slice(0, 200);
  const years = Math.max(0, Math.min(60, parseInt(String(formData.get("years") ?? "0"), 10) || 0));
  const certifications = String(formData.get("certifications") ?? "")
    .split("\n")
    .map((c) => c.trim())
    .filter(Boolean)
    .slice(0, 20);
  const whatsapp = String(formData.get("whatsapp") ?? "").replace(/\D/g, "").slice(0, 20);
  const freeConsult = formData.get("freeConsult") === "on";
  if (!displayName) return { error: "Display name can't be empty." };

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet — profile not saved." };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're signed out. Sign in again." };

  const { error } = await supabase.from("coach_profiles").upsert(
    {
      profile_id: user.id,
      display_name: displayName,
      bio,
      specialties,
      specialties_other: specialtiesOther,
      years_experience: years,
      certifications,
      whatsapp,
      offers_free_consult: freeConsult,
    },
    { onConflict: "profile_id" }
  );
  if (error) return { error: "Couldn't save. Try again." };

  revalidatePath("/coaches");
  revalidatePath("/coach/profile");
  return { ok: true };
}

export interface PendingCoach {
  profileId: string;
  name: string;
  displayName: string;
  bio: string;
  years: number;
  approved: boolean;
}

export async function listCoachesForAdmin(): Promise<PendingCoach[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coach_profiles")
      .select("profile_id, display_name, bio, years_experience, approved")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name")
      .in(
        "id",
        data.map((r) => r.profile_id)
      );
    const names = new Map((profiles ?? []).map((p) => [p.id, p.name]));
    return data.map((r) => ({
      profileId: r.profile_id,
      name: (names.get(r.profile_id) as string) ?? "?",
      displayName: String(r.display_name ?? ""),
      bio: String(r.bio ?? ""),
      years: Number(r.years_experience ?? 0),
      approved: !!r.approved,
    }));
  } catch {
    return [];
  }
}

export async function decideApproval(
  _prev: DecideState,
  formData: FormData
): Promise<DecideState> {
  const profileId = String(formData.get("profileId") ?? "");
  const approved = formData.get("approved") === "true";
  if (!profileId) return { error: "Invalid request." };
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
  // RLS admin-all policy is the real gate; this keeps honest errors.
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") return { error: "Admins only." };
  const { error } = await supabase
    .from("coach_profiles")
    .update({ approved })
    .eq("profile_id", profileId);
  if (error) return { error: "Couldn't update. Try again." };
  revalidatePath("/admin/coaches");
  revalidatePath("/coaches");
  return {};
}
