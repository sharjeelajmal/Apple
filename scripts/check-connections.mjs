import { readFileSync } from "node:fs";
import { MongoClient } from "mongodb";
import { v2 as cloudinary } from "cloudinary";

const loadEnv = (path) => {
  const env = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
};

const env = loadEnv(".env.local");
const results = [];

const report = (name, ok, detail) => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const checkMongo = async () => {
  const client = new MongoClient(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    report("MongoDB connection", true, "ping ok");

    const db = client.db(env.MONGODB_DB_NAME);
    await db.collection("connection_check").insertOne({ checkedAt: new Date() });
    await db.collection("connection_check").drop();
    report("MongoDB read/write", true, `database "${env.MONGODB_DB_NAME}"`);
  } catch (error) {
    report("MongoDB", false, error.message);
  } finally {
    await client.close();
  }
};

const checkCloudinary = async () => {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });

  try {
    const response = await cloudinary.api.ping();
    report("Cloudinary API credentials", response.status === "ok", `cloud "${env.CLOUDINARY_CLOUD_NAME}"`);
  } catch (error) {
    report("Cloudinary API credentials", false, error.error?.message ?? error.message);
  }

  const publicCloud = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  report(
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    publicCloud === env.CLOUDINARY_CLOUD_NAME,
    publicCloud === env.CLOUDINARY_CLOUD_NAME ? "" : "should be the same value as CLOUDINARY_CLOUD_NAME"
  );

  try {
    const preset = await cloudinary.api.upload_preset(env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    report(
      "Cloudinary upload preset",
      true,
      `"${preset.name}" is ${preset.unsigned ? "unsigned (browser uploads OK)" : "signed (server uploads only)"}`
    );
  } catch (error) {
    report("Cloudinary upload preset", false, error.error?.message ?? error.message);
  }
};

await checkMongo();
await checkCloudinary();

process.exit(results.every(Boolean) ? 0 : 1);
