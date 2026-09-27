import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbProps = {
  items: { label: string; href?: string }[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="w-full bg-[#fbfbfb] py-4 border-b border-[#ededed]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumbs">
          <ul className="flex items-center space-x-2 text-[14px]">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <li key={index} className="flex items-center">
                  {item.href && !isLast ? (
                    <>
                      <Link 
                        href={item.href} 
                        className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                      >
                        {item.label}
                      </Link>
                      <ChevronRight size={14} className="text-[#86868b] mx-2" />
                    </>
                  ) : (
                    <span className="text-[#1d1d1f] font-medium">{item.label}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
