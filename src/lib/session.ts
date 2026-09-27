import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/config/auth";
import { auth } from "./auth";

export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

export const requireSession = async () => {
  const session = await getSession();

  if (!session) {
    redirect(AUTH_ROUTES.login);
  }

  return session;
};
