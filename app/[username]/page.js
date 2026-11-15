import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import JsonLd from "@/Components/JsonLd";
import { createPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/siteUrl";
import { authOptions } from "@/server/auth";
import connectToDatabase from "@/server/db";
import CreatorProfile from "@/server/models/user";
import ProfilePicture from "./ProfilePicture";
import ProfileNavigation from "./ProfileNavigation";
import PaymentPage from "@/Components/PaymentPage";

const getCreatorProfile = cache(async (username) => {
  await connectToDatabase();

  return CreatorProfile.findOne({ username })
    .select("authUserId profileImage displayName username creatorCategory description createdAt")
    .lean();
});

function getPublicProfileImage(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "/user_profile_icon.png";
  }

  const image = value.trim();
  try {
    const url = new URL(image);
    return url.protocol === "https:" ? url.toString() : "/user_profile_icon.png";
  } catch {
    return image.startsWith("/") && !image.startsWith("//")
      ? image
      : "/user_profile_icon.png";
  }
}

export async function generateMetadata({ params }) {
  const { username: routeUsername } = await params;
  const username = routeUsername.trim().toLowerCase();
  const path = `/${encodeURIComponent(username)}`;

  let profile;
  try {
    profile = await getCreatorProfile(username);
  } catch (error) {
    console.error(`Could not load SEO data for creator "${username}".`, error);
    return createPageMetadata({
      title: "Creator Profile",
      description: "View an independent creator on GetMeACoffee.",
      path,
      robots: { index: false, follow: false },
    });
  }

  if (!profile) {
    return createPageMetadata({
      title: "Creator Not Found",
      description: "This creator profile could not be found.",
      path,
      robots: { index: false, follow: false },
    });
  }

  const canonicalPath = `/${encodeURIComponent(profile.username)}`;
  const description = typeof profile.description === "string"
    ? profile.description.replace(/\s+/g, " ").trim().slice(0, 160)
    : "Discover and support this independent creator on GetMeACoffee.";
  const profileImage = getPublicProfileImage(profile.profileImage);
  const title = `${profile.displayName} on GetMeACoffee`;

  return {
    title: profile.displayName,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "profile",
      siteName: "GetMeACoffee",
      title,
      description,
      url: canonicalPath,
      images: [{ url: profileImage, alt: `${profile.displayName}'s profile picture` }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [profileImage],
    },
  };
}

function formatJoinDate(date) {
  if (!date) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function ProfileIcon({ type, className = "h-5 w-5" }) {
  const paths = {
    about: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),
    category: (
      <>
        <path d="M20 13 11 22 2 13l9-9h9z" />
        <circle cx="16" cy="8" r="1" />
      </>
    ),
    coffee: (
      <>
        <path d="M4 9h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
        <path d="M17 11h2a2 2 0 1 1 0 4h-2M7 3c0 1 1 1 1 2M12 2c0 1 1 1 1 2M4 22h15" />
      </>
    ),
    supporters: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 3 4.5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    creator: (
      <>
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[type]}
    </svg>
  );
}

export default async function CreatorProfilePage({ params }) {

  

  const { username: routeUsername } = await params;
  const username = routeUsername.trim().toLowerCase();
  let profile;

  try {
    profile = await getCreatorProfile(username);
  } catch (error) {
    console.error(`Could not load creator profile "${username}".`, error);

    return (
      <main className="flex flex-1 items-center justify-center bg-cream px-4 py-16">
        <section
          aria-labelledby="profile-error-title"
          className="w-full max-w-xl rounded-3xl border border-coffee-border bg-warm-white px-6 py-12 text-center shadow-lg sm:px-10"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-caramel">
            A little hiccup
          </p>
          <h1
            id="profile-error-title"
            className="mt-3 font-heading text-3xl font-bold text-espresso sm:text-4xl"
          >
            This profile isn’t available right now
          </h1>
          <p className="mt-4 leading-7 text-mocha">
            We couldn’t load this creator’s information. Please try again in a
            little while.
          </p>
          <Link
            className="mt-7 inline-flex rounded-full bg-coffee px-6 py-3 font-semibold text-warm-white transition-colors hover:bg-dark-roast"
            href={`/${encodeURIComponent(username)}`}
          >
            Try again
          </Link>
        </section>
      </main>
    );
  }

  if (!profile) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const isOwnProfile = session?.user?.id === profile.authUserId;
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/${encodeURIComponent(profile.username)}`;
  const profileImage = getPublicProfileImage(profile.profileImage);
  const profileStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${profile.displayName} on GetMeACoffee`,
    url: canonicalUrl,
    mainEntity: {
      "@type": "Person",
      name: profile.displayName,
      url: canonicalUrl,
      image: profileImage.startsWith("/")
        ? `${siteUrl}${profileImage}`
        : profileImage,
      description: profile.description,
      identifier: profile.username,
    },
  };

  return (
    <>
      <JsonLd data={profileStructuredData} />
      <main className="flex flex-1 items-stretch bg-cream px-3 py-4 sm:px-5 sm:py-6 lg:px-[clamp(2rem,3vw,3.5rem)] lg:py-[clamp(1.5rem,3vh,2.5rem)]">
        <div
          className={`grid w-full grid-cols-1 items-stretch gap-4 ${isOwnProfile
              ? "lg:flex-1 lg:grid-cols-[clamp(248px,18vw,360px)_minmax(0,1fr)]"
              : ""
            }`}
        >
          {isOwnProfile && <ProfileNavigation username={profile.username} />}

          <div className="grid min-w-0 gap-4 lg:flex lg:flex-col">
            <section className="relative isolate flex min-h-[15rem] items-center overflow-hidden rounded-2xl border border-coffee-border px-4 py-6 shadow-sm sm:min-h-[12.5rem] sm:px-8">
              <Image
                alt=""
                className="object-cover object-right sm:object-center"
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 75vw"
                src="/Cozy Coffee Banner.png"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-espresso/75 via-espresso/60 to-espresso/25"
              />

              <div className="relative z-10 flex w-full flex-col items-center gap-5 text-center sm:flex-row sm:gap-7 sm:text-left">
                <ProfilePicture
                  displayName={profile.displayName}
                  src={profile.profileImage}
                />
                <div className="min-w-0">
                  <h1 className="font-heading text-3xl font-bold text-warm-white drop-shadow sm:text-4xl">
                    {profile.displayName}
                  </h1>
                  <p className="mt-1 font-medium text-warm-white/90">
                    @{profile.username}
                  </p>
                  <p className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-warm-white/30 bg-warm-white/75 px-4 py-2 text-sm font-semibold text-espresso shadow-sm backdrop-blur-sm">
                    <ProfileIcon className="h-4 w-4 shrink-0 text-coffee" type="category" />
                    <span className="truncate">{profile.creatorCategory}</span>
                  </p>
                </div>
              </div>
            </section>

            {!isOwnProfile && (
              <PaymentPage
                creatorUsername={profile.username}
                isAuthenticated={Boolean(session?.user?.id)}
                isTestMode={process.env.KEY_ID?.startsWith("rzp_test_") ?? false}
              />
            )}

            <div className="grid h-fit gap-4 xl:grid-cols-[1.15fr_1fr]">
              <section className="order-2 rounded-2xl border border-coffee-border bg-warm-white p-4 shadow-sm sm:p-6 xl:order-1 xl:p-7">
                <h2 className="flex items-center gap-3 font-heading text-2xl font-bold text-espresso">
                  <ProfileIcon className="h-5 w-5 text-coffee" type="about" />
                  About Me
                </h2>
                <p className="mt-4 min-h-20 whitespace-pre-wrap text-[15px] leading-7 text-espresso/90">
                  {profile.description}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 border-t border-coffee-border pt-5 sm:grid-cols-3">
                  <div className="flex gap-2 sm:gap-3">
                    <ProfileIcon className="mt-0.5 h-5 w-5 shrink-0 text-coffee" type="supporters" />
                    <div>
                      <p className="font-semibold text-espresso">-</p>
                      <p className="mt-1 text-sm text-mocha">Supporters</p>
                    </div>
                  </div>
                  <div className="flex gap-2 border-t border-coffee-border pt-4 sm:border-l sm:border-t-0 sm:px-3 sm:pt-0 sm:pl-5">
                    <ProfileIcon className="mt-0.5 h-5 w-5 shrink-0 text-coffee" type="coffee" />
                    <div>
                      <p className="font-semibold text-espresso">-</p>
                      <p className="mt-1 text-sm text-mocha">Coffees</p>
                    </div>
                  </div>
                  <div className="flex gap-2 border-t border-coffee-border pt-4 sm:border-l sm:border-t-0 sm:px-3 sm:pt-0 sm:pl-5">
                    <ProfileIcon className="mt-0.5 h-5 w-5 shrink-0 text-coffee" type="calendar" />
                    <div>
                      <p className="font-semibold text-espresso">Joined</p>
                      <p className="mt-1 text-sm text-mocha">
                        {formatJoinDate(profile.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="order-1 rounded-2xl border border-coffee-border bg-warm-white p-4 shadow-sm sm:p-6 xl:order-2 xl:p-7">
                <h2 className="flex items-center gap-3 font-heading text-2xl font-bold text-espresso">
                  <ProfileIcon className="h-5 w-5 text-caramel" type="creator" />
                  Creator Info
                </h2>
                <dl className="mt-5 space-y-5">
                  <div className="grid grid-cols-[minmax(5.5rem,0.7fr)_minmax(0,1.3fr)] gap-3 text-sm sm:text-base">
                    <dt className="flex items-start gap-2 text-mocha">
                      <ProfileIcon className="mt-0.5 h-4 w-4 shrink-0" type="category" />
                      Category
                    </dt>
                    <dd className="font-medium text-espresso">{profile.creatorCategory}</dd>
                  </div>
                  <div className="grid grid-cols-[minmax(5.5rem,0.7fr)_minmax(0,1.3fr)] gap-3 text-sm sm:text-base">
                    <dt className="flex items-start gap-2 text-mocha">
                      <ProfileIcon className="mt-0.5 h-4 w-4 shrink-0" type="about" />
                      Username
                    </dt>
                    <dd className="break-all font-medium text-espresso">@{profile.username}</dd>
                  </div>
                  <div className="grid grid-cols-[minmax(5.5rem,0.7fr)_minmax(0,1.3fr)] gap-3 text-sm sm:text-base">
                    <dt className="flex items-start gap-2 text-mocha">
                      <ProfileIcon className="mt-0.5 h-4 w-4 shrink-0" type="calendar" />
                      Joined
                    </dt>
                    <dd className="font-medium text-espresso">
                      {formatJoinDate(profile.createdAt)}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>

            <section className="flex flex-col  items-center gap-5 rounded-2xl border border-latte bg-latte px-6 py-5 sm:flex-row sm:justify-between sm:px-8">
              <div className="flex items-center gap-5 text-center sm:text-left">
                <Image
                  alt=""
                  className="h-14 w-14 object-contain"
                  height={56}
                  src="/support.png"
                  width={56}
                />
                <div className="border-l border-coffee/40 pl-5">
                  <h2 className="font-heading text-xl font-bold text-espresso">
                    Support My Work
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-mocha">
                    Your support helps me create more amazing content!
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
