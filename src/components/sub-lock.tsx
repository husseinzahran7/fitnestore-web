import Link from "next/link";

export default function SubLock({
  title,
  body,
  renewLabel,
  appLabel,
  soloNote,
}: {
  title: string;
  body: string;
  renewLabel: string;
  appLabel: string;
  soloNote: string;
}) {
  return (
    <div className="rounded-2xl border border-orange-500/30 bg-orange-500/[0.07] p-6 text-center sm:p-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/15 text-xl">
        🔒
      </div>
      <h2 className="mt-4 text-xl font-extrabold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">{body}</p>
      <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
        <Link
          href="/coaches"
          className="rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-400"
        >
          {renewLabel}
        </Link>
        <Link
          href="/pricing"
          className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
        >
          {appLabel}
        </Link>
      </div>
      <p className="mt-4 text-xs text-slate-500">{soloNote}</p>
    </div>
  );
}
