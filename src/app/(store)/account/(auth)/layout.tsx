import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AUTH_ROUTES } from "@/config/auth";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (session) {
    redirect(AUTH_ROUTES.dashboard);
  }

  return children;
}
