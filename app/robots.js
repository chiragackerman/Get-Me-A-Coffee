import { connection } from "next/server";
import { getSiteUrl } from "@/lib/siteUrl";

export default async function robots() {
  await connection();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
