import "server-only";

const readEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

const readOptionalEnv = (key: string) => process.env[key] || undefined;

export const mongoConfig = {
  get uri() {
    return readEnv("MONGODB_URI");
  },
  get dbName() {
    return readEnv("MONGODB_DB_NAME");
  },
};

export const cloudinaryConfig = {
  get cloudName() {
    return readEnv("CLOUDINARY_CLOUD_NAME");
  },
  get apiKey() {
    return readEnv("CLOUDINARY_API_KEY");
  },
  get apiSecret() {
    return readEnv("CLOUDINARY_API_SECRET");
  },
};

export const authConfig = {
  get google() {
    const clientId = readOptionalEnv("GOOGLE_CLIENT_ID");
    const clientSecret = readOptionalEnv("GOOGLE_CLIENT_SECRET");
    return clientId && clientSecret ? { clientId, clientSecret } : null;
  },
};

export const adminConfig = {
  get email() {
    return readEnv("ADMIN_EMAIL");
  },
  get password() {
    return readEnv("ADMIN_PASSWORD");
  },
  get sessionSecret() {
    return readEnv("BETTER_AUTH_SECRET");
  },
};
