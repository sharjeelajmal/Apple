import "server-only";
import { MongoClient } from "mongodb";
import { mongoConfig } from "@/config/env";

const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

export const mongoClient = globalForMongo.mongoClient ?? new MongoClient(mongoConfig.uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

export const db = mongoClient.db(mongoConfig.dbName);
