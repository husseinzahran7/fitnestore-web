import NutritionBoards from "@/components/nutrition-boards";
import MealLogForm from "@/components/meal-log-form";
import AssignTemplateForm from "@/components/assign-template-form";
import FoodLibrary from "@/components/food-library";
import ClientDayOverview from "@/components/client-day-overview";
import {
  mockClientMealPlans,
  mockNutritionPlans,
} from "@/data/mockNutrition";
import {
  getCoachClients,
  getNutritionTemplates,
} from "@/lib/nutrition-queries";
import { listCoachMeals, listFoods, getCoachDayOverview } from "@/lib/foods";

export default async function CoachNutritionPage() {
  // Templates read live; per-client plans stay mock — meals rows carry
  // name/day/details only, while the board shows dates/status/adherence
  // that have no backend columns. Wiring plans live would fabricate fields.
  const [{ templates, live }, clients, foods, coachMeals, dayOverview] = await Promise.all([
    getNutritionTemplates(),
    getCoachClients(),
    listFoods(),
    listCoachMeals(),
    getCoachDayOverview(),
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
      {live && templates.length > 0 && clients.length > 0 && (
        <AssignTemplateForm templates={templates} clients={clients} />
      )}
      {live && <FoodLibrary foods={foods} meals={coachMeals} />}
      {live && <ClientDayOverview days={dayOverview} />}
    </div>
  );
}
