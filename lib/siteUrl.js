import "server-only";

const developmentUrl = "http://localhost:3000";

export function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL?.trim();

  if (!configuredUrl) {
    if (process.env.NODE_ENV === "development") {
      return developmentUrl;
    }

    throw new Error("Set SITE_URL to the deployed site origin.");
  }

  let url;
  try {
    url = new URL(configuredUrl);
  } catch {
    throw new Error("SITE_URL must be a valid absolute URL.");
  }

  if (
    !["http:", "https:"].includes(url.protocol)
    || url.username
    || url.password
    || url.pathname !== "/"
    || url.search
    || url.hash
  ) {
    throw new Error("SITE_URL must contain only the site origin.");
  }

  if (process.env.NODE_ENV === "production") {
    const isLocalHost = url.hostname === "localhost";

    if (
      url.hostname.endsWith(".example")
      || (url.protocol !== "https:" && !isLocalHost)
      || (process.env.VERCEL === "1" && isLocalHost)
    ) {
      throw new Error("SITE_URL must be the real HTTPS production origin.");
    }
  }

  return url.origin;
}
