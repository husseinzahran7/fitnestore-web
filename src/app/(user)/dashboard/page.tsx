import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  MessageSquareText,
  Settings,
} from "lucide-react";
import { getViewer } from "@/lib/supabase/server";
import { getMyAppSub, getMyLinks } from "@/lib/subscriptions";
import { linkLive } from "@/lib/subscription-status";
import { getDict, getLocale } from "@/lib/i18n";

export default async function UserDashboard() {
  const viewer = await getViewer();
  const [t, locale, links, appSub] = await Promise.all([
    getDict(),
    getLocale(),
    getMyLinks(),
    getMyAppSub(),
  ]);
  const liveLink = links.find((l) => linkLive(l)) ?? null;
  const unstarted =
    links.find((l) => l.status === "active" && !l.starts_at) ?? null;
  const pendingInvite = links.find((l) => l.status === "pending") ?? null;
  const hadCoach = links.some((l) => !!l.starts_at);
  const locked = hadCoach && !liveLink && !appSub;
  const fmt = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")
      : "—";

  const cards = [
    {
      icon: CalendarDays,
      title: t.nav.schedule,
      text: t.pages.scheduleDesc,
      href: "/dashboard/schedule",
    },
    {
      icon: BarChart3,
      title: t.nav.progress,
      text: t.pages.progressDesc,
      href: "/dashboard/progress",
    },
    {
      icon: MessageSquareText,
      title: t.nav.messages,
      text: t.pages.messagesDesc,
      href: "/dashboard/messages",
    },
    {
      icon: Settings,
      title: t.nav.settings,
      text: t.pages.settingsDesc,
      href: "/dashboard/settings",
    },
  ];

  return (
    <div>
      <p className="text-sm text-slate-400">
        {new Date().toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
        {t.pages.hey} {viewer?.name ?? "there"} {t.pages.letsTrain}
      </h1>

      {liveLink ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-green-500/30 bg-green-500/[0.07] px-5 py-3.5 text-sm">
          <span className="font-bold text-green-400">
            {locale === "ar" ? "تتدرب مع" : "Training with"}{" "}
            {liveLink.coach_name ?? "Coach"}
          </span>
          <span className="text-slate-400">
            {liveLink.weeks} {t.subs.weeks} • {t.subs.activeUntil}{" "}
            {fmt(liveLink.ends_at)}
          </span>
          <Link
            href="/dashboard/schedule"
            className="ms-auto text-xs font-bold text-brand-400 hover:text-brand-500"
          >
            {t.nav.schedule}
          </Link>
        </div>
      ) : unstarted ? (
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm text-slate-400">
          {t.subs.startsOnSend} ({unstarted.weeks} {t.subs.weeks})
        </p>
      ) : pendingInvite ? (
        <p className="mt-4 rounded-2xl border border-brand-500/30 bg-brand-500/[0.07] px-5 py-3.5 text-sm text-slate-300">
          {locale === "ar"
            ? `طلب ربط من ${pendingInvite.coach_name ?? "مدربك"} — يُفعَّل بعد إتمام الدفع.`
            : `Link request from ${pendingInvite.coach_name ?? "your coach"} — activates after payment clears.`}
        </p>
      ) : locked ? (
        <Link
          href="/dashboard/schedule"
          className="mt-4 block rounded-2xl border border-orange-500/30 bg-orange-500/[0.07] px-5 py-3.5 text-sm transition-colors hover:border-orange-500/60"
        >
          <span className="font-bold text-orange-400">{t.subs.lockedTitle}</span>
          <span className="ms-2 text-slate-400">{t.subs.renewCoach} →</span>
        </Link>
      ) : appSub ? (
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm text-slate-400">
          {locale === "ar" ? "السجل مفتوح حتى" : "History unlocked until"}{" "}
          {fmt(appSub.ends_at)} • {t.subs.soloNote}
        </p>
      ) : (
        <p className="mt-4 text-sm text-slate-500">{t.subs.soloNote}</p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-0.5 hover:border-brand-500/50"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-white">
              <c.icon size={22} />
            </div>
            <h2 className="mt-4 text-lg font-bold">{c.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{c.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
