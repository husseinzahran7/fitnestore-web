"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyIdButton({ id, label = "Copy full ID" }: { id: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      // Clipboard API unavailable (permissions/HTTP) — select fallback.
      const ta = document.createElement("textarea");
      ta.value = id;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "ID copied" : label}
      title={copied ? "Copied" : label}
      className="shrink-0 rounded-md p-1 text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
    >
      {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
    </button>
  );
}
