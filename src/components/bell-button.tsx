"use client";

import { useEffect, useRef, useState } from "react";
import { BellRing } from "lucide-react";
import type { Dict } from "@/lib/locale";

interface NotifItem {
  id: string;
  label: string;
  detail?: string;
  href: string;
}

// Header bell: badge count + dropdown list. Refreshes by polling every 30s
// and by Supabase Realtime on the role's source tables (when the project
// has them in the realtime publication; polling is the fallback).
// `t` is optional so shells without locale threading still compile.
export default function BellButton({ t }: { t?: Dict }) {
  const [count, setCount] = useState(0);
  const [href, setHref] = useState("/");
  const [items, setItems] = useState<NotifItem[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const label = "Notifications";
  void t;

  useEffect(() => {
    let alive = true;
    let channel: { unsubscribe: () => void } | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;

    const load = () => {
      fetch("/api/notifications")
        .then((r) => (r.ok ? r.json() : { count: 0, href: "/", items: [] }))
        .then((d) => {
          if (!alive) return;
          setCount(Number(d.count ?? 0));
          setHref(String(d.href ?? "/"));
          setItems(Array.isArray(d.items) ? d.items : []);
          return String(d.home ?? "");
        })
        .then((home) => {
          if (!alive || channel || !home) return;
          const tables =
            home === "/coach"
              ? ["consult_requests", "messages"]
              : home === "/admin"
                ? ["coach_profiles", "consult_requests"]
                : ["appointments", "coach_links", "messages"];
          import("@/lib/supabase/client")
            .then(({ createClient }) => {
              if (!alive) return;
              try {
                const supabase = createClient();
                const ch = supabase.channel("notifs");
                for (const table of tables) {
                  ch.on(
                    "postgres_changes",
                    { event: "*", schema: "public", table },
                    () => load()
                  );
                }
                ch.subscribe();
                channel = ch;
              } catch {
                // Env missing or realtime off — polling covers updates.
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    };

    load();
    timer = setInterval(load, 30_000);

    const onDocClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);

    return () => {
      alive = false;
      if (timer) clearInterval(timer);
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
      try {
        channel?.unsubscribe();
      } catch {
        // teardown best-effort
      }
    };
  }, []);

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => (items.length > 0 ? setOpen((v) => !v) : (window.location.href = href))}
        aria-label={count > 0 ? `${label} (${count})` : label}
        aria-expanded={items.length > 0 ? open : undefined}
        className="relative rounded-lg p-2 hover:bg-white/10"
      >
        <BellRing size={20} />
        {count > 0 && (
          <span className="absolute -end-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>
      {open && items.length > 0 && (
        <ul className="absolute end-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-2xl">
          {items.map((n) => (
            <li key={n.id}>
              <a
                href={n.href}
                onClick={() => setOpen(false)}
                className="block border-b border-white/5 px-4 py-3 transition-colors last:border-0 hover:bg-white/5"
              >
                <div className="truncate text-sm font-bold text-white">{n.label}</div>
                {n.detail && (
                  <div className="mt-0.5 truncate text-xs text-slate-400">{n.detail}</div>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
