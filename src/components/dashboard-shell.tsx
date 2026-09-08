"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BellRing,
  BookOpen,
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Search,
  Settings,
  Shield,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import type { Role } from "@/lib/role-home";
import type { Viewer } from "@/lib/supabase/server";

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

interface NavItem {
  icon: typeof Users;
  label: string;
  path: string;
  badge?: number;
}

const NAV: Record<Role, NavItem[]> = {
  user: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: CalendarDays, label: "Schedule", path: "/dashboard/schedule" },
    { icon: BarChart3, label: "Progress", path: "/dashboard/progress" },
    { icon: MessageSquareText, label: "Messages", path: "/dashboard/messages" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ],
  coach: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/coach" },
    { icon: Users, label: "Clients", path: "/coach/clients" },
    { icon: CalendarDays, label: "Schedule", path: "/coach/schedule" },
    { icon: BookOpen, label: "Nutrition Plans", path: "/coach/nutrition" },
    { icon: MessageSquareText, label: "Messages", path: "/coach/messages" },
    { icon: UserCheck, label: "Client Progress", path: "/coach/progress" },
    { icon: User, label: "My Profile", path: "/coach/profile" },
    { icon: Settings, label: "Settings", path: "/coach/settings" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Coaches", path: "/admin/coaches" },
    { icon: FileText, label: "Policies", path: "/admin/policies" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ],
};

const PILL: Record<Role, string | null> = {
  user: null,
  coach: "Coach",
  admin: "Admin",
};

const SUBTITLE: Record<Role, (v: Viewer) => string> = {
  user: (v) => v.membership ?? "Member",
  coach: () => "Coach Portal",
  admin: () => "Admin Portal",
};

export default function DashboardShell({
  role,
  viewer,
  children,
}: {
  role: Role;
  viewer: Viewer;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const nav = NAV[role];
  const utility = role !== "user";
  const ProfileIcon = role === "admin" ? Shield : User;

  const renderItem = (it: NavItem, mini?: boolean) => {
    const active = pathname === it.path;
    const Icon = it.icon;
    return (
      <Link
        key={it.path}
        href={it.path}
        aria-current={active ? "page" : undefined}
        title={mini ? it.label : undefined}
        onClick={() => setMobileOpen(false)}
        className={cx(
          "relative flex items-center rounded-lg py-3 text-sm transition-colors",
          mini ? "justify-center px-2" : "px-4",
          active
            ? "bg-brand-500 font-medium text-white"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <Icon size={18} className={mini ? "" : "mr-3 shrink-0"} />
        {!mini && <span className="flex-1 truncate">{it.label}</span>}
        {!mini && it.badge != null && (
          <span
            className={cx(
              "ml-auto rounded-full px-2 py-0.5 text-xs font-bold",
              active ? "bg-white/20 text-white" : "bg-brand-500/15 text-brand-400"
            )}
          >
            {it.badge}
          </span>
        )}
        {mini && it.badge != null && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 p-0 text-[11px] font-bold text-white">
            {it.badge}
          </span>
        )}
      </Link>
    );
  };

  const footer = (mini: boolean) => (
    <div className={cx("border-t border-white/10", mini ? "p-2" : "p-4")}>
      {!mini ? (
        <>
          <div className="flex items-center p-3">
            <div className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/15">
              <ProfileIcon size={20} className="text-brand-400" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{viewer.name}</div>
              <div className="truncate text-xs text-slate-400">
                {SUBTITLE[role](viewer)}
              </div>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="mt-3 flex w-full items-center rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/15">
            <ProfileIcon size={20} className="text-brand-400" />
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              aria-label="Logout"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 transition-colors hover:bg-white/10"
            >
              <LogOut size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-ink-950 text-slate-100">
      {/* desktop sidebar */}
      <aside
        className={cx(
          "fixed inset-y-0 z-30 hidden border-r border-white/10 bg-ink-900 transition-all duration-300 md:block",
          collapsed ? "w-24" : "w-80"
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div
            className={cx(
              "flex items-center justify-between py-6",
              collapsed ? "px-3" : "px-6"
            )}
          >
            <Link
              href="/"
              className={cx(
                "flex items-center text-xl font-extrabold",
                collapsed && "w-full justify-center"
              )}
            >
              {collapsed ? (
                <>
                  <span className="text-brand-500">G</span>
                  <span>!</span>
                </>
              ) : (
                <>
                  GYM<span className="text-brand-500">ers</span>
                  {PILL[role] && (
                    <span className="ml-2 rounded bg-brand-500/15 px-2 py-0.5 text-sm text-brand-400">
                      {PILL[role]}
                    </span>
                  )}
                </>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="shrink-0 rounded-lg p-2 transition-colors hover:bg-white/10"
            >
              {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            </button>
          </div>
          <nav className={cx("flex-1 space-y-1 overflow-y-auto", collapsed ? "px-2" : "px-4")}>
            {nav.map((it) => renderItem(it, collapsed))}
          </nav>
          {footer(collapsed)}
        </div>
      </aside>

      {/* mobile overlay + drawer */}
      <div
        aria-hidden
        onClick={() => setMobileOpen(false)}
        className={cx(
          "fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cx(
          "fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col border-r border-white/10 bg-ink-900 transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <span className="text-xl font-extrabold">
            GYM<span className="text-brand-500">ers</span>
            {PILL[role] && (
              <span className="ml-2 rounded bg-brand-500/15 px-2 py-0.5 text-sm text-brand-400">
                {PILL[role]}
              </span>
            )}
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-2">
          {nav.map((it) => renderItem(it))}
        </nav>
        {footer(false)}
      </div>

      {/* main */}
      <main
        className={cx(
          "flex min-h-screen flex-1 flex-col transition-all duration-300",
          collapsed ? "md:ml-24" : "md:ml-80"
        )}
      >
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-ink-950/90 px-4 py-2 backdrop-blur-lg md:hidden">
          <div className="flex min-w-0 items-center">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="mr-2 shrink-0 rounded-lg p-2 hover:bg-white/10"
            >
              <Menu size={20} />
            </button>
            <span className="truncate text-lg font-extrabold">
              GYM<span className="text-brand-500">ers</span>
            </span>
          </div>
          {utility && (
            <div className="flex shrink-0 items-center gap-1">
              <button aria-label="Notifications" className="relative rounded-lg p-2 hover:bg-white/10">
                <BellRing size={20} />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                  3
                </span>
              </button>
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(!searchOpen)}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <Search size={20} />
              </button>
            </div>
          )}
        </header>

        {utility && searchOpen && (
          <div className="border-b border-white/10 bg-ink-950 p-2 md:hidden">
            <input
              placeholder="Search…"
              aria-label="Search"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
            />
          </div>
        )}

        {utility && (
          <header className="hidden items-center justify-end gap-2 border-b border-white/10 bg-ink-950 px-6 py-3 md:flex">
            <button aria-label="Notifications" className="relative mr-2 rounded-lg p-2 hover:bg-white/10">
              <BellRing size={20} />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>
            <input
              placeholder="Search…"
              aria-label="Search"
              className="w-64 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
            />
          </header>
        )}

        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
