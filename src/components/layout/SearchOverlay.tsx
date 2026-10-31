"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Camera, Mic, Search, X } from "lucide-react";
import usePhotoSearch from "@/hooks/usePhotoSearch";
import useProductSearch from "@/hooks/useProductSearch";
import useVoiceSearch from "@/hooks/useVoiceSearch";
import { saveRecentSearch } from "@/lib/recentSearches";
import { formatPrice } from "@/lib/format";
import PhotoSearchResults from "./search/PhotoSearchResults";
import SearchSuggestions from "./search/SearchSuggestions";

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const searchPageHref = (query: string) => `/search?q=${encodeURIComponent(query.trim())}`;

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const photo = usePhotoSearch();
  const clearPhoto = photo.clear;
  const { products, total, correctedQuery, isSearching } = useProductSearch(query);
  const voice = useVoiceSearch(setQuery);
  const stopVoice = voice.stop;

  const closeSearch = useCallback(() => {
    stopVoice();
    clearPhoto();
    setQuery("");
    onClose();
  }, [stopVoice, clearPhoto, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSearch]);

  const openResultsPage = (value: string) => {
    if (!value.trim()) return;
    saveRecentSearch(value);
    closeSearch();
    router.push(searchPageHref(value));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openResultsPage(query);
  };

  const handleProductClick = () => {
    saveRecentSearch(query);
    closeSearch();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-white/80 flex flex-col pt-16 md:pt-32 px-4 md:px-0"
        >
          <button
            onClick={closeSearch}
            aria-label="Close search"
            className="absolute top-6 right-6 md:top-10 md:right-10 text-gray-500 hover:text-black transition-colors"
          >
            <X size={32} />
          </button>

          <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
              className="w-full relative"
              role="search"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={28} />
              <input
                ref={inputRef}
                type="search"
                aria-label="Search products"
                placeholder={voice.isListening ? "Listening..." : "Search iPhone, iPad, Mac, Watch..."}
                value={query}
                onChange={(e) => {
                  photo.clear();
                  setQuery(e.target.value);
                }}
                className="w-full bg-transparent text-[24px] md:text-[40px] font-medium text-black placeholder:text-gray-300 border-b-2 border-gray-200 focus:border-black outline-none py-4 pl-14 md:pl-16 pr-28 transition-colors [&::-webkit-search-cancel-button]:hidden"
              />
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  aria-label="Search with a photo"
                  title="Search with a photo"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-black"
                >
                  <Camera size={22} />
                </button>
                {voice.isSupported && (
                  <button
                    type="button"
                    onClick={voice.isListening ? voice.stop : voice.start}
                    aria-label={voice.isListening ? "Stop voice search" : "Search by voice"}
                    className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                      voice.isListening ? "bg-[#e30000] text-white animate-pulse" : "text-gray-400 hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    <Mic size={22} />
                  </button>
                )}
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  setQuery("");
                  photo.search(file);
                }}
              />
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full mt-10 max-h-[60vh] overflow-y-auto scrollbar-hide"
            >
              {photo.state.status !== "idle" ? (
                <PhotoSearchResults
                  preview={"preview" in photo.state ? photo.state.preview : undefined}
                  isLoading={photo.state.status === "loading"}
                  description={photo.state.status === "done" ? photo.state.description : undefined}
                  matches={photo.state.status === "done" ? photo.state.matches : undefined}
                  error={photo.state.status === "error" ? photo.state.message : undefined}
                  onClear={photo.clear}
                  onNavigate={closeSearch}
                />
              ) : query.trim() ? (
                <>
                  {correctedQuery && products.length > 0 && (
                    <p className="mb-4 px-4 text-[15px] text-gray-500">
                      Showing results for <span className="font-semibold text-black">{correctedQuery}</span>
                    </p>
                  )}
                  {products.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {products.map((product, idx) => (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={product.id}
                        >
                          <Link
                            href={`/products/${product.handle}`}
                            onClick={handleProductClick}
                            className="flex items-center gap-6 p-4 hover:bg-white rounded-2xl transition-colors group"
                          >
                            <div className="w-20 h-20 bg-white rounded-xl relative flex-shrink-0 overflow-hidden shadow-subtle">
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                sizes="80px"
                                className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[18px] font-semibold text-black group-hover:text-[#0071e3] transition-colors">
                                {product.title}
                              </span>
                              <span className="text-[#6e6e73]">From {formatPrice(product.price)}</span>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                      {total > products.length && (
                        <button
                          type="button"
                          onClick={() => openResultsPage(query)}
                          className="mt-2 flex items-center gap-2 self-start px-4 py-2 text-[16px] font-medium text-[#0071e3] hover:underline"
                        >
                          See all {total} results
                          <ArrowRight size={18} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 text-[18px] mt-10">
                      {isSearching ? "Searching..." : <>No results found for &quot;{query}&quot;. Try a model name like &quot;iPhone 17&quot;.</>}
                    </div>
                  )}
                </>
              ) : (
                <SearchSuggestions onSelect={setQuery} onNavigate={closeSearch} />
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
