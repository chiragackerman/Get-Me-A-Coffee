import connectToDatabase from "@/server/db";
import CreatorProfile from "@/server/models/user";

const pageSize = 12;
const maxPage = 10000;
const sortOptions = {
  newest: { createdAt: -1, _id: -1 },
  oldest: { createdAt: 1, _id: 1 },
  "name-asc": { displayName: 1, _id: 1 },
  "name-desc": { displayName: -1, _id: -1 },
  "username-asc": { username: 1 },
  "username-desc": { username: -1 },
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request) {
  const searchParams = new URL(request.url).searchParams;
  const search = (searchParams.get("q") || "").trim();
  const sort = searchParams.get("sort") || "newest";
  const pageValue = searchParams.get("page") || "1";
  const page = Number(pageValue);

  if (search.length > 80) {
    return Response.json(
      { error: "Search text must be 80 characters or fewer." },
      { status: 400 },
    );
  }

  if (!Object.hasOwn(sortOptions, sort)) {
    return Response.json({ error: "Choose a valid sorting option." }, { status: 400 });
  }

  if (!/^[1-9]\d*$/.test(pageValue) || !Number.isSafeInteger(page) || page > maxPage) {
    return Response.json({ error: "Choose a valid page number." }, { status: 400 });
  }

  const filter = {
    username: { $type: "string", $ne: "" },
    displayName: { $type: "string", $ne: "" },
    profileImage: { $type: "string", $ne: "" },
    creatorCategory: { $type: "string", $ne: "" },
    description: { $type: "string", $ne: "" },
  };

  if (search) {
    const searchRegex = new RegExp(escapeRegExp(search), "i");
    filter.$or = [
      { displayName: searchRegex },
      { username: searchRegex },
    ];
  }

  try {
    await connectToDatabase();

    let creatorQuery = CreatorProfile.find(filter)
      .select("profileImage displayName username creatorCategory description createdAt")
      .sort(sortOptions[sort]);

    if (sort === "name-asc" || sort === "name-desc") {
      creatorQuery = creatorQuery.collation({ locale: "en", strength: 2 });
    }

    const records = await creatorQuery
      .skip((page - 1) * pageSize)
      .limit(pageSize + 1)
      .lean();

    const hasMore = records.length > pageSize;
    const creators = records.slice(0, pageSize).map((creator) => ({
      profileImage: creator.profileImage,
      displayName: creator.displayName,
      username: creator.username,
      creatorCategory: creator.creatorCategory,
      description: creator.description,
    }));

    return Response.json(
      { creators, page, pageSize, hasMore },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Could not retrieve creator profiles.", error);
    return Response.json(
      { error: "We couldn’t load creators right now. Please try again." },
      { status: 500 },
    );
  }
}
