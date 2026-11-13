import CreatorExplorer from "@/Components/CreatorExplorer";

export const metadata = {
  title: "Explore Creators | Get Me A Coffee",
  description: "Discover independent creators and support their work with a coffee.",
};

export default async function CreatorsPage({ searchParams }) {
  const { focus } = await searchParams;

  return (
    <main className="min-h-full flex-1 bg-latte px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-caramel">
            Discover independent creators
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-espresso sm:text-5xl">
            Explore Creators
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-mocha sm:text-lg">
            Find inspiring people, learn about their work, and support the ideas they bring to life.
          </p>
        </div>

        <CreatorExplorer focusSearch={focus === "search"} />
      </div>
    </main>
  );
}
