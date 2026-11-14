export function SkeletonBlock({ className = "" }) {
  return <div aria-hidden="true" className={`coffee-skeleton ${className}`} />;
}

export function CreatorCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative h-[280px] w-full max-w-[350px] shrink-0 rounded-2xl border border-coffee-border bg-warm-white p-5 shadow-[0_8px_24px_rgba(111,78,55,0.08)]"
    >
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-[58px] w-[58px] shrink-0 rounded-full" />
        <div className="min-w-0 flex-1">
          <SkeletonBlock className="h-6 w-3/4 rounded-lg" />
          <SkeletonBlock className="mt-2 h-4 w-1/2 rounded-lg" />
        </div>
      </div>
      <SkeletonBlock className="mt-4 h-9 w-36 rounded-full" />
      <SkeletonBlock className="mt-4 h-4 w-full rounded-md" />
      <SkeletonBlock className="mt-2 h-4 w-11/12 rounded-md" />
      <SkeletonBlock className="mt-2 h-4 w-2/3 rounded-md" />
      <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-3">
        <SkeletonBlock className="h-5 w-32 rounded-md" />
        <SkeletonBlock className="h-10 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function CreatorGridSkeleton({ count = 12, className = "" }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading creators"
      className={`grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
      role="status"
    >
      {Array.from({ length: count }, (_, index) => (
        <CreatorCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Checking your profile"
      className="flex flex-1 items-center justify-center bg-cream px-4 py-12"
    >
      <section
        aria-label="Loading dashboard"
        className="w-full max-w-lg rounded-2xl border border-coffee-border bg-warm-white px-6 py-10 text-center shadow-md sm:px-10"
        role="status"
      >
        <SkeletonBlock className="mx-auto h-28 w-28 rounded-full" />
        <SkeletonBlock className="mx-auto mt-6 h-9 w-64 max-w-full rounded-lg" />
        <div className="mt-6 flex flex-col items-center gap-3">
          <SkeletonBlock className="h-12 w-40 rounded-full" />
          <SkeletonBlock className="h-12 w-28 rounded-full" />
        </div>
      </section>
    </main>
  );
}
