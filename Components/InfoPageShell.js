import Footer from "@/Components/Footer";

export default function InfoPageShell({
  eyebrow,
  title,
  description,
  icon,
  children,
}) {
  return (
    <>
      <main className="flex-1 bg-cream px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <header className="rounded-3xl border border-coffee-border bg-warm-white px-6 py-9 text-center shadow-sm sm:px-10 sm:py-12">
            {icon && (
              <div
                aria-hidden="true"
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-latte text-4xl"
              >
                {icon}
              </div>
            )}
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-caramel">
              {eyebrow}
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-espresso sm:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-mocha sm:text-lg">
              {description}
            </p>
          </header>
          <div className="mt-7 space-y-6 sm:mt-8">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
