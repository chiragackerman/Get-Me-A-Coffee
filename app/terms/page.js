import Link from "next/link";
import InfoPageShell from "@/Components/InfoPageShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Read the terms for using GetMeACoffee, creating a profile, and supporting creators.",
  path: "/terms",
});

const sections = [
  {
    title: "Accepting these terms",
    paragraphs: [
      "By using GetMeACoffee, you agree to these terms. If you do not agree, please do not use the site.",
    ],
  },
  {
    title: "What the platform does",
    paragraphs: [
      "GetMeACoffee helps independent creators share a public profile and receive voluntary support through virtual coffee purchases. A virtual coffee is a way to support a creator; it is not a physical product.",
    ],
  },
  {
    title: "Accounts and creator profiles",
    paragraphs: [
      "You are responsible for using an account you are authorized to access and for keeping your sign-in access private. Provide accurate information when creating or updating a creator profile.",
      "You are responsible for the content you publish and should only upload or share material you have the right to use. Public profile details can be viewed by visitors to the site.",
    ],
  },
  {
    title: "Coffee purchases and payment processing",
    paragraphs: [
      "The coffee quantity and total price are shown before checkout. Payments are processed through Razorpay and are subject to its checkout terms and the rules of your payment provider.",
      "A checkout attempt may remain pending or fail. A payment is treated as complete on GetMeACoffee after the payment has been verified and captured. The site stores order and payment metadata to record the result.",
    ],
  },
  {
    title: "Refunds and payment issues",
    paragraphs: [
      "GetMeACoffee currently has no self-service refund feature and these terms do not promise that a payment will be refunded. If you believe a payment was incorrect or duplicated, contact us with the Razorpay order ID. You may also contact your payment provider about its dispute process.",
    ],
  },
  {
    title: "Prohibited use",
    paragraphs: [
      "Do not use the platform to impersonate someone, publish unlawful or misleading content, interfere with the site, abuse payment flows, or violate another person’s rights.",
    ],
  },
  {
    title: "Availability and changes",
    paragraphs: [
      "We may update, change, or temporarily suspend parts of the site. We do not promise uninterrupted availability. We may update these terms; the current version will be posted on this page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <InfoPageShell
      description="Please read these terms to understand the basic rules for using GetMeACoffee."
      eyebrow="Using the platform"
      title="Terms of Service"
    >
      <div className="space-y-4">
        {sections.map((section) => (
          <section
            className="rounded-3xl border border-coffee-border bg-warm-white p-6 shadow-sm sm:p-8"
            key={section.title}
          >
            <h2 className="font-heading text-xl font-bold text-espresso sm:text-2xl">
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p className="mt-3 leading-7 text-mocha" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
      <section className="rounded-3xl border border-coffee-border bg-warm-white p-6 text-center shadow-sm sm:p-8">
        <h2 className="font-heading text-xl font-bold text-espresso sm:text-2xl">
          Contact
        </h2>
        <p className="mt-3 leading-7 text-mocha">
          Questions about these terms? Email{" "}
          <a
            className="font-semibold text-coffee underline underline-offset-4 hover:text-dark-roast"
            href="mailto:chiragackerman1112@gmail.com"
          >
            chiragackerman1112@gmail.com
          </a>{" "}
          or visit our{" "}
          <Link
            className="font-semibold text-coffee underline underline-offset-4 hover:text-dark-roast"
            href="/contact"
          >
            contact page
          </Link>
          .
        </p>
      </section>
    </InfoPageShell>
  );
}
