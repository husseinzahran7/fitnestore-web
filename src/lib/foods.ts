"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCoachClients } from "@/lib/nutrition-queries";

export type FoodState = { error?: string; ok?: boolean };

export interface FoodItem {
  id: string;
  name: string;
  kind: string;
  calories100: number;
  protein100: number;
  carbs100: number;
  fat100: number;
  fiber100: number;
  mine: boolean;
}

export async function listFoods(): Promise<FoodItem[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from("food_items")
      .select("id, coach_id, name, kind, calories_100, protein_100, carbs_100, fat_100, fiber_100")
      .order("name");
    if (!data) return [];
    return data.map((f) => ({
      id: f.id,
      name: f.name,
      kind: String(f.kind ?? "food"),
      calories100: Number(f.calories_100 ?? 0),
      protein100: Number(f.protein_100 ?? 0),
      carbs100: Number(f.carbs_100 ?? 0),
      fat100: Number(f.fat_100 ?? 0),
      fiber100: Number(f.fiber_100 ?? 0),
      mine: f.coach_id === user.id,
    }));
  } catch {
    return [];
  }
}

function num(v: FormDataEntryValue | null): number {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export async function addFood(
  _prev: FoodState,
  formData: FormData
): Promise<FoodState> {
  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  const kind = String(formData.get("kind") ?? "food");
  if (!name) return { error: "Name can't be empty." };
  if (kind !== "food" && kind !== "supplement") {
    return { error: "Invalid kind." };
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

  const { error } = await supabase.from("food_items").insert({
    coach_id: user.id,
    name,
    kind,
    calories_100: num(formData.get("calories")),
    protein_100: num(formData.get("protein")),
    carbs_100: num(formData.get("carbs")),
    fat_100: num(formData.get("fat")),
    fiber_100: num(formData.get("fiber")),
  });
  if (error) return { error: "Couldn't save. Try again." };
  revalidatePath("/coach/nutrition");
  return { ok: true };
}

export async function addIngredient(
  _prev: FoodState,
  formData: FormData
): Promise<FoodState> {
  const mealId = String(formData.get("mealId") ?? "");
  const foodId = String(formData.get("foodId") ?? "");
  const grams = num(formData.get("grams")) || 100;
  if (!mealId || !foodId) return { error: "Invalid request." };

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

  // RLS ingredients-coach-write is the real gate (own plan or own client).
  const { error } = await supabase.from("meal_ingredients").insert({
    meal_id: mealId,
    food_item_id: foodId,
    grams,
  });
  if (error) return { error: "Couldn't add. Try again." };
  revalidatePath("/coach/nutrition");
  return { ok: true };
}

export interface CoachMealLite {
  id: string;
  name: string;
  client: string;
}

export async function listCoachMeals(): Promise<CoachMealLite[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data: clients } = await supabase
      .from("clients")
      .select("id, profile_id")
      .eq("coach_id", user.id);
    if (!clients || clients.length === 0) return [];
    const ids = clients.map((c) => c.id);
    const { data: meals } = await supabase
      .from("meals")
      .select("id, name, client_id")
      .in("client_id", ids)
      .order("created_at", { ascending: false })
      .limit(50);
    if (!meals) return [];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name")
      .in(
        "id",
        clients.map((c) => c.profile_id)
      );
    const byClient = new Map(clients.map((c) => [c.id, c.profile_id]));
    const names = new Map((profiles ?? []).map((p) => [p.id, p.name]));
    return meals.map((m) => ({
      id: m.id,
      name: m.name,
      client: (names.get(byClient.get(m.client_id) ?? "") as string) ?? "Client",
    }));
  } catch {
    return [];
  }
}

export interface ClientDayView {
  clientId: string;
  name: string;
  checked: Array<{ meal: string; comment: string }>;
  waterMl: number;
}

export async function getCoachDayOverview(): Promise<ClientDayView[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const clients = await getCoachClients();
    if (clients.length === 0) return [];
    const ids = clients.map((c) => c.id);
    const today = new Date().toISOString().slice(0, 10);
    const cutoff = new Date(Date.now() - 24 * 3600 * 1000);
    const [{ data: checks }, { data: water }, { data: meals }] = await Promise.all([
      supabase
        .from("meal_checks")
        .select("meal_id, client_id, comment")
        .in("client_id", ids)
        .eq("checked_on", today),
      supabase
        .from("water_logs")
        .select("client_id, ml, created_at")
        .in("client_id", ids)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase.from("meals").select("id, name").in("client_id", ids),
    ]);
    const mealNames = new Map((meals ?? []).map((m) => [m.id, m.name]));
    return clients.map((c) => ({
      clientId: c.id,
      name: c.name,
      checked: (checks ?? [])
        .filter((ch) => ch.client_id === c.id)
        .map((ch) => ({
          meal: (mealNames.get(ch.meal_id) as string) ?? "Meal",
          comment: String(ch.comment ?? ""),
        })),
      waterMl: (water ?? [])
        .filter(
          (w) => w.client_id === c.id && new Date(w.created_at) >= cutoff
        )
        .reduce((sum, w) => sum + (w.ml ?? 0), 0),
    }));
  } catch {
    return [];
  }
}

export interface MealWithFood {
  id: string;
  name: string;
  day: string;
  details: string;
  checked: boolean;
  comment: string;
  ingredients: Array<{
    id: string;
    food: string;
    grams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }>;
  totals: { calories: number; protein: number; carbs: number; fat: number; fiber: number };
}

const zero = () => ({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

export async function getClientMeals(): Promise<{
  meals: MealWithFood[];
  waterMl: number;
  live: boolean;
}> {
  const fallback = { meals: [], waterMl: 0, live: false };
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fallback;
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("profile_id", user.id)
      .single();
    if (!client) return fallback;

    const today = new Date().toISOString().slice(0, 10);
    const [{ data: meals }, { data: checks }, { data: waterRows }] = await Promise.all([
      supabase
        .from("meals")
        .select("id, name, day, details")
        .eq("client_id", client.id),
      supabase
        .from("meal_checks")
        .select("meal_id, comment")
        .eq("client_id", client.id)
        .eq("checked_on", today),
      supabase
        .from("water_logs")
        .select("ml, created_at")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    if (!meals || meals.length === 0) return fallback;

    const { data: ingredients } = await supabase
      .from("meal_ingredients")
      .select("id, meal_id, grams, food_items(id, name, calories_100, protein_100, carbs_100, fat_100, fiber_100)")
      .in(
        "meal_id",
        meals.map((m) => m.id)
      );

    const checkMap = new Map((checks ?? []).map((c) => [c.meal_id, c.comment as string]));
    // Water counts last 24h (simple daily habit total).
    const cutoff = new Date(Date.now() - 24 * 3600 * 1000);
    const waterMl = (waterRows ?? [])
      .filter((w) => new Date(w.created_at) >= cutoff)
      .reduce((sum, w) => sum + (w.ml ?? 0), 0);

    return {
      live: true,
      waterMl,
      meals: meals.map((m) => {
        const rows = (ingredients ?? []).filter((i) => i.meal_id === m.id);
        const list = rows.map((r) => {
          const f = r.food_items as unknown as {
            name: string;
            calories_100: number;
            protein_100: number;
            carbs_100: number;
            fat_100: number;
            fiber_100: number;
          };
          const k = Number(r.grams ?? 0) / 100;
          return {
            id: r.id,
            food: f?.name ?? "Food",
            grams: Number(r.grams ?? 0),
            calories: +(Number(f?.calories_100 ?? 0) * k).toFixed(1),
            protein: +(Number(f?.protein_100 ?? 0) * k).toFixed(1),
            carbs: +(Number(f?.carbs_100 ?? 0) * k).toFixed(1),
            fat: +(Number(f?.fat_100 ?? 0) * k).toFixed(1),
            fiber: +(Number(f?.fiber_100 ?? 0) * k).toFixed(1),
          };
        });
        const totals = list.reduce(
          (t, i) => ({
            calories: +(t.calories + i.calories).toFixed(1),
            protein: +(t.protein + i.protein).toFixed(1),
            carbs: +(t.carbs + i.carbs).toFixed(1),
            fat: +(t.fat + i.fat).toFixed(1),
            fiber: +(t.fiber + i.fiber).toFixed(1),
          }),
          zero()
        );
        return {
          id: m.id,
          name: m.name,
          day: String(m.day ?? ""),
          details: String(m.details ?? ""),
          checked: checkMap.has(m.id),
          comment: checkMap.get(m.id) ?? "",
          ingredients: list,
          totals,
        };
      }),
    };
  } catch {
    return fallback;
  }
}

export async function checkMeal(
  _prev: FoodState,
  formData: FormData
): Promise<FoodState> {
  const mealId = String(formData.get("mealId") ?? "");
  const comment = String(formData.get("comment") ?? "").trim().slice(0, 300);
  if (!mealId) return { error: "Invalid request." };

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
  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  if (!client) return { error: "No client record found." };

  const { error } = await supabase.from("meal_checks").upsert(
    { meal_id: mealId, client_id: client.id, comment },
    { onConflict: "meal_id,checked_on" }
  );
  if (error) return { error: "Couldn't save. Try again." };
  revalidatePath("/dashboard/nutrition");
  return { ok: true };
}

export async function logWater(
  _prev: FoodState,
  formData: FormData
): Promise<FoodState> {
  const ml = Math.max(0, Math.min(2000, parseInt(String(formData.get("ml") ?? "250"), 10) || 0));
  if (!ml) return { error: "Invalid amount." };
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
  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  if (!client) return { error: "No client record found." };
  const { error } = await supabase
    .from("water_logs")
    .insert({ client_id: client.id, ml });
  if (error) return { error: "Couldn't save. Try again." };
  revalidatePath("/dashboard/nutrition");
  return { ok: true };
}
