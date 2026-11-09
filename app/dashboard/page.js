import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { authOptions } from "@/server/auth";
import connectToDatabase from "@/server/db";
import CreatorProfile from "@/server/models/user";
import DashboardClient from "./DashboardClient";

const supportedProviders = new Set(["google", "github"]);

function DashboardError() {
  return (
    <main className="flex flex-1 items-center justify-center bg-cream px-4 py-12">
      <section
        aria-labelledby="dashboard-error-title"
        className="w-full max-w-lg rounded-2xl border border-coffee-border bg-warm-white px-6 py-10 text-center shadow-md sm:px-10"
      >
        <h1
          id="dashboard-error-title"
          className="font-heading text-3xl font-bold text-espresso"
        >
          We couldn’t check your profile
        </h1>
        <p className="mt-4 leading-7 text-mocha">
          Please try again in a little while.
        </p>
        <Link
          className="mt-6 inline-flex rounded-full bg-coffee px-6 py-3 font-semibold text-warm-white transition-colors hover:bg-dark-roast"
          href="/dashboard"
        >
          Try again
        </Link>
      </section>
    </main>
  );
}

export default async function DashboardPage() {
  await connection();

  let session;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Could not verify the dashboard session.", error);
    return <DashboardError />;
  }

  if (!session?.user) {
    redirect("/signin");
  }

  const { id: authUserId, provider } = session.user;
  if (
    typeof authUserId !== "string"
    || !supportedProviders.has(provider)
    || !authUserId.startsWith(`${provider}:`)
    || authUserId.length === provider.length + 1
  ) {
    console.error("The dashboard session is missing a valid provider account ID.");
    return <DashboardError />;
  }

  let profile;
  try {
    await connectToDatabase();
    profile = await CreatorProfile.findOne({ authUserId })
      .select("username")
      .lean();
  } catch (error) {
    console.error("Could not look up the creator profile for the dashboard.", error);
    return <DashboardError />;
  }

  if (profile?.username) {
    redirect(`/${encodeURIComponent(profile.username)}`);
  }

  return <DashboardClient />;
}
