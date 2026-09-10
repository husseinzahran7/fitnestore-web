"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Smartphone } from "lucide-react";

const Hero3D = dynamic(() => import("./hero-3d"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] w-full animate-pulse rounded-3xl bg-white/5 sm:h-[420px] lg:h-[520px]" />
  ),
});

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stats = [
  { value: "1 app", label: "for every coach" },
  { value: "360°", label: "client tracking" },
  { value: "0", label: "spreadsheets needed" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_20%,rgba(0,128,255,0.22),transparent),radial-gradient(ellipse_40%_35%_at_15%_80%,rgba(0,128,255,0.1),transparent)]"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:pt-20">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-400">
              <Smartphone size={14} />
              Installable PWA
            </span>
          </motion.div>
          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Every coach.
            <br />
            Every client.
            <br />
            <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              One gym app.
            </span>
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400"
          >
            GYMers gives coaches a home for client programs, nutrition plans,
            messaging, and progress — and gives clients their plan in their
            pocket. No spreadsheets, no chaos.
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.a
              href="/register"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-brand-500/30 transition-colors hover:bg-brand-400"
            >
              Start coaching free
              <ArrowRight size={18} className="rtl:-scale-x-100" />
            </motion.a>
            <motion.a
              href="#coaches"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              See how it works
            </motion.a>
          </motion.div>
          <motion.dl
            variants={item}
            className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-extrabold text-white">{s.value}</dd>
                <dd className="mt-1 text-xs text-slate-400">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
        >
          <Hero3D />
        </motion.div>
      </div>
    </section>
  );
}
