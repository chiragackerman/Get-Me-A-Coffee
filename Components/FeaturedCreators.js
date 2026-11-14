import { connection } from "next/server";
import connectToDatabase from "@/server/db";
import CreatorProfile from "@/server/models/user";
import CreatorCard from "@/Components/CreatorCard";

async function getFeaturedCreators() {
  await connectToDatabase();

  return CreatorProfile.find({
    username: { $type: "string", $ne: "" },
    displayName: { $type: "string", $ne: "" },
    profileImage: { $type: "string", $ne: "" },
    creatorCategory: { $type: "string", $ne: "" },
    description: { $type: "string", $ne: "" },
  })
    .select("profileImage displayName username creatorCategory description")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
}

export default async function FeaturedCreators() {
  await connection();

  let creators;

  try {
    creators = await getFeaturedCreators();
  } catch (error) {
    console.error("Could not load featured creator profiles.", error);

    return (
      <div className="content py-5">
        <section className="rounded-2xl border border-coffee-border bg-warm-white px-6 py-10 text-center shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-espresso">
            Creators are taking a coffee break
          </h2>
          <p className="mt-2 text-mocha">
            We couldn’t load creator profiles right now. Please try again later.
          </p>
        </section>
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="content py-5">
        <section className="rounded-2xl border border-coffee-border bg-warm-white px-6 py-10 text-center shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-espresso">
            Your next favorite creator is brewing
          </h2>
          <p className="mt-2 text-mocha">
            Check back soon to discover creators and support their work.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="content flex flex-wrap items-stretch justify-center gap-4 py-5 sm:justify-start">
      {creators.map((creator) => (
        <CreatorCard creator={creator} key={creator.username} />
      ))}
    </div>
  );
}
