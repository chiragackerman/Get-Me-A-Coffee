import { SkeletonBlock } from "@/Components/Skeletons";

export default function CreatorProfileLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading creator profile"
      className="flex flex-1 items-stretch bg-cream px-3 py-4 sm:px-5 sm:py-6 lg:px-[clamp(2rem,3vw,3.5rem)] lg:py-[clamp(1.5rem,3vh,2.5rem)]"
    >
      <div className="grid w-full grid-cols-1 items-stretch gap-4">
        <div className="grid min-w-0 gap-4 lg:flex lg:flex-col">
          <section className="flex min-h-[15rem] flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-coffee-border bg-latte px-4 py-6 sm:min-h-[12.5rem] sm:flex-row sm:justify-start sm:gap-7 sm:px-8">
            <SkeletonBlock className="h-28 w-28 shrink-0 rounded-full border-4 border-warm-white sm:h-32 sm:w-32" />
            <div className="flex w-full flex-col items-center sm:items-start">
              <SkeletonBlock className="h-9 w-48 max-w-full rounded-lg" />
              <SkeletonBlock className="mt-3 h-5 w-32 rounded-lg" />
              <SkeletonBlock className="mt-3 h-9 w-52 max-w-full rounded-full" />
            </div>
          </section>
          <section className="rounded-2xl border border-coffee-border bg-warm-white p-6 shadow-sm sm:p-7">
            <SkeletonBlock className="h-8 w-56 max-w-full rounded-lg" />
            <SkeletonBlock className="mt-2 h-5 w-72 max-w-full rounded-lg" />
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SkeletonBlock className="h-10 w-40 rounded-lg" />
              <SkeletonBlock className="h-12 w-36 rounded-full" />
            </div>
          </section>
          <div className="grid h-fit gap-4 xl:grid-cols-[1.15fr_1fr]">
            <section className="order-2 rounded-2xl border border-coffee-border bg-warm-white p-4 shadow-sm sm:p-6 xl:order-1 xl:p-7">
              <SkeletonBlock className="h-8 w-36 rounded-lg" />
              <SkeletonBlock className="mt-5 h-4 w-full rounded-md" />
              <SkeletonBlock className="mt-2 h-4 w-full rounded-md" />
              <SkeletonBlock className="mt-2 h-4 w-4/5 rounded-md" />
              <div className="mt-6 grid grid-cols-1 gap-4 border-t border-coffee-border pt-5 sm:grid-cols-3">
                <SkeletonBlock className="h-12 rounded-lg" />
                <SkeletonBlock className="h-12 rounded-lg" />
                <SkeletonBlock className="h-12 rounded-lg" />
              </div>
            </section>
            <section className="order-1 rounded-2xl border border-coffee-border bg-warm-white p-4 shadow-sm sm:p-6 xl:order-2 xl:p-7">
              <SkeletonBlock className="h-8 w-40 rounded-lg" />
              <div className="mt-5 space-y-5">
                <SkeletonBlock className="h-5 w-full rounded-md" />
                <SkeletonBlock className="h-5 w-full rounded-md" />
                <SkeletonBlock className="h-5 w-4/5 rounded-md" />
              </div>
            </section>
          </div>
          <section className="flex min-h-28 items-center gap-5 rounded-2xl border border-latte bg-latte px-6 py-5 sm:px-8">
            <SkeletonBlock className="h-14 w-14 shrink-0 rounded-xl" />
            <div className="flex-1 border-l border-coffee/40 pl-5">
              <SkeletonBlock className="h-6 w-40 rounded-lg" />
              <SkeletonBlock className="mt-2 h-4 w-full max-w-sm rounded-md" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
