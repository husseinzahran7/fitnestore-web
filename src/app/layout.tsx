import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-ink-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
