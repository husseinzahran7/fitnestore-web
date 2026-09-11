"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import AuthLinks from "@/components/auth-links";
import LocaleToggle from "@/components/locale-toggle";
import { dictionary, type Dict, type Locale } from "@/lib/locale";

export default function SiteHeader({ locale = "en" }: { locale?: Locale }) {
  const [open, setOpen] = useState(false);
  const t: Dict = dictionary(locale);
  const links = [
    { label: t.site.navCoaches, href: "#coaches" },
    { label: t.site.navClients, href: "#clients" },
    { label: t.site.navPricing, href: "#pricing" },
    { label: t.site.findCoach, href: "/coaches" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="GYMers logo" className="h-9 w-9" />
          <span className="text-xl font-extrabold tracking-tight">
            GYM<span className="text-brand-500">ers</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <LocaleToggle current={locale} />
          <AuthLinks t={t} />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LocaleToggle current={locale} />
          <button
            className="rounded-lg p-2 text-slate-200 hover:bg-white/10"
            onClick={() => setOpen(!open)}
            aria-label={open ? t.site.closeMenu : t.site.openMenu}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-200 hover:bg-white/10"
                >
                  {l.label}
                </a>
              ))}
              <AuthLinks mobile t={t} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
