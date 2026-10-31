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

export type AssistantProvider = {
  name: "openrouter" | "anthropic";
  model: string;
  voiceModel: string;
  apiKey: string | null;
  authToken: string | null;
  baseURL?: string;
};

export const assistantConfig = {
  get provider(): AssistantProvider | null {
    const openRouterKey = readOptionalEnv("OPENROUTER_API_KEY");
    if (openRouterKey) {
      return {
        name: "openrouter",
        model: readOptionalEnv("OPENROUTER_MODEL") ?? "anthropic/claude-opus-5.5",
        voiceModel: readOptionalEnv("OPENROUTER_VOICE_MODEL") ?? "anthropic/claude-sonnet-5.5",
        apiKey: null,
        authToken: openRouterKey,
        baseURL: "https://openrouter.ai/api",
      };
    }

    const anthropicKey = readOptionalEnv("ANTHROPIC_API_KEY");
    return anthropicKey ? { name: "anthropic", model: "claude-opus-5-5", voiceModel: "claude-sonnet-5-5", apiKey: anthropicKey, authToken: null } : null;
  },
  get isEnabled() {
    return Boolean(this.provider);
  },
};
