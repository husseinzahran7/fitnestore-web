"use server";

import { createClient } from "@/lib/supabase/server";
import type { MealPlan, NutritionPlan } from "@/data/mockNutrition";

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

// Live per-client plans built from real columns only:
// nutrition_plans(id, title, created_at, is_template=false) +
// meals(plan_id, client_id) for client linkage +
// meal_checks(meal_id) for adherence.
// No dates/status columns exist backend-side, so mapping stays honest:
// startDate = plan created_at, endDate = "" (ongoing), status = draft when
// plan holds zero meals else active, adherence = checked meals / total.
export async function getClientMealPlans(): Promise<{
  plans: MealPlan[];
  live: boolean;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { plans: [], live: false };

    const { data: plans, error } = await supabase
      .from("nutrition_plans")
      .select("id, title, created_at")
      .eq("is_template", false)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error || !plans || plans.length === 0) {
      return { plans: [], live: false };
    }

    const planIds = plans.map((p) => p.id);
    const { data: meals } = await supabase
      .from("meals")
      .select("id, plan_id, client_id")
      .in("plan_id", planIds);
    const mealRows = (meals ?? []) as Array<{
      id: string;
      plan_id: string;
      client_id: string | null;
    }>;
    if (mealRows.length === 0) {
      return {
        live: true,
        plans: plans.map((p) => ({
          id: p.id,
          clientName: "Unassigned",
          clientId: "",
          planName: p.title,
          startDate: String(p.created_at).slice(0, 10),
          endDate: "",
          status: "draft" as const,
          mealCount: 0,
        })),
      };
    }

    const clientIds = [
      ...new Set(
        mealRows.map((m) => m.client_id).filter((v): v is string => !!v)
      ),
    ];
    const names = new Map<string, string>();
    if (clientIds.length > 0) {
      const { data: clients } = await supabase
        .from("clients")
        .select("id, profile_id")
        .in("id", clientIds);
      const profileIds = (clients ?? []).map((c) => c.profile_id);
      if (profileIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, name")
          .in("id", profileIds);
        const profileNames = new Map(
          (profiles ?? []).map((p) => [p.id, p.name])
        );
        for (const c of clients ?? []) {
          names.set(
            c.id,
            (profileNames.get(c.profile_id) as string) ?? "Client"
          );
        }
      }
    }

    const { data: checks } = await supabase
      .from("meal_checks")
      .select("meal_id")
      .in(
        "meal_id",
        mealRows.map((m) => m.id)
      );
    const checkedSet = new Set((checks ?? []).map((ch) => ch.meal_id));

    const groups = new Map<
      string,
      { planId: string; clientId: string; mealIds: string[] }
    >();
    for (const m of mealRows) {
      const clientId = m.client_id ?? "";
      const key = `${m.plan_id}::${clientId}`;
      const g = groups.get(key) ?? {
        planId: m.plan_id,
        clientId,
        mealIds: [],
      };
      g.mealIds.push(m.id);
      groups.set(key, g);
    }

    const planById = new Map(plans.map((p) => [p.id, p]));
    return {
      live: true,
      plans: [...groups.values()].map((g) => {
        const plan = planById.get(g.planId)!;
        const total = g.mealIds.length;
        const checked = g.mealIds.filter((id) =>
          checkedSet.has(id)
        ).length;
        return {
          id: `${g.planId}::${g.clientId}`,
          clientName: (names.get(g.clientId) as string) ?? "Client",
          clientId: g.clientId,
          planName: plan.title,
          startDate: String(plan.created_at).slice(0, 10),
          endDate: "",
          status: "active" as const,
          adherenceRate:
            total > 0 ? Math.round((checked / total) * 100) : undefined,
          mealCount: total,
        };
      }),
    };
  } catch {
    return { plans: [], live: false };
  }
}
