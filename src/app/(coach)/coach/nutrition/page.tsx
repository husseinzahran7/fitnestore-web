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
  getClientMealPlans,
  getCoachClients,
  getNutritionTemplates,
} from "@/lib/nutrition-queries";
import { listCoachMeals, listFoods, getCoachDayOverview } from "@/lib/foods";

export default async function CoachNutritionPage() {
  // Templates + per-client plans read live from real columns only.
  // Assigned plans (is_template=false) link clients via meals.client_id;
  // board dates/status/adherence derive honestly (created_at, meal counts,
  // meal_checks) — no fabricated end dates. Mock fallback only when
  // Supabase holds zero assigned plans / unconfigured.
  const [{ templates, live }, clients, foods, coachMeals, dayOverview, clientPlans] = await Promise.all([
    getNutritionTemplates(),
    getCoachClients(),
    listFoods(),
    listCoachMeals(),
    getCoachDayOverview(),
    getClientMealPlans(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Nutrition Plans</h1>
      <p className="mt-1 text-sm text-slate-400">
        Templates and per-client meal plans.
        {!clientPlans.live && " • preview data (assign a template for live plans)"}
      </p>
      <div className="mt-6">
        <NutritionBoards
          templates={live ? templates : mockNutritionPlans}
          plans={clientPlans.live ? clientPlans.plans : mockClientMealPlans}
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
