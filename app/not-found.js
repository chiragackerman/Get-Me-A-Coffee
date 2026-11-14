import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-cream px-4 py-16">
      <section className="w-full max-w-xl rounded-3xl border border-coffee-border bg-warm-white px-6 py-12 text-center shadow-lg sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-caramel">
          404
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-espresso sm:text-4xl">
          We couldn’t find that page
        </h1>
        <p className="mt-4 leading-7 text-mocha">
          The page may have moved, or the address may be incorrect.
        </p>
        <Link
          className="mt-7 inline-flex rounded-full bg-coffee px-6 py-3 font-semibold text-warm-white transition-colors hover:bg-dark-roast"
          href="/"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
}
