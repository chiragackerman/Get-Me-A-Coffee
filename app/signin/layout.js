import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Sign In",
  description: "Sign in to manage your GetMeACoffee creator profile.",
  path: "/signin",
  robots: { index: false, follow: false },
});

export default function SignInLayout({ children }) {
  return children;
}
