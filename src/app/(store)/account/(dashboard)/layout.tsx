import AccountShell from "@/components/pages/Account/AccountShell";
import { requireSession } from "@/lib/session";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireSession();

  return <AccountShell user={user}>{children}</AccountShell>;
}
