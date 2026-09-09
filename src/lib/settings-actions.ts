"use server";

import { revalidatePath } from "next/cache";
import { createClient, requireActive } from "@/lib/supabase/server";

export type SettingsState = { error?: string; ok?: boolean };

export async function updateProfile(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet — changes can't be saved." };
  }
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name can't be empty." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're signed out. Sign in again." };
  if (!(await requireActive())) return { error: "Account suspended." };

  const { error } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", user.id);
  if (error) return { error: "Couldn't save. Try again." };

  revalidatePath("/", "layout");
  return { ok: true };
}
