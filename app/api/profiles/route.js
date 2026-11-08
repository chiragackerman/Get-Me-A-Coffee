import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import connectToDatabase from "@/server/db";
import CreatorProfile from "@/server/models/user";
import SignedInUser from "@/server/models/signedInUser";
import {
  deleteProfileImage,
  uploadProfileImage,
} from "@/server/cloudinary";

const fallbackProfileImage = "/user_pofile_icon.png";
const maxImageSize = 5 * 1024 * 1024;
const maxFormDataSize = maxImageSize + 64 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function normalizeUsername(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isValidUsername(username) {
  return /^[a-z0-9_]{3,20}$/.test(username);
}

function getProviderProfileImage(image) {
  if (typeof image !== "string" || !image.trim()) {
    return null;
  }

  try {
    const imageUrl = new URL(image);
    if (imageUrl.protocol === "https:" && imageUrl.hostname) {
      return image.trim();
    }
  } catch {
    return null;
  }

  return null;
}

function imageMatchesType(buffer, type) {
  if (type === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (type === "image/png") {
    return buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
  }

  return type === "image/webp"
    && buffer.toString("ascii", 0, 4) === "RIFF"
    && buffer.toString("ascii", 8, 12) === "WEBP";
}

function duplicateKeyResponse(error) {
  if (error.code !== 11000) {
    return null;
  }

  if (error.keyPattern?.username || error.keyValue?.username) {
    return Response.json(
      { code: "USERNAME_TAKEN", error: "That username is already taken." },
      { status: 409 },
    );
  }

  if (error.keyPattern?.authUserId || error.keyValue?.authUserId) {
    return Response.json(
      { code: "PROFILE_EXISTS", error: "You already have a creator profile." },
      { status: 409 },
    );
  }

  return Response.json(
    { error: "A profile with those details already exists." },
    { status: 409 },
  );
}

function apiError(message, status, code) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id || !user.provider || !["google", "github"].includes(user.provider)) {
    return null;
  }

  const providerPrefix = `${user.provider}:`;
  if (!user.id.startsWith(providerPrefix) || user.id.length === providerPrefix.length) {
    return null;
  }

  return user;
}

export async function GET(request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return Response.json({ error: "Sign in to check username availability." }, { status: 401 });
    }

    const username = normalizeUsername(
      new URL(request.url).searchParams.get("username"),
    );
    if (!isValidUsername(username)) {
      return Response.json(
        { error: "Use 3–20 letters, numbers, or underscores for your username." },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const existingProfile = await CreatorProfile.exists({ username });

    return Response.json({ available: !existingProfile });
  } catch (error) {
    console.error("Could not check creator username availability.", error);
    return Response.json(
      { error: "Could not check username availability. Please try again." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  let uploadedImage = null;

  try {
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser) {
      return Response.json({ error: "Sign in to create a creator profile." }, { status: 401 });
    }

    const email = authenticatedUser.email?.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Your Google or GitHub account must provide a valid email address." },
        { status: 400 },
      );
    }

    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > maxFormDataSize) {
      return Response.json(
        { error: "Profile form uploads must be 5 MB or smaller." },
        { status: 413 },
      );
    }

    let formData;
    try {
      formData = await request.formData();
    } catch {
      return Response.json(
        { error: "Submit the profile using a valid multipart form." },
        { status: 400 },
      );
    }

    const username = normalizeUsername(formData.get("username"));
    const providerProfileImage = getProviderProfileImage(authenticatedUser.image)
      || fallbackProfileImage;
    const submittedProfileImage = formData.get("profileImageUrl");

    if (
      typeof submittedProfileImage !== "string"
      || submittedProfileImage !== providerProfileImage
    ) {
      return Response.json(
        { error: "The profile image must match your signed-in account." },
        { status: 400 },
      );
    }

    const readTextField = (name) => {
      const value = formData.get(name);
      return typeof value === "string" ? value.trim() : null;
    };
    const displayName = readTextField("displayName");
    const creatorCategory = readTextField("creatorCategory");
    const description = readTextField("description");

    if (!isValidUsername(username)) {
      return Response.json(
        { error: "Use 3–20 letters, numbers, or underscores for your username." },
        { status: 400 },
      );
    }

    if (
      typeof displayName !== "string"
      || displayName.length < 3
      || displayName.length > 80
      || typeof creatorCategory !== "string"
      || creatorCategory.length < 2
      || creatorCategory.length > 80
      || typeof description !== "string"
      || description.length < 10
      || description.length > 1000
    ) {
      return Response.json(
        { error: "Enter a display name, category, and description within the allowed lengths." },
        { status: 400 },
      );
    }

    const file = formData.get("profileImage");
    let imageBuffer = null;

    if (typeof file === "string" && file.trim()) {
      return Response.json(
        { error: "Profile pictures must be uploaded as image files." },
        { status: 400 },
      );
    }

    if (file && typeof file !== "string") {
      if (file.size === 0 && file.name) {
        return Response.json(
          { error: "Choose a profile picture that is not empty." },
          { status: 400 },
        );
      }

      if (file.size > 0 && !allowedImageTypes.has(file.type)) {
        return Response.json(
          { error: "Choose a JPG, PNG, or WebP profile picture." },
          { status: 415 },
        );
      }

      if (file.size > maxImageSize) {
        return Response.json(
          { error: "Profile pictures must be 5 MB or smaller." },
          { status: 413 },
        );
      }

      if (file.size > 0) {
        imageBuffer = Buffer.from(await file.arrayBuffer());
      }

      if (imageBuffer && !imageMatchesType(imageBuffer, file.type)) {
        return Response.json(
          { error: "The selected file does not match its image type." },
          { status: 415 },
        );
      }
    }

    const connection = await connectToDatabase();

    if (imageBuffer) {
      const existingProfile = await CreatorProfile.exists({
        authUserId: authenticatedUser.id,
      });

      if (existingProfile) {
        return Response.json(
          { code: "PROFILE_EXISTS", error: "You already have a creator profile." },
          { status: 409 },
        );
      }

      const existingUsername = await CreatorProfile.exists({ username });
      if (existingUsername) {
        return Response.json(
          { code: "USERNAME_TAKEN", error: "That username is already taken." },
          { status: 409 },
        );
      }

      const providerAccountId = authenticatedUser.id.slice(
        authenticatedUser.provider.length + 1,
      );
      const signedInUserExists = await SignedInUser.exists({
        authUserId: authenticatedUser.id,
        provider: authenticatedUser.provider,
        providerAccountId,
      });

      if (!signedInUserExists) {
        return Response.json(
          {
            code: "SIGN_IN_RECORD_NOT_FOUND",
            error: "Your sign-in record could not be found. Sign out and sign in again before creating a profile.",
          },
          { status: 409 },
        );
      }

      uploadedImage = await uploadProfileImage(imageBuffer);
    }

    const databaseSession = await connection.startSession();
    let profile;

    try {
      await databaseSession.withTransaction(async () => {
        const existingProfile = await CreatorProfile.exists({
          authUserId: authenticatedUser.id,
        }).session(databaseSession);

        if (existingProfile) {
          throw apiError(
            "You already have a creator profile.",
            409,
            "PROFILE_EXISTS",
          );
        }

        const existingUsername = await CreatorProfile.exists({ username })
          .session(databaseSession);

        if (existingUsername) {
          throw apiError(
            "That username is already taken.",
            409,
            "USERNAME_TAKEN",
          );
        }

        const providerAccountId = authenticatedUser.id.slice(
          authenticatedUser.provider.length + 1,
        );
        const signedInUser = await SignedInUser.findOneAndUpdate(
          {
            authUserId: authenticatedUser.id,
            provider: authenticatedUser.provider,
            providerAccountId,
          },
          {
            $set: {
              name: authenticatedUser.name || null,
              email,
            },
          },
          {
            session: databaseSession,
            returnDocument: "after",
            runValidators: true,
          },
        );

        if (!signedInUser) {
          throw apiError(
            "Your sign-in record could not be found. Sign out and sign in again before creating a profile.",
            409,
            "SIGN_IN_RECORD_NOT_FOUND",
          );
        }

        const [createdProfile] = await CreatorProfile.create(
          [
            {
              authUserId: authenticatedUser.id,
              username,
              displayName,
              email,
              provider: authenticatedUser.provider,
              profileImage: uploadedImage?.secureUrl
                || providerProfileImage,
              cloudinaryPublicId: uploadedImage?.publicId || null,
              creatorCategory,
              description,
            },
          ],
          { session: databaseSession },
        );

        profile = createdProfile;
      });
    } finally {
      await databaseSession.endSession();
    }

    return Response.json(
      {
        profile: {
          username: profile.username,
          displayName: profile.displayName,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (uploadedImage?.publicId) {
      try {
        await deleteProfileImage(uploadedImage.publicId);
      } catch (cleanupError) {
        console.error("Could not remove an unclaimed Cloudinary upload.", cleanupError);
      }
    }

    const duplicateResponse = duplicateKeyResponse(error);
    if (duplicateResponse) {
      return duplicateResponse;
    }

    if (error.status) {
      return Response.json(
        { code: error.code, error: error.message },
        { status: error.status },
      );
    }

    if (error.name === "ValidationError") {
      console.error("Creator profile validation failed.", error);
      return Response.json(
        { error: error.message },
        { status: 400 },
      );
    }

    console.error("Could not create creator profile.", error);
    return Response.json(
      { error: "Could not create your profile. Please try again." },
      { status: 500 },
    );
  }
}
