import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
}

export default function StatCard({ icon: Icon, label, value, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-card border border-line-light bg-surface p-5 shadow-soft transition-transform duration-300 ease-smooth hover:-translate-y-0.5 md:p-6"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Icon size={20} />
      </span>
      <p className="mt-4 text-[28px] font-semibold tracking-tight text-ink">{value}</p>
      <p className="text-[14px] text-ink-muted group-hover:text-ink">{label}</p>
    </Link>
  );
}
