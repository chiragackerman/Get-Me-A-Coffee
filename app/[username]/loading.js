export default function CreatorProfileLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading creator profile"
        className="flex flex-1 items-stretch bg-cream px-4 py-5 sm:px-6 sm:py-7 lg:px-[clamp(2rem,3vw,3.5rem)] lg:py-[clamp(1.5rem,3vh,2.5rem)]"
    >
      <div className="grid w-full grid-cols-1 gap-5">
        <div className="grid min-w-0 gap-5">
          <div className="flex min-h-[15rem] animate-pulse items-center justify-center gap-6 rounded-2xl border border-coffee-border bg-latte sm:min-h-[12.5rem]">
            <div className="h-28 w-28 rounded-full border-4 border-warm-white bg-soft-latte sm:h-32 sm:w-32" />
            <div>
              <div className="h-9 w-48 rounded-lg bg-soft-latte" />
              <div className="mt-3 h-5 w-32 rounded-lg bg-soft-latte" />
              <div className="mt-3 h-9 w-52 rounded-full bg-soft-latte" />
            </div>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <div className="h-64 animate-pulse rounded-2xl border border-coffee-border bg-warm-white" />
            <div className="h-64 animate-pulse rounded-2xl border border-coffee-border bg-warm-white" />
        </div>
          <div className="h-28 animate-pulse rounded-2xl border border-coffee-border bg-latte" />
        </div>
      </div>
      </main>
    );
}
