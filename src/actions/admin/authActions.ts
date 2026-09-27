"use server";

import { redirect } from "next/navigation";
import {
  ADMIN_ROUTES,
  clearAdminSession,
  createAdminSession,
  verifyAdminCredentials,
} from "@/lib/adminAuth";

const FAILED_LOGIN_DELAY_MS = 800;

export async function adminLogin(_state: { error: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminCredentials(email, password)) {
    await new Promise((resolve) => setTimeout(resolve, FAILED_LOGIN_DELAY_MS));
    return { error: "Incorrect email or password." };
  }

  await createAdminSession();
  redirect(ADMIN_ROUTES.dashboard);
}

export async function adminLogout() {
  await clearAdminSession();
  redirect(ADMIN_ROUTES.login);
}
