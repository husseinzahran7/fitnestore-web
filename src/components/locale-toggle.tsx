"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { switchLocale } from "@/lib/locale-actions";
import { dictionary, LOCALE_LABEL, type Locale } from "@/lib/locale";

// NOTE: `current` must be the real locale from the server (getLocale()).
// No client-side detection here — deriving from document.lang mismatches
// SSR HTML and breaks hydration. Every SiteHeader caller passes locale.
export default function LocaleToggle({ current = "en" }: { current?: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = dictionary(current);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${LOCALE_LABEL[current]}`}
        title={LOCALE_LABEL[current]}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-extrabold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Languages size={15} className="shrink-0" />
        <span>{LOCALE_LABEL[current]}</span>
        <ChevronDown
          size={13}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t.locale.label}
          className="absolute end-0 top-full z-50 mt-1 min-w-36 overflow-hidden rounded-xl border border-white/10 bg-ink-900 py-1 shadow-2xl shadow-black/50"
        >
          {(["en", "ar"] as Locale[]).map((loc) => {
            const active = loc === current;
            return (
              <form key={loc} action={switchLocale}>
                <input type="hidden" name="locale" value={loc} />
                <button
                  type="submit"
                  role="option"
                  aria-selected={active}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-xs font-bold transition-colors hover:bg-white/10 ${
                    active ? "text-white" : "text-slate-300"
                  }`}
                >
                  <span className="flex-1 text-start">{LOCALE_LABEL[loc]}</span>
                  {active && <Check size={14} className="shrink-0 text-brand-400" />}
                </button>
              </form>
            );
          })}
        </div>
      )}
    </div>
  );
}
