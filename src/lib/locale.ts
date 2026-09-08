export type Locale = "en" | "ar";
export const LOCALES: Locale[] = ["en", "ar"];

const dict = {
  en: {
    dir: "ltr" as const,
    nav: {
      dashboard: "Dashboard",
      schedule: "Schedule",
      nutrition: "Nutrition",
      progress: "Progress",
      messages: "Messages",
      settings: "Settings",
      clients: "Clients",
      clientProgress: "Client Progress",
      myProfile: "My Profile",
      coaches: "Coaches",
      policies: "Policies",
    },
    auth: { signIn: "Sign in", signOut: "Logout", search: "Search…" },
  },
  ar: {
    dir: "rtl" as const,
    nav: {
      dashboard: "الرئيسية",
      schedule: "الجدول",
      nutrition: "التغذية",
      progress: "التقدم",
      messages: "الرسائل",
      settings: "الإعدادات",
      clients: "العملاء",
      clientProgress: "تقدم العملاء",
      myProfile: "ملفي",
      coaches: "المدربون",
      policies: "السياسات",
    },
    auth: { signIn: "تسجيل الدخول", signOut: "تسجيل الخروج", search: "ابحث…" },
  },
} satisfies Record<Locale, unknown>;

export type Dict = (typeof dict)["en"];

export function dictionary(locale: Locale): Dict {
  return dict[locale] as Dict;
}
