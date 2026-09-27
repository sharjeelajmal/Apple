"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { accountNavItems } from "@/config/accountNav";
import SignOutButton from "./SignOutButton";

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account" className="lg:sticky lg:top-[100px]">
      <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
        {accountNavItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-[15px] transition-colors duration-300 ease-smooth lg:rounded-field ${
                  isActive
                    ? "bg-ink text-white"
                    : "bg-surface text-ink hover:bg-line-light lg:bg-transparent"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 hidden border-t border-line-light pt-6 lg:block">
        <SignOutButton />
      </div>
    </nav>
  );
}
