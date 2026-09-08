import Link from "next/link";
import SiteHeader from "@/components/site-header";
import ConsultRequestForm from "@/components/consult-request-form";
import { getCoach } from "@/lib/coaches";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coach = await getCoach(id);
  return { title: coach ? `${coach.name} — GYMers` : "Coach — GYMers" };
}

export default async function CoachProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coach = await getCoach(id);

  if (!coach) {
    return (
      <div className="min-h-screen bg-ink-950 text-slate-100">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 pb-20 pt-28">
          <p className="text-sm text-slate-400">
            Coach not found.{" "}
            <Link href="/coaches" className="font-semibold text-brand-400">
              Browse coaches
            </Link>
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <Link
          href="/coaches"
          className="text-sm font-semibold text-slate-400 hover:text-white"
        >
          ← All coaches
        </Link>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/15 text-2xl font-bold text-brand-400">
            {coach.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{coach.name}</h1>
            <p className="mt-1 text-sm text-slate-400">
              {coach.years} years experience
            </p>
          </div>
          <span
            className={`ml-auto shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
              coach.freeConsult
                ? "bg-green-500/15 text-green-400"
                : "bg-orange-500/15 text-orange-400"
            }`}
          >
            {coach.freeConsult ? "Free consult" : "Paid sessions only"}
          </span>
        </div>

        {coach.bio && (
          <p className="mt-6 leading-relaxed text-slate-300">{coach.bio}</p>
        )}

        {coach.specialties.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Specialties
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {coach.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {coach.specialtiesOther && (
          <p className="mt-3 text-sm text-slate-300">
            Also: {coach.specialtiesOther}
          </p>
        )}

        {coach.certifications.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Certifications
            </h2>
            <ul className="mt-2 space-y-1.5">
              {coach.certifications.map((c) => (
                <li key={c} className="text-sm text-slate-200">
                  ✓ {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {coach.whatsapp && (
            <a
              href={`https://wa.me/${coach.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-6 py-3.5 text-sm font-bold text-green-400 transition-all hover:bg-green-500/20"
            >
              Chat on WhatsApp
            </a>
          )}
          <div className={coach.whatsapp ? "" : "sm:col-span-2"}>
            <ConsultRequestForm
              coachId={coach.id}
              freeConsult={coach.freeConsult}
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          WhatsApp opens outside the app. In-app requests land in your messages.
        </p>
      </main>
    </div>
  );
}
