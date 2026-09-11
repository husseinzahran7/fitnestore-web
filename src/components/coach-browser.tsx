"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SPECIALTIES, SPEC_LABEL, type CoachCard } from "@/lib/coach-data";
import type { Dict } from "@/lib/locale";

export default function CoachBrowser({ coaches, searchPlaceholder, t }: { coaches: CoachCard[]; searchPlaceholder?: string; t: Dict }) {
  const [query, setQuery] = useState("");
  const [spec, setSpec] = useState<string>("all");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return coaches.filter((c) => {
      if (spec !== "all" && !c.specialties.includes(spec)) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q) ||
        c.specialtiesOther.toLowerCase().includes(q)
      );
    });
  }, [coaches, query, spec]);

  return (
    <div>
      <div className="relative mb-4 max-w-sm">
        <Search
          size={16}
          className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-500 rtl:-scale-x-100"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 ps-10 pe-4 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", ...SPECIALTIES].map((s) => (
          <button
            key={s}
            onClick={() => setSpec(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
              spec === s
                ? "bg-brand-500 text-white"
                : "border border-white/15 text-slate-300 hover:bg-white/10"
            }`}
          >
            {s === "all" ? t.common.all : t.coach[SPEC_LABEL[s as (typeof SPECIALTIES)[number]]]}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
          {coaches.length === 0
            ? t.coaches.noCoaches
            : t.coaches.noMatchDir}
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((c) => (
            <a
              key={c.id}
              href={`/coaches/${c.id}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-brand-500/50"
            >
              <div className="flex items-center gap-3">
                {c.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.avatarUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-base font-bold text-brand-400">
                    {c.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="truncate font-bold">{c.name}</div>
                  <div className="text-xs text-slate-400">
                    {c.years} {t.coach.yrs} {t.coaches.expWord}
                  </div>
                </div>
                <span
                  className={`ms-auto shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    c.freeConsult
                      ? "bg-green-500/15 text-green-400"
                      : "bg-orange-500/15 text-orange-400"
                  }`}
                >
                  {c.freeConsult ? t.coaches.freeBadge : t.coaches.paidOnly}
                </span>
              </div>
              {c.bio && (
                <p className="mt-3 line-clamp-2 text-sm text-slate-400">{c.bio}</p>
              )}
              {c.specialties.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.specialties.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-300"
                    >
                      {s in SPEC_LABEL ? t.coach[SPEC_LABEL[s as (typeof SPECIALTIES)[number]]] : s}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
