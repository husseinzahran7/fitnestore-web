import NutritionBoards from "@/components/nutrition-boards";
import MealLogForm from "@/components/meal-log-form";
import {
  mockClientMealPlans,
  mockNutritionPlans,
} from "@/data/mockNutrition";
import {
  getCoachClients,
  getNutritionTemplates,
} from "@/lib/nutrition-queries";

export default async function CoachNutritionPage() {
  // Templates read live; per-client plans stay mock — meals rows carry
  // name/day/details only, while the board shows dates/status/adherence
  // that have no backend columns. Wiring plans live would fabricate fields.
  const [{ templates, live }, clients] = await Promise.all([
    getNutritionTemplates(),
    getCoachClients(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Nutrition Plans</h1>
      <p className="mt-1 text-sm text-slate-400">
        Templates and per-client meal plans.
        {!live && " • preview data (connect Supabase for live templates)"}
      </p>
      <div className="mt-6">
        <NutritionBoards
          templates={live ? templates : mockNutritionPlans}
          plans={mockClientMealPlans}
        />
      </div>
      {live && templates.length > 0 && clients.length > 0 && (
        <MealLogForm plans={templates} clients={clients} />
      )}
    </div>
  );
}
