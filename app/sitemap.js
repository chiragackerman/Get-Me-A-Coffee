import { connection } from "next/server";
import connectToDatabase from "@/server/db";
import CreatorProfile from "@/server/models/user";
import { getSiteUrl } from "@/lib/siteUrl";

const staticPaths = [
  "",
  "/creators",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];
const maxCreatorUrls = 50000 - staticPaths.length;
const publicCreatorFilter = {
  username: {
    $type: "string",
    $ne: "",
    $regex: "^[a-z0-9_]{3,20}$",
  },
  displayName: { $type: "string", $ne: "" },
  profileImage: { $type: "string", $ne: "" },
  creatorCategory: { $type: "string", $ne: "" },
  description: { $type: "string", $ne: "" },
};

export default async function sitemap() {
  await connection();
  await connectToDatabase();

  const profiles = await CreatorProfile.find(publicCreatorFilter)
    .select("username updatedAt")
    .sort({ username: 1 })
    .limit(maxCreatorUrls + 1)
    .lean();

  if (profiles.length > maxCreatorUrls) {
    throw new Error(
      "The creator sitemap exceeds 50,000 URLs and must be split into multiple sitemaps.",
    );
  }

  const siteUrl = getSiteUrl();

  return [
    ...staticPaths.map((path) => ({
      url: `${siteUrl}${path}`,
    })),
    ...profiles.map((profile) => ({
      url: `${siteUrl}/${encodeURIComponent(profile.username)}`,
      ...(profile.updatedAt ? { lastModified: profile.updatedAt } : {}),
    })),
  ];
}
