import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  MessageSquareText,
  Settings,
} from "lucide-react";
import { getViewer } from "@/lib/supabase/server";

const cards = [
  {
    icon: CalendarDays,
    title: "Schedule",
    text: "This week's workouts and sessions.",
    href: "/dashboard/schedule",
  },
  {
    icon: BarChart3,
    title: "Progress",
    text: "Weight, strength, measurements.",
    href: "/dashboard/progress",
  },
  {
    icon: MessageSquareText,
    title: "Messages",
    text: "Chat with your coach.",
    href: "/dashboard/messages",
  },
  {
    icon: Settings,
    title: "Settings",
    text: "Profile and preferences.",
    href: "/dashboard/settings",
  },
];

export default async function UserDashboard() {
  const viewer = await getViewer();

  return (
    <div>
      <p className="text-sm text-slate-400">
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
        Hey {viewer?.name ?? "there"} — let&apos;s train.
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
