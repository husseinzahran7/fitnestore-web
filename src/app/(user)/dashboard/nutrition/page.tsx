import UserMeals from "@/components/user-meals";
import SubLock from "@/components/sub-lock";
import { getClientMeals, listFoods } from "@/lib/foods";
import { getMyAppSub, getMyLinks } from "@/lib/subscriptions";
import { linkLive } from "@/lib/subscription-status";
import { getDict } from "@/lib/i18n";

export default async function UserNutritionPage() {
  const [{ meals, extras, waterMl, live }, foods, links, appSub, t] = await Promise.all([
    getClientMeals(),
    listFoods(),
    getMyLinks(),
    getMyAppSub(),
    getDict(),
  ]);

  const liveLink = links.find((l) => linkLive(l)) ?? null;
  const hadCoach = links.some((l) => !!l.starts_at);
  // NOTE: no `live` check — RLS hides expired rows, so hidden data must lock, not preview.
  const locked = hadCoach && !liveLink && !appSub;

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.nav.nutrition}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.pages.nutritionDesc}
        {!live && !locked && ` ${t.subs.soloNote}`}
        {!live && !locked && t.pages.noMealsAssigned}
      </p>
      <div className="mt-6">
        {locked ? (
          <SubLock
            title={t.subs.lockedTitle}
            body={t.subs.lockedBody}
            renewLabel={t.subs.renewCoach}
            appLabel={t.subs.unlockApp}
            soloNote={t.subs.soloNote}
          />
        ) : (
          <UserMeals
            meals={meals}
            extras={extras}
            foods={foods}
            waterMl={waterMl}
            live={live}
          />
        )}
      </div>
    </div>
  );
}
