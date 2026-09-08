export default function LoadingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="h-9 w-48 animate-pulse rounded-xl bg-white/10" />
      <div className="mt-2 h-4 w-64 animate-pulse rounded-lg bg-white/5" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>
    </div>
  );
}
