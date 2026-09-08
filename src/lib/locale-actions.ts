"use server";

import { setLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

export async function switchLocale(formData: FormData): Promise<void> {
  const to = String(formData.get("locale") ?? "en");
  await setLocale(to === "ar" ? ("ar" satisfies Locale) : ("en" satisfies Locale));
}
