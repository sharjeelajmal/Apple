import type { ReactNode } from "react";
import AccountNav from "./AccountNav";
import SignOutButton from "./SignOutButton";
import UserAvatar from "@/components/shared/UserAvatar";
import { formatMonthYear } from "@/lib/format";

interface AccountShellProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    createdAt: Date;
  };
  children: ReactNode;
}

export default function AccountShell({ user, children }: AccountShellProps) {
  const firstName = user.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-surface-muted pb-24">
      <div className="border-b border-line-light bg-surface">
        <div className="mx-auto flex max-w-[1200px] items-center gap-5 px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <UserAvatar name={user.name} image={user.image} className="h-16 w-16 text-[22px] md:h-20 md:w-20 md:text-[26px]" />
          <div className="min-w-0">
            <h1 className="truncate text-[28px] font-semibold tracking-tight text-ink md:text-[40px]">
              Hi, {firstName}.
            </h1>
            <p className="truncate text-[15px] text-ink-muted">
              {user.email} · Member since {formatMonthYear(user.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 pt-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:gap-12 lg:px-8 lg:pt-12">
        <aside>
          <AccountNav />
        </aside>
        <main className="min-w-0">{children}</main>
        <div className="lg:hidden">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
