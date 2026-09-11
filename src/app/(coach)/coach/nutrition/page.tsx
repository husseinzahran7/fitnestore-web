import NutritionBoards from "@/components/nutrition-boards";
import MealLogForm from "@/components/meal-log-form";
import AssignTemplateForm from "@/components/assign-template-form";
import FoodLibrary from "@/components/food-library";
import ClientDayOverview from "@/components/client-day-overview";
import {
  getClientMealPlans,
  getCoachClients,
  getNutritionTemplates,
} from "@/lib/nutrition-queries";
import { listCoachMeals, listFoods, getCoachDayOverview } from "@/lib/foods";
import { getDict } from "@/lib/i18n";

export default async function CoachNutritionPage() {
  // Templates + per-client plans read live from real columns only.
  // Assigned plans (is_template=false) link clients via meals.client_id;
  // board dates/status/adherence derive honestly (created_at, meal counts,
  // meal_checks) — no fabricated end dates. Empty state when
  // Supabase holds zero assigned plans / unconfigured.
  const [{ templates, live }, clients, foods, coachMeals, dayOverview, clientPlans, t] = await Promise.all([
    getNutritionTemplates(),
    getCoachClients(),
    listFoods(),
    listCoachMeals(),
    getCoachDayOverview(),
    getClientMealPlans(),
    getDict(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.coach.nutritionTitle}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.coach.nutritionDesc}
      </p>
      <div className="mt-6">
        <NutritionBoards
          templates={templates}
          plans={clientPlans.plans}
          t={t}
        />
      </div>
      {live && templates.length > 0 && clients.length > 0 && (
        <MealLogForm plans={templates} clients={clients} t={t} />
      )}
      {live && templates.length > 0 && clients.length > 0 && (
        <AssignTemplateForm templates={templates} clients={clients} t={t} />
      )}
      {live && <FoodLibrary foods={foods} meals={coachMeals} t={t} />}
      {live && <ClientDayOverview days={dayOverview} t={t} />}
    </div>
  );
}
