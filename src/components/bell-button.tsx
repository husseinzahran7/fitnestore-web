"use client";

import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";

export default function BellButton() {
  const [count, setCount] = useState(0);
  const [href, setHref] = useState("/");

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => (r.ok ? r.json() : { count: 0, href: "/" }))
      .then((d) => {
        setCount(Number(d.count ?? 0));
        setHref(String(d.href ?? "/"));
      })
      .catch(() => {});
  }, []);

  return (
    <a
      href={href}
      aria-label={count > 0 ? `Notifications (${count})` : "Notifications"}
      className="relative rounded-lg p-2 hover:bg-white/10"
    >
      <BellRing size={20} />
      {count > 0 && (
        <span className="absolute -end-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </a>
  );
}
