"use server";

import { cookies } from "next/headers";
import { dictionary, type Dict, type Locale } from "@/lib/locale";

const COOKIE = "gymers-locale";

export async function getLocale(): Promise<Locale> {
  try {
    const v = (await cookies()).get(COOKIE)?.value;
    return v === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

export async function setLocale(locale: Locale): Promise<void> {
  (await cookies()).set(COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function getDict(): Promise<Dict> {
  return dictionary(await getLocale());
}
