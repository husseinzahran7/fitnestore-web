"use server";

import { revalidatePath } from "next/cache";
import { createClient, requireActive } from "@/lib/supabase/server";
import { getDict } from "@/lib/i18n";

export type WeightLogState = { error?: string; ok?: boolean };

export async function logWeight(
  _prev: WeightLogState,
  formData: FormData
): Promise<WeightLogState> {
  const raw = String(formData.get("weight") ?? "").trim();
  const weight = Number(raw);
  const t = await getDict();
  if (!raw || !Number.isFinite(weight) || weight <= 0 || weight > 1000) {
    return { error: t.errors.badWeight };
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

  const { ensureMyClientId } = await import("@/lib/ensure-client");
  const clientId = await ensureMyClientId(supabase, user.id);
  if (!clientId) return { error: t.errors.noClientRecord };

  // Owner self-insert covered by "body_metrics owner insert" policy.
  const { error } = await supabase.from("body_metrics").insert({
    client_id: clientId,
    weight,
  });
  if (error) return { error: t.errors.cantSave };

  revalidatePath("/dashboard/progress");
  return { ok: true };
}

export async function submitCheckin(
  _prev: WeightLogState,
  formData: FormData
): Promise<WeightLogState> {
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 1000);
  const t = await getDict();
  if (!notes) return { error: t.errors.writeFirst };

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
  const { ensureMyClientId } = await import("@/lib/ensure-client");
  const checkinClientId = await ensureMyClientId(supabase, user.id);
  if (!checkinClientId) return { error: t.errors.noClientRecord };

  const { error } = await supabase
    .from("check_ins")
    .insert({ client_id: checkinClientId, notes });
  if (error) return { error: t.errors.cantSave };
  revalidatePath("/dashboard/progress");
  return { ok: true };
}

const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadPhoto(
  _prev: WeightLogState,
  formData: FormData
): Promise<WeightLogState> {
  const file = formData.get("photo");
  const t = await getDict();
  if (!(file instanceof File) || file.size === 0) {
    return { error: t.errors.pickPhoto };
  }
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return { error: t.errors.photoTypes };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: t.errors.photoSize };
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

  // Owner-full storage policy keys on folder <uid>/ — path must match.
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${user.id}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage
    .from("progress_photos")
    .upload(path, file, { contentType: file.type });
  if (error) return { error: t.errors.cantUpload };

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
  const t = await getDict();
  if (!clientId) return { error: t.errors.invalid };
  if (
    (weight == null || !Number.isFinite(weight) || weight <= 0) &&
    (bodyFat == null || !Number.isFinite(bodyFat) || bodyFat < 0)
  ) {
    return { error: t.errors.metricNeeded };
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

  // Coach-insert policy enforces ownership (coach_id = auth.uid()).
  const { error } = await supabase.from("body_metrics").insert({
    client_id: clientId,
    ...(weight != null ? { weight } : {}),
    ...(bodyFat != null ? { body_fat: bodyFat } : {}),
  });
  if (error) return { error: t.errors.cantSave };

  revalidatePath("/coach/progress");
  return { ok: true };
}
