import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import { getLocale } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GYMers — Coaching platform for gyms",
    template: "%s — GYMers",
  },
  description:
    "GYMers gives every coach a home for clients, workouts, nutrition, and progress. Installable on any phone.",
  applicationName: "GYMers",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GYMers",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "GYMers",
    title: "GYMers — Coaching platform for gyms",
    description:
      "Workouts, nutrition, messaging, and progress tracking for coaches and their clients.",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/icons/apple-touch-icon-180x180.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable}`}
    >
      <body className="min-h-screen bg-ink-950 font-sans text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
