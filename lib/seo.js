const siteName = "GetMeACoffee";
const defaultImage = "/opengraph-image";

export function createPageMetadata({
  title,
  description,
  path,
  robots,
  absoluteTitle,
}) {
  const fullTitle = absoluteTitle || `${title} | ${siteName}`;

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName,
      title: fullTitle,
      description,
      url: path,
      images: [{ url: defaultImage, alt: "GetMeACoffee - Support independent creators" }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [defaultImage],
    },
    ...(robots ? { robots } : {}),
  };
}
