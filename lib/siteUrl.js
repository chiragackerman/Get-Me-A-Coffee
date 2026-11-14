import "server-only";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    if (process.env.NODE_ENV === "production" && process.env.VERCEL === "1") {
      throw new Error("Set NEXT_PUBLIC_SITE_URL to the production site origin.");
    }

    return "http://localhost:3000";
  }

  let url;
  try {
    url = new URL(configuredUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute URL.");
  }

  if (
    !["http:", "https:"].includes(url.protocol)
    || url.username
    || url.password
    || url.pathname !== "/"
    || url.search
    || url.hash
  ) {
    throw new Error("NEXT_PUBLIC_SITE_URL must contain only the site origin.");
  }

  if (process.env.NODE_ENV === "production") {
    const isLocalHost = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);

    if (
      url.hostname.endsWith(".example")
      || (url.protocol !== "https:" && !isLocalHost)
      || (process.env.VERCEL === "1" && isLocalHost)
    ) {
      throw new Error("NEXT_PUBLIC_SITE_URL must be the real HTTPS production origin.");
    }
  }

  return url.origin;
}
