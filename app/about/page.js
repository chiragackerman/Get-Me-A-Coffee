import InfoPageShell from "@/Components/InfoPageShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Learn how GetMeACoffee helps independent creators receive support from the people who appreciate their work.",
  path: "/about",
});

const missionPoints = [
  {
    title: "Support independent creators",
    description:
      "Give creators a simple way to receive support from the people who value their work.",
  },
  {
    title: "Keep funding simple",
    description:
      "Make it easy for supporters to encourage creators with a virtual coffee.",
  },
  {
    title: "Grow a supportive community",
    description:
      "Bring creators and their audiences together around the work they care about.",
  },
  {
    title: "Help creativity continue",
    description:
      "Every contribution can help creators keep doing more of what they love.",
  },
];

const steps = [
  "Create your creator profile.",
  "Share your profile with your audience.",
  "Receive support through virtual coffee purchases.",
];

export default function AboutPage() {
  return (
    <InfoPageShell
      description="GetMeACoffee gives independent creators a simple way to receive support from the people who enjoy what they make."
      eyebrow="A place for creative work"
      icon="☕"
      title="A Little Coffee. A Big Difference."
    >
      <section className="rounded-3xl border border-coffee-border bg-warm-white p-6 shadow-sm sm:p-8">
        <h2 className="font-heading text-2xl font-bold text-espresso sm:text-3xl">
          Our Story
        </h2>
        <p className="mt-3 leading-7 text-mocha">
          GetMeACoffee was built to help creators, developers, designers,
          artists, and other independent makers receive support from people
          who appreciate their work. A virtual coffee is a small, simple way to
          say “keep going” to someone whose work makes a difference to you.
        </p>
      </section>

      <section
        aria-labelledby="our-mission-title"
        className="rounded-3xl border border-coffee-border bg-warm-white p-6 shadow-sm sm:p-8"
      >
        <div className="max-w-2xl">
          <h2
            className="font-heading text-2xl font-bold text-espresso sm:text-3xl"
            id="our-mission-title"
          >
            Our Mission
          </h2>
          <p className="mt-3 leading-7 text-mocha">
            We want to make it easier for independent creators to feel
            appreciated, find their community, and continue doing what they
            love.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {missionPoints.map((point) => (
            <article
              className="rounded-2xl border border-coffee-border bg-cream p-5"
              key={point.title}
            >
              <h3 className="font-semibold text-espresso">{point.title}</h3>
              <p className="mt-2 text-sm leading-6 text-mocha">
                {point.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="how-it-works-title"
        className="rounded-3xl border border-coffee-border bg-warm-white p-6 shadow-sm sm:p-8"
      >
        <h2
          className="font-heading text-2xl font-bold text-espresso sm:text-3xl"
          id="how-it-works-title"
        >
          How It Works
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              className="flex items-start gap-4 rounded-2xl bg-latte p-5"
              key={step}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coffee font-semibold text-warm-white">
                {index + 1}
              </span>
              <p className="pt-1 font-medium leading-6 text-espresso">{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </InfoPageShell>
  );
}
