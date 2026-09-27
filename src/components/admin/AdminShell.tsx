import type { ReactNode } from "react";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { FaApple } from "react-icons/fa";
import { adminLogout } from "@/actions/admin/authActions";
import { siteConfig } from "@/config/site";
import AdminNav from "./AdminNav";

interface AdminShellProps {
  newMessageCount: number;
  children: ReactNode;
}

export default function AdminShell({ newMessageCount, children }: AdminShellProps) {
  return (
    <div className="min-h-screen w-full bg-surface-muted lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-line-light bg-surface px-4 py-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
        <div className="mb-4 flex items-center justify-between lg:mb-8 lg:px-2">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-ink text-white">
              <FaApple size={18} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold leading-tight text-ink">{siteConfig.name}</span>
              <span className="block text-[12px] text-ink-muted">Admin</span>
            </span>
          </Link>
          <form action={adminLogout} className="lg:hidden">
            <button type="submit" aria-label="Sign out" className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted hover:text-danger">
              <LogOut size={18} />
            </button>
          </form>
        </div>

        <AdminNav badges={{ "/admin/messages": newMessageCount }} />

        <div className="mt-auto hidden flex-col gap-1 border-t border-line-light pt-4 lg:flex">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-[10px] px-4 py-2.5 text-[14px] text-ink hover:bg-line-light"
          >
            <ExternalLink size={18} />
            View Store
          </Link>
          <form action={adminLogout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-[10px] px-4 py-2.5 text-[14px] text-danger hover:bg-danger-soft"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
