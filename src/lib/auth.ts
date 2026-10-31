import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { authConfig } from "@/config/env";
import { allowedHosts, siteConfig, siteUrls } from "@/config/site";
import type { SocialProvider } from "@/config/auth";
import { db, mongoClient } from "./mongodb";

const { google } = authConfig;

export const enabledSocialProviders: SocialProvider[] = google ? ["google"] : [];

export const auth = betterAuth({
  appName: siteConfig.name,
  baseURL: {
    allowedHosts,
    fallback: siteUrls.production,
  },
  database: mongodbAdapter(db, { client: mongoClient }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  socialProviders: {
    ...(google && { google }),
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
