import UserMeals from "@/components/user-meals";
import { getClientMeals, listFoods } from "@/lib/foods";

export default async function UserNutritionPage() {
  const [{ meals, extras, waterMl, live }, foods] = await Promise.all([
    getClientMeals(),
    listFoods(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Nutrition</h1>
      <p className="mt-1 text-sm text-slate-400">
        Your meals for today.
        {!live && " • no meals assigned yet — your coach will set them up."}
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
