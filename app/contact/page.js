import Link from "next/link";
import InfoPageShell from "@/Components/InfoPageShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Get in touch with GetMeACoffee by email or Instagram with a question, suggestion, or collaboration idea.",
  path: "/contact",
});

function ContactIcon({ type }) {
  if (type === "email") {
    return (
      <svg
        aria-hidden="true"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        viewBox="0 0 24 24"
      >
        <rect height="16" rx="2" width="20" x="2" y="4" />
        <path d="m22 7-10 6L2 7" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <rect height="20" rx="5" width="20" x="2" y="2" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="18" cy="6" fill="currentColor" r="1" stroke="none" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <InfoPageShell
      description="Have a question, suggestion, or collaboration idea? We'd love to hear from you."
      eyebrow="We'd love to hear from you"
      title="Let's Get in Touch."
    >
      <section
        aria-label="Contact information"
        className="mx-auto grid max-w-3xl gap-4 rounded-3xl border border-coffee-border bg-warm-white p-5 shadow-sm sm:grid-cols-2 sm:p-8"
      >
        <a
          className="flex min-w-0 items-center gap-4 rounded-2xl border border-coffee-border bg-cream p-5 transition-colors hover:bg-latte focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee"
          href="mailto:chiragackerman1112@gmail.com"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-coffee text-warm-white">
            <ContactIcon type="email" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-mocha">Email</span>
            <span className="mt-1 block break-all font-semibold text-espresso">
              chiragackerman1112@gmail.com
            </span>
          </span>
        </a>
        <Link
          className="flex min-w-0 items-center gap-4 rounded-2xl border border-coffee-border bg-cream p-5 transition-colors hover:bg-latte focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee"
          href="https://www.instagram.com/chirag.ackerman/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-coffee text-warm-white">
            <ContactIcon type="instagram" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-mocha">
              Instagram
            </span>
            <span className="mt-1 block font-semibold text-espresso">
              @chirag.ackerman
            </span>
          </span>
        </Link>
      </section>

      <p className="mx-auto max-w-3xl rounded-2xl border border-coffee-border bg-latte px-6 py-5 text-center leading-7 text-espresso">
        Whether you&apos;re a creator looking for support, someone interested in
        collaborating, or simply have something to share, feel free to reach
        out.
      </p>
    </InfoPageShell>
  );
}
