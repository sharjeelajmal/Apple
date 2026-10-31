"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GitCompareArrows, X } from "lucide-react";
import useCompareList from "@/hooks/useCompareList";
import { clearCompareList, comparePageHref, MAX_COMPARE_ITEMS, removeCompareItem } from "@/lib/compareList";

export default function CompareBar() {
  const items = useCompareList();
  const pathname = usePathname();
  const isVisible = items.length > 0 && pathname !== "/compare";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-[85] flex flex-wrap items-center gap-3 rounded-card bg-surface p-3 shadow-float sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-[calc(100vw-260px)]"
        >
          <span className="flex items-center gap-2 pl-1 text-[14px] font-semibold text-ink">
            <GitCompareArrows size={16} />
            Compare ({items.length}/{MAX_COMPARE_ITEMS})
          </span>
          <ul className="flex gap-2">
            {items.map((item) => (
              <li key={item.handle} className="relative h-12 w-12 rounded-field bg-surface-muted p-1" title={item.title}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} className="h-full w-full object-contain" />
                <button
                  type="button"
                  onClick={() => removeCompareItem(item.handle)}
                  aria-label={`Remove ${item.title}`}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white"
                >
                  <X size={11} />
                </button>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={clearCompareList} className="px-2 text-[13px] text-ink-muted hover:text-ink">
              Clear
            </button>
            {items.length < 2 ? (
              <span className="text-[13px] text-ink-muted">Add one more to compare</span>
            ) : (
              <Link
                href={comparePageHref(items.map((item) => item.handle))}
                className="rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-white hover:bg-accent-hover"
              >
                Compare now
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
