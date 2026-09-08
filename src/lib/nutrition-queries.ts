"use server";

import { createClient } from "@/lib/supabase/server";
import type { NutritionPlan } from "@/data/mockNutrition";

export interface CoachClientLite {
  id: string;
  name: string;
}

export async function getCoachClients(): Promise<CoachClientLite[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data: rows } = await supabase
      .from("clients")
      .select("id, profile_id")
      .eq("coach_id", user.id);
    if (!rows || rows.length === 0) return [];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name")
      .in(
        "id",
        rows.map((r) => r.profile_id)
      );
    const names = new Map((profiles ?? []).map((p) => [p.id, p.name]));
    return rows.map((r) => ({
      id: r.id,
      name: (names.get(r.profile_id) as string) ?? "Client",
    }));
  } catch {
    return [];
  }
}

// Live templates mapped 1:1 onto NutritionPlan. Real columns only:
// nutrition_plans(id, coach_id, title, description, tags, is_template, created_at).
// clientCount = number of meals rows referencing the plan (honest usage count).
export async function getNutritionTemplates(): Promise<{
  templates: NutritionPlan[];
  live: boolean;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { templates: [], live: false };

    const { data: plans, error } = await supabase
      .from("nutrition_plans")
      .select("id, title, description, tags, is_template, created_at")
      .eq("is_template", true)
      .order("created_at", { ascending: false });
    if (error || !plans || plans.length === 0) {
      return { templates: [], live: false };
    }

    const { data: meals } = await supabase
      .from("meals")
      .select("plan_id")
      .in(
        "plan_id",
        plans.map((p) => p.id)
      );
    const counts = new Map<string, number>();
    for (const m of meals ?? []) {
      counts.set(m.plan_id, (counts.get(m.plan_id) ?? 0) + 1);
    }

    return {
      live: true,
      templates: plans.map((p) => ({
        id: p.id,
        title: p.title,
        description: String(p.description ?? ""),
        tags: (p.tags as string[] | null) ?? [],
        createdAt: String(p.created_at).slice(0, 10),
        clientCount: counts.get(p.id) ?? 0,
        isTemplate: true,
      })),
    };
  } catch {
    return { templates: [], live: false };
  }
}
