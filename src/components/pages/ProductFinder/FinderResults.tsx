import Link from "next/link";
import { motion } from "framer-motion";
import { CircleCheck, RotateCcw } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import type { FinderMatch } from "@/lib/productFinder";

type FinderResultsProps = {
  matches: FinderMatch[];
  collectionHref: string;
  onRestart: () => void;
};

export default function FinderResults({ matches, collectionHref, onRestart }: FinderResultsProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 className="text-center text-[28px] font-semibold tracking-tight text-ink md:text-[40px]">
        {matches.length ? "Here are your best matches" : "We couldn't find a match"}
      </h2>
      <p className="mt-3 text-center text-[16px] text-ink-muted">
        {matches.length
          ? "Picked from our current lineup based on your answers."
          : "Try changing a few answers to see more options."}
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map(({ product, reasons }, index) => (
          <div key={product.id} className="flex flex-col">
            <p className={`mb-3 text-[13px] font-semibold uppercase tracking-wider ${index === 0 ? "text-accent" : "text-ink-subtle"}`}>
              {index === 0 ? "Best match" : "Also consider"}
            </p>
            <ProductCard product={product} />
            {reasons.length > 0 && (
              <ul className="mt-4 flex flex-col gap-2">
                {reasons.map((reason) => (
                  <li key={reason} className="flex items-center gap-2 text-[14px] text-ink-muted">
                    <CircleCheck size={16} className="shrink-0 text-positive" />
                    {reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-2 rounded-full border border-line px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:border-ink"
        >
          <RotateCcw size={16} />
          Start over
        </button>
        <Link
          href={collectionHref}
          className="rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Browse all models
        </Link>
      </div>
    </motion.div>
  );
}
