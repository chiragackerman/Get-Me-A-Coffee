import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/Components/SessionWrapper";

import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import NavigationScrollManager from "@/Components/NavigationScrollManager";
import { getSiteUrl } from "@/lib/siteUrl";

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "GetMeACoffee | Support Independent Creators",
    template: "%s | GetMeACoffee",
  },
  applicationName: "GetMeACoffee",
  description:
    "Discover independent creators and support their work with a virtual coffee on GetMeACoffee.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "GetMeACoffee",
    title: "GetMeACoffee | Support Independent Creators",
    description:
      "Discover independent creators and support their work with a virtual coffee on GetMeACoffee.",
    images: [
      {
        url: "/opengraph-image",
        alt: "GetMeACoffee - Support independent creators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GetMeACoffee | Support Independent Creators",
    description:
      "Discover independent creators and support their work with a virtual coffee on GetMeACoffee.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  themeColor: "#f8ecd9",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={` ${crimsonPro.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionWrapper>
          <NavigationScrollManager />
          <Navbar />
          {children}
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
