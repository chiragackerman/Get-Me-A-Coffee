import InfoPageShell from "@/Components/InfoPageShell";

export const metadata = {
  title: "Privacy Policy | GetMeACoffee",
  description:
    "Read how GetMeACoffee handles account, creator profile, session, and payment information.",
};

const sections = [
  {
    title: "Information from Google and GitHub sign-in",
    paragraphs: [
      "When you sign in with Google or GitHub, the provider shares basic account information with us, such as your provider account identifier, name, profile image, and email address when available. We use this information to recognize your account and provide sign-in.",
      "We do not ask for or store your Google or GitHub password. Sign-in is handled through the provider and NextAuth session flow.",
    ],
  },
  {
    title: "Creator profile information",
    paragraphs: [
      "If you create a creator profile, we store the profile details you submit, including your display name, username, email address, profile image, creator category, and description.",
      "Your display name, username, profile image, category, and description are shown publicly on your creator profile and in creator listings. Please do not include private or sensitive information in public profile fields.",
    ],
  },
  {
    title: "How information is stored",
    paragraphs: [
      "Account, profile, and payment-record information is stored in the MongoDB database used by GetMeACoffee. Authentication sessions are managed through NextAuth and its session cookies.",
      "Public creator listings return profile fields needed to display creator cards and do not include account email addresses or authentication identifiers.",
    ],
  },
  {
    title: "Payments through Razorpay",
    paragraphs: [
      "Payments are presented through Razorpay Checkout. Payment card details, UPI PINs, and bank login credentials are handled by Razorpay and are not directly stored by GetMeACoffee.",
      "To track checkout and confirmed payments, our database stores payment-related metadata such as the amount, coffee quantity, creator username, Razorpay order and payment identifiers, payment method, status, and capture time. Email address or phone number returned by Razorpay may also be stored with a payment record.",
    ],
  },
  {
    title: "Cookies and authentication sessions",
    paragraphs: [
      "The site uses NextAuth session cookies to keep you signed in and to support authentication flows. These cookies help the site recognize your session; signing out ends the active session through the authentication system.",
    ],
  },
  {
    title: "Privacy questions",
    paragraphs: [
      "If you have a question or concern about information associated with your account or creator profile, contact us at chiragackerman1112@gmail.com. Avoid sending passwords, payment credentials, or other sensitive information by email.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <InfoPageShell
      description="This page explains what information is used when you sign in, create a profile, or support a creator."
      eyebrow="Your information"
      title="Privacy Policy"
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
    </InfoPageShell>
  );
}
