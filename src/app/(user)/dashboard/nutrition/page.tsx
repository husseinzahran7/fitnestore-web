import UserMeals from "@/components/user-meals";
import { getClientMeals, listFoods } from "@/lib/foods";
import { getDict } from "@/lib/i18n";

export default async function UserNutritionPage() {
  const [{ meals, extras, waterMl, live }, foods, t] = await Promise.all([
    getClientMeals(),
    listFoods(),
    getDict(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.nav.nutrition}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.pages.nutritionDesc}
        {!live && t.pages.noMealsAssigned}
      </p>
      <div className="mt-6">
        <UserMeals
          meals={meals}
          extras={extras}
          foods={foods}
          waterMl={waterMl}
          live={live}
        />
      </div>
    </div>
  );
}
