import CoachProfileForm from "@/components/coach-profile-form";
import AvatarForm from "@/components/avatar-form";
import { getMyCoachProfile } from "@/lib/coaches";

export default async function CoachProfilePage() {
  const profile = await getMyCoachProfile();

  if (!profile) {
    return (
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to manage your public coach profile.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
      <p className="mt-1 text-sm text-slate-400">
        Your public directory listing.{" "}
        {profile.exists ? (
          profile.approved ? (
            <span className="font-semibold text-green-400">Approved — live in directory.</span>
          ) : (
            <span className="font-semibold text-orange-400">
              Pending admin approval — hidden until approved.
            </span>
          )
        ) : (
          <span className="font-semibold text-slate-300">
            No listing yet — save to create one.
          </span>
        )}
      </p>
      <div className="mt-6 space-y-5">
        <AvatarForm currentUrl={profile.avatarUrl} />
        <CoachProfileForm initial={profile} />
      </div>
    </div>
  );
}
