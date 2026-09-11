"use server";

import { revalidatePath } from "next/cache";
import { createClient, requireActive } from "@/lib/supabase/server";
import { getDict } from "@/lib/i18n";

export type SettingsState = { error?: string; ok?: boolean };

export async function updateProfile(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const t = await getDict();
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: t.errors.noSupabaseSave };
  }
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: t.errors.nameEmpty };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t.errors.signedOut };
  if (!(await requireActive())) return { error: t.errors.suspended };

  const { error } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", user.id);
  if (error) return { error: t.errors.cantSave };

  revalidatePath("/", "layout");
  return { ok: true };
}
