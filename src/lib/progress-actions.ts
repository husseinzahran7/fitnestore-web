"use server";

import { revalidatePath } from "next/cache";
import { createClient, requireActive } from "@/lib/supabase/server";

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
  if (!(await requireActive())) return { error: "Account suspended." };

  const { ensureMyClientId } = await import("@/lib/ensure-client");
  const clientId = await ensureMyClientId(supabase, user.id);
  if (!clientId) return { error: "No client record found." };

  // Owner self-insert covered by "body_metrics owner insert" policy.
  const { error } = await supabase.from("body_metrics").insert({
    client_id: clientId,
    weight,
  });
  if (error) return { error: "Couldn't save. Try again." };

  revalidatePath("/dashboard/progress");
  return { ok: true };
}

export async function submitCheckin(
  _prev: WeightLogState,
  formData: FormData
): Promise<WeightLogState> {
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 1000);
  if (!notes) return { error: "Write a few words first." };

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet — check-in not saved." };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're signed out. Sign in again." };
  if (!(await requireActive())) return { error: "Account suspended." };
  const { ensureMyClientId } = await import("@/lib/ensure-client");
  const checkinClientId = await ensureMyClientId(supabase, user.id);
  if (!checkinClientId) return { error: "No client record found." };

  const { error } = await supabase
    .from("check_ins")
    .insert({ client_id: checkinClientId, notes });
  if (error) return { error: "Couldn't save. Try again." };
  revalidatePath("/dashboard/progress");
  return { ok: true };
}

const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadPhoto(
  _prev: WeightLogState,
  formData: FormData
): Promise<WeightLogState> {
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a photo first." };
  }
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return { error: "JPEG, PNG, or WebP only." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "Max 5 MB." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet — photo not saved." };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're signed out. Sign in again." };
  if (!(await requireActive())) return { error: "Account suspended." };

  // Owner-full storage policy keys on folder <uid>/ — path must match.
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${user.id}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage
    .from("progress_photos")
    .upload(path, file, { contentType: file.type });
  if (error) return { error: "Couldn't upload. Try again." };

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
  if (!(await requireActive())) return { error: "Account suspended." };

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
