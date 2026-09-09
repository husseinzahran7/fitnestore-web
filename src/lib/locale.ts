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
      users: "Users",
    },
    auth: { signIn: "Sign in", signOut: "Logout", search: "Search…" },
    pages: {
      hey: "Hey",
      letsTrain: "— let's train.",
      scheduleDesc: "This week's workouts and sessions.",
      progressDesc: "Weight, strength, measurements.",
      messagesDesc: "Chat with your coach.",
      settingsDesc: "Profile and preferences.",
      nutritionDesc: "Your meals for today.",
      yourTrainingWeek: "Your training week.",
      yourFitnessJourney: "Your fitness journey.",
      chatWithCoaches: "Chat with your coaches.",
      yourProfile: "Your profile.",
      noMealsAssigned: " • no meals assigned yet — your coach will set them up.",
      previewChat: " • preview data (connect Supabase for live chat)",
      emptyThreads: "No conversations yet — your coach will reach out.",
      previewSchedule: " • preview data (connect Supabase for live schedule)",
      previewProgress: " • preview data (log metrics with your coach for live charts)",
    },
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
      users: "المستخدمون",
    },
    auth: { signIn: "تسجيل الدخول", signOut: "تسجيل الخروج", search: "ابحث…" },
    pages: {
      hey: "أهلاً",
      letsTrain: "— هيا نتدرب.",
      scheduleDesc: "تمارين ومواعيد هذا الأسبوع.",
      progressDesc: "الوزن والقوة والقياسات.",
      messagesDesc: "تحدث مع مدربك.",
      settingsDesc: "الملف الشخصي والتفضيلات.",
      nutritionDesc: "وجباتك لهذا اليوم.",
      yourTrainingWeek: "أسبوعك التدريبي.",
      yourFitnessJourney: "رحلة لياقتك.",
      chatWithCoaches: "تحدث مع مدربيك.",
      yourProfile: "ملفك الشخصي.",
      noMealsAssigned: " • لا وجبات بعد — سيجهزها مدربك.",
      previewChat: " • بيانات تجريبية (اتصل بقاعدة البيانات للمحادثة المباشرة)",
      emptyThreads: "لا محادثات بعد — سيتواصل معك مدربك.",
      previewSchedule: " • بيانات تجريبية (اتصل بقاعدة البيانات للبث المباشر)",
      previewProgress: " • بيانات تجريبية (سجل القياسات مع مدربك للرسوم المباشرة)",
    },
  },
} satisfies Record<Locale, unknown>;

export type Dict = (typeof dict)["en"];

export function dictionary(locale: Locale): Dict {
  return dict[locale] as Dict;
}
