"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/config/adminNav";

interface AdminNavProps {
  badges: Partial<Record<string, number>>;
}

export default function AdminNav({ badges }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin">
      <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
        {adminNavItems.map(({ label, href, icon: Icon }) => {
          const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);
          const badge = badges[href];

          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-[14px] transition-colors duration-200 lg:rounded-[10px] ${
                  isActive ? "bg-ink text-white" : "bg-surface text-ink hover:bg-line-light lg:bg-transparent"
                }`}
              >
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {Boolean(badge) && (
                  <span className={`rounded-full px-2 text-[12px] font-semibold ${isActive ? "bg-white/20" : "bg-accent text-white"}`}>
                    {badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
