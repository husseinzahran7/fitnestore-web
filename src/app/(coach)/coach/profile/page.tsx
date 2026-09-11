import CoachProfileForm from "@/components/coach-profile-form";
import AvatarForm from "@/components/avatar-form";
import { getMyCoachProfile } from "@/lib/coaches";
import { getDict } from "@/lib/i18n";

export default async function CoachProfilePage() {
  const [profile, t] = await Promise.all([getMyCoachProfile(), getDict()]);

  if (!profile) {
    return (
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t.coach.profileTitle}</h1>
        <p className="mt-2 text-sm text-slate-400">
          {t.coach.profileSignIn}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.coach.profileTitle}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.coach.profileListing}{" "}
        {profile.exists ? (
          profile.approved ? (
            <span className="font-semibold text-green-400">{t.coach.approvedLive}</span>
          ) : (
            <span className="font-semibold text-orange-400">
              {t.coach.pendingApproval}
            </span>
          )
        ) : (
          <span className="font-semibold text-slate-300">
            {t.coach.noListing}
          </span>
        )}
      </p>
      <div className="mt-6 space-y-5">
        <AvatarForm currentUrl={profile.avatarUrl} t={t} />
        <CoachProfileForm initial={profile} t={t} />
      </div>
    </div>
  );
}
