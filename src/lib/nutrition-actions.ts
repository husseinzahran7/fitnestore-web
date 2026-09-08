"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type MealState = { error?: string; ok?: boolean };

export async function logMeal(
  _prev: MealState,
  formData: FormData
): Promise<MealState> {
  const planId = String(formData.get("planId") ?? "");
  const clientId = String(formData.get("clientId") ?? "");
  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  const day = String(formData.get("day") ?? "").trim().slice(0, 20);
  const details = String(formData.get("details") ?? "").trim().slice(0, 500);
  if (!planId || !clientId || !name) {
    return { error: "Plan, client, and meal name are required." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet — meal not saved." };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're signed out. Sign in again." };

  // RLS meals-coach-write enforces (own plan or own client); admin bypasses.
  const { error } = await supabase.from("meals").insert({
    plan_id: planId,
    client_id: clientId,
    name,
    day: day || null,
    details: details || null,
  });
  if (error) return { error: "Couldn't save. Try again." };

  revalidatePath("/coach/nutrition");
  return { ok: true };
}
