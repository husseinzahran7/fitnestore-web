"use server";

import { revalidatePath } from "next/cache";
import { createClient, requireActive } from "@/lib/supabase/server";

export type ClientStatusState = { error?: string; ok?: boolean };

export async function updateClientStatus(
  _prev: ClientStatusState,
  formData: FormData
): Promise<ClientStatusState> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet — changes can't be saved." };
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || (status !== "active" && status !== "cancelled")) {
    return { error: "Invalid request." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're signed out. Sign in again." };
  if (!(await requireActive())) return { error: "Account suspended." };

  // RLS enforces coach_id = auth.uid(); no extra checks here.
  const { error } = await supabase
    .from("clients")
    .update({ status })
    .eq("id", id);
  if (error) return { error: "Couldn't save. Try again." };

  revalidatePath("/coach/clients");
  return { ok: true };
}
