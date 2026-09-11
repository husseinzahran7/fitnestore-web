"use server";

import { revalidatePath } from "next/cache";
import { createClient, requireActive } from "@/lib/supabase/server";
import { getDict } from "@/lib/i18n";

export type ClientStatusState = { error?: string; ok?: boolean };

export async function updateClientStatus(
  _prev: ClientStatusState,
  formData: FormData
): Promise<ClientStatusState> {
  const t = await getDict();
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: t.errors.noSupabaseSave };
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || (status !== "active" && status !== "cancelled")) {
    return { error: t.errors.invalid };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t.errors.signedOut };
  if (!(await requireActive())) return { error: t.errors.suspended };

  // RLS enforces coach_id = auth.uid(); no extra checks here.
  const { error } = await supabase
    .from("clients")
    .update({ status })
    .eq("id", id);
  if (error) return { error: t.errors.cantSave };

  revalidatePath("/coach/clients");
  return { ok: true };
}
