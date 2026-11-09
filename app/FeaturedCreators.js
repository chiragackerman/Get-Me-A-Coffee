import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import connectToDatabase from "@/server/db";
import CreatorProfile from "@/server/models/user";

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
    .lean();
}

function CreatorCard({ creator }) {
  const profileUrl = `/${encodeURIComponent(creator.username)}`;

  return (
    <Link
      aria-label={`View ${creator.displayName}'s creator profile`}
      className="card1 block shrink-0"
      href={profileUrl}
    >
      <div className="relative h-[280px] w-[350px] rounded-2xl border border-[#E5D8C8] bg-[#FFF8EF] p-5 shadow-[0_8px_24px_rgba(111,78,55,0.08)]">
        <div className="flex items-center gap-3">
          <Image
            src={creator.profileImage || "/user_pofile_icon.png"}
            alt={creator.displayName}
            width={58}
            height={58}
            unoptimized
            className="h-[58px] w-[58px] rounded-full object-cover"
          />

          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold text-[#2B2118]">
              {creator.displayName}
            </h3>
            <p className="mt-0.5 truncate text-sm text-mocha">
              @{creator.username}
            </p>
          </div>
        </div>

        <div>
          <p className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-coffee-border bg-caramel/40 px-4 py-2 text-sm font-semibold text-espresso shadow-sm backdrop-blur-sm">
            
            <span className="truncate">{creator.creatorCategory}</span>
          </p>
        </div>

        <p className="mt-4 line-clamp-3 text-[14px] leading-6 text-mocha">
          {creator.description}
        </p>

        <div className="absolute bottom-3 w-[89%]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[13px] text-mocha">
              <span className="text-[20px]">☕</span>
              <span>0 coffees received</span>
            </div>

            <span className="cursor-pointer justify-end rounded-full bg-[#6F4E37] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#553A28] hover:shadow-md active:scale-95">
              Support
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
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
    <div className="content flex items-center justify-start gap-4 overflow-x-auto py-5">
      {creators.map((creator) => (
        <CreatorCard creator={creator} key={creator.username} />
      ))}
    </div>
  );
}
