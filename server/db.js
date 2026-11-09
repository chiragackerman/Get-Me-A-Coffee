import "server-only";
import mongoose from "mongoose";
import CreatorProfile from "@/server/models/user";
import SignedInUser from "@/server/models/signedInUser";

const DATABASE_NAME = "GetMeACoffee";
const COLLECTIONS = ["users", "signed_in_users", "transactions"];
const NAMESPACE_EXISTS = 48;

const cached = globalThis.mongooseCache || {
  connection: null,
  promise: null,
};

globalThis.mongooseCache = cached;

async function ensureCollections(db) {
  const existingCollections = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray())
      .map((collection) => collection.name),
  );

  for (const collectionName of COLLECTIONS) {
    if (!existingCollections.has(collectionName)) {
      try {
        await db.createCollection(collectionName);
      } catch (error) {
        if (error.code !== NAMESPACE_EXISTS) {
          throw error;
        }
      }
    }
  }

  await Promise.all([CreatorProfile.init(), SignedInUser.init()]);
}

export default async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (cached.connection && mongoose.connection.readyState === 1) {
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, { dbName: DATABASE_NAME })
      .then(async (connection) => {
        await ensureCollections(connection.connection.db);
        cached.connection = connection;
        return connection;
      })
      .catch((error) => {
        cached.connection = null;
        cached.promise = null;
        throw error;
      });
  }

  return cached.promise;
}
