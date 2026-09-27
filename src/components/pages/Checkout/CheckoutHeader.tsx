import Link from "next/link";
import { ChevronLeft, type LucideIcon } from "lucide-react";

interface CheckoutHeaderProps {
  title: string;
  icon: LucideIcon;
  backHref?: string;
  backLabel?: string;
}

export default function CheckoutHeader({ title, icon: Icon, backHref, backLabel }: CheckoutHeaderProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto grid h-[60px] max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          {backHref && (
            <Link href={backHref} className="flex items-center gap-1 text-[14px] text-accent hover:underline">
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-ink sm:text-[20px]">
          <Icon size={18} className="text-ink-muted" />
          {title}
        </div>
        <div />
      </div>
    </div>
  );
}
