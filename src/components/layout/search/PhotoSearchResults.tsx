import Image from "next/image";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import type { AiPick } from "@/actions/aiActions";
import { formatPrice } from "@/lib/format";

type PhotoSearchResultsProps = {
  preview?: string;
  isLoading: boolean;
  description?: string;
  matches?: AiPick[];
  error?: string;
  onClear: () => void;
  onNavigate: () => void;
};

export default function PhotoSearchResults({
  preview,
  isLoading,
  description,
  matches = [],
  error,
  onClear,
  onNavigate,
}: PhotoSearchResultsProps) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-4 px-4">
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Your photo" className="h-16 w-16 rounded-xl object-cover shadow-subtle" />
        )}
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-accent">
            <Sparkles size={14} />
            {isLoading ? "Looking at your photo…" : "Visual search"}
          </p>
          {description && <p className="mt-1 text-[16px] text-ink">{description}</p>}
          {error && <p className="mt-1 text-[15px] text-danger">{error}</p>}
        </div>
        <button type="button" onClick={onClear} aria-label="Clear photo search" className="rounded-full p-2 text-gray-500 hover:bg-white hover:text-black">
          <X size={20} />
        </button>
      </div>

      {!isLoading && !error && matches.length === 0 && (
        <p className="px-4 text-[16px] text-gray-500">We couldn&apos;t find a matching product. Try a clearer photo of the device.</p>
      )}

      <div className="flex flex-col gap-2">
        {matches.map(({ product, reason }) => (
          <Link
            key={product.id}
            href={`/products/${product.handle}`}
            onClick={onNavigate}
            className="group flex items-center gap-6 rounded-2xl p-4 transition-colors hover:bg-white"
          >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-subtle">
              <Image src={product.image} alt={product.title} fill sizes="80px" className="object-contain p-2" />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-semibold text-black transition-colors group-hover:text-[#0071e3]">{product.title}</span>
              <span className="text-[#6e6e73]">From {formatPrice(product.price)} · {reason}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
