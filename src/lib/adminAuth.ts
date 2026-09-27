import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminConfig } from "@/config/env";

export const ADMIN_ROUTES = {
  login: "/admin/login",
  dashboard: "/admin",
} as const;

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

const sign = (value: string) =>
  createHmac("sha256", `admin:${adminConfig.sessionSecret}`).update(value).digest("base64url");

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

export const verifyAdminCredentials = (email: string, password: string) => {
  const emailMatches = safeEqual(email.trim().toLowerCase(), adminConfig.email.toLowerCase());
  const passwordMatches = safeEqual(password, adminConfig.password);
  return emailMatches && passwordMatches;
};

export async function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = `${adminConfig.email}.${expiresAt}`;

  (await cookies()).set(SESSION_COOKIE, `${expiresAt}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature || Number(expiresAt) < Date.now() / 1000) return false;

  return safeEqual(signature, sign(`${adminConfig.email}.${expiresAt}`));
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect(ADMIN_ROUTES.login);
  }
}

export async function assertAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}
