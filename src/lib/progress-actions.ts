"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type WeightLogState = { error?: string; ok?: boolean };

export async function logWeight(
  _prev: WeightLogState,
  formData: FormData
): Promise<WeightLogState> {
  const raw = String(formData.get("weight") ?? "").trim();
  const weight = Number(raw);
  if (!raw || !Number.isFinite(weight) || weight <= 0 || weight > 1000) {
    return { error: "Enter a valid weight." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet — entry not saved." };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're signed out. Sign in again." };

  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  if (!client) return { error: "No client record found." };

  // Owner self-insert covered by "body_metrics owner insert" policy.
  const { error } = await supabase.from("body_metrics").insert({
    client_id: client.id,
    weight,
  });
  if (error) return { error: "Couldn't save. Try again." };

  revalidatePath("/dashboard/progress");
  return { ok: true };
}

export async function logClientMetric(
  _prev: WeightLogState,
  formData: FormData
): Promise<WeightLogState> {
  const clientId = String(formData.get("clientId") ?? "");
  const wRaw = String(formData.get("weight") ?? "").trim();
  const bfRaw = String(formData.get("bodyFat") ?? "").trim();
  const weight = wRaw ? Number(wRaw) : null;
  const bodyFat = bfRaw ? Number(bfRaw) : null;
  if (!clientId) return { error: "Invalid request." };
  if (
    (weight == null || !Number.isFinite(weight) || weight <= 0) &&
    (bodyFat == null || !Number.isFinite(bodyFat) || bodyFat < 0)
  ) {
    return { error: "Enter a weight or body-fat value." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet — entry not saved." };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're signed out. Sign in again." };

  // Coach-insert policy enforces ownership (coach_id = auth.uid()).
  const { error } = await supabase.from("body_metrics").insert({
    client_id: clientId,
    ...(weight != null ? { weight } : {}),
    ...(bodyFat != null ? { body_fat: bodyFat } : {}),
  });
  if (error) return { error: "Couldn't save. Try again." };

  revalidatePath("/coach/progress");
  return { ok: true };
}
