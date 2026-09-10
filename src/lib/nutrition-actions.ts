"use server";

import { revalidatePath } from "next/cache";
import { createClient, requireActive } from "@/lib/supabase/server";

export type MealState = { error?: string; ok?: boolean };

export async function assignTemplate(
  _prev: MealState,
  formData: FormData
): Promise<MealState> {
  const templateId = String(formData.get("templateId") ?? "");
  const clientId = String(formData.get("clientId") ?? "");
  if (!templateId || !clientId) return { error: "Invalid request." };

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
  if (!(await requireActive())) return { error: "Account suspended." };

  // Template must be a live template row (RLS read covers visibility).
  const { data: template } = await supabase
    .from("nutrition_plans")
    .select("id, title, description, tags")
    .eq("id", templateId)
    .eq("is_template", true)
    .single();
  if (!template) return { error: "Template not found." };

  // Client must belong to this coach (or caller is admin).
  const { data: client } = await supabase
    .from("clients")
    .select("id, coach_id")
    .eq("id", clientId)
    .single();
  if (!client) return { error: "Client not found." };

  const { coachMaySend } = await import("@/lib/subscriptions");
  const gate = await coachMaySend(clientId);
  if (!gate.ok) return { error: gate.error ?? "Subscription expired." };

  const { data: plan, error: planError } = await supabase
    .from("nutrition_plans")
    .insert({
      coach_id: user.id,
      title: `${template.title} — assigned`,
      description: template.description,
      tags: template.tags,
      is_template: false,
    })
    .select("id")
    .single();
  if (planError || !plan) return { error: "Couldn't assign. Try again." };

  const { data: meals } = await supabase
    .from("meals")
    .select("name, day, details")
    .eq("plan_id", templateId);
  if (meals && meals.length > 0) {
    const { error: mealsError } = await supabase.from("meals").insert(
      meals.map((m) => ({
        plan_id: plan.id,
        client_id: clientId,
        name: m.name,
        day: m.day,
        details: m.details,
      }))
    );
    if (mealsError) return { error: "Plan created, meals failed. Try again." };
  }

  revalidatePath("/coach/nutrition");
  const { startClockForClientId } = await import("@/lib/subscriptions");
  await startClockForClientId(clientId);
  return { ok: true };
}

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
  if (!(await requireActive())) return { error: "Account suspended." };

  // RLS meals-coach-write enforces (own plan or own client); admin bypasses.
  // Subscription gate first for a clear message.
  const { coachMaySend } = await import("@/lib/subscriptions");
  const gate = await coachMaySend(clientId);
  if (!gate.ok) return { error: gate.error ?? "Subscription expired." };
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
