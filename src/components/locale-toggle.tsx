"use client";

import { switchLocale } from "@/lib/locale-actions";
import type { Locale } from "@/lib/locale";

export default function LocaleToggle({ current }: { current: Locale }) {
  const next: Locale = current === "ar" ? "en" : "ar";

  return (
    <form action={switchLocale}>
      <input type="hidden" name="locale" value={next} />
      <button
        type="submit"
        aria-label={next === "ar" ? "Switch to Arabic" : "Switch to English"}
        title={next === "ar" ? "العربية" : "English"}
        className="rounded-lg px-2.5 py-2 text-xs font-extrabold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
      >
        {next === "ar" ? "ع" : "EN"}
      </button>
    </form>
  );
}
