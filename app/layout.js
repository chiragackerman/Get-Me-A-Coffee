import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

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
  title: "Get Me A Coffee - Fund your projects with a cup of coffee",
  description: "Get Me A Coffee is a platfofrm that allows you to fund your projects with a cup of coffee. You can support your favorite creators by buying them a coffee.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={` ${crimsonPro.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><Navbar/>{children}<Footer/></body>
    </html>
  );
}
