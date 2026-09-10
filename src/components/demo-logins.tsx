"use client";

import { useState } from "react";

const ACCOUNTS = [
  {
    role: "Client",
    email: "gymers.test.user@gmail.com",
    goes: "Dashboard, schedule, progress, messages, settings",
  },
  {
    role: "Coach",
    email: "gymers.test.coach@gmail.com",
    goes: "Roster, schedule, nutrition, messages, progress, profile",
  },
  {
    role: "Admin",
    email: "gymers.test.admin@gmail.com",
    goes: "Coaches approvals, policies, settings",
  },
];

const PASSWORD = "Test1234!";

export default function DemoLogins() {
  const [copied, setCopied] = useState<string | null>(null);
  // Test-account panel stays hidden unless explicitly enabled.
  // Set NEXT_PUBLIC_SHOW_DEMO_LOGINS=true in .env.local for local QA
  // or preview deploys. Production login never advertises accounts.
  if (process.env.NEXT_PUBLIC_SHOW_DEMO_LOGINS !== "true") return null;

  const fill = (email: string) => {
    const emailEl = document.getElementById("email") as HTMLInputElement | null;
    const passEl = document.getElementById("password") as HTMLInputElement | null;
    if (emailEl) emailEl.value = email;
    if (passEl) passEl.value = PASSWORD;
    setCopied(null);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-dashed border-white/20 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
        Demo accounts — password <span className="text-slate-200">{PASSWORD}</span>
      </p>
      <div className="mt-3 space-y-2">
        {ACCOUNTS.map((a) => (
          <div
            key={a.role}
            className="flex flex-wrap items-center gap-2 rounded-xl bg-white/[0.04] p-3"
          >
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold">{a.role}</div>
              <button
                type="button"
                onClick={() => copy(a.email)}
                title="Copy email"
                className="block max-w-full truncate font-mono text-xs text-brand-400 hover:text-brand-500"
              >
                {a.email}
              </button>
              <div className="text-[11px] text-slate-500">{a.goes}</div>
            </div>
            <button
              type="button"
              onClick={() => fill(a.email)}
              className="shrink-0 rounded-full bg-brand-500/20 px-4 py-1.5 text-xs font-bold text-brand-400 transition-colors hover:bg-brand-500/30"
            >
              Fill
            </button>
          </div>
        ))}
      </div>
      {copied && (
        <p role="status" className="mt-2 text-xs text-green-400">
          Copied.
        </p>
      )}
    </div>
  );
}
