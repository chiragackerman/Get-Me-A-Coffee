import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import connectToDatabase from "@/server/db";
import SignedInUser from "@/server/models/signedInUser";

const supportedProviders = new Set(["google", "github"]);
const authSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

if (!authSecret) {
  throw new Error(
    "Set NEXTAUTH_SECRET (or AUTH_SECRET) to the same stable secret for NextAuth and server-side session verification.",
  );
}

export function getStableAuthUserId(provider, providerAccountId) {
  return `${provider}:${providerAccountId}`;
}

export const authOptions = {
  secret: authSecret,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (
        !account
        || !supportedProviders.has(account.provider)
        || !account.providerAccountId
      ) {
        return false;
      }

      await connectToDatabase();

      const signedInAt = new Date();
      const authUserId = getStableAuthUserId(
        account.provider,
        account.providerAccountId,
      );

      await SignedInUser.findOneAndUpdate(
        { authUserId },
        {
          $set: {
            provider: account.provider,
            providerAccountId: String(account.providerAccountId),
            name: user.name || null,
            email: typeof user.email === "string"
              ? user.email.trim().toLowerCase() || null
              : null,
            profileImage: user.image || "/user_pofile_icon.png",
            lastSignInAt: signedInAt,
          },
          $setOnInsert: {
            authUserId,
            firstSignInAt: signedInAt,
          },
          $inc: { signInCount: 1 },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: false,
        },
      );

      return true;
    },
    async jwt({ token, account }) {
      if (
        account
        && supportedProviders.has(account.provider)
        && account.providerAccountId
      ) {
        token.sub = getStableAuthUserId(
          account.provider,
          account.providerAccountId,
        );
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.provider = token.provider;
      }

      return session;
    },
  },
};
