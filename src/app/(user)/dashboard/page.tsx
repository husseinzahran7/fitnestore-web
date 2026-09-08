import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  MessageSquareText,
  Settings,
} from "lucide-react";
import { getViewer } from "@/lib/supabase/server";
import { getDict, getLocale } from "@/lib/i18n";

export default async function UserDashboard() {
  const viewer = await getViewer();
  const [t, locale] = await Promise.all([getDict(), getLocale()]);
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
