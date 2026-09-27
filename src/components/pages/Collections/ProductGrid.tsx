'use client';

import React, { useMemo, useState } from 'react';
import ProductCard, { Product } from '@/components/shared/ProductCard';
import { Grid, List, LayoutGrid, Square } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDropdown from '@/components/shared/CustomDropdown';
import { COLLECTION_FILTER_KEYS } from '@/config/collectionMenu';

type SortOption = 'featured' | 'title-ascending' | 'title-descending' | 'price-ascending' | 'price-descending' | 'created-descending' | 'created-ascending';

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Alphabetically, A-Z', value: 'title-ascending' },
  { label: 'Alphabetically, Z-A', value: 'title-descending' },
  { label: 'Price, low to high', value: 'price-ascending' },
  { label: 'Price, high to low', value: 'price-descending' },
  { label: 'Date, new to old', value: 'created-descending' },
  { label: 'Date, old to new', value: 'created-ascending' },
];

const showOptions = ['12', '24', '36'].map((value) => ({ label: value, value }));

const sortProducts = (products: Product[], sortBy: SortOption) => {
  const sorted = [...products];
  switch (sortBy) {
    case 'title-ascending': return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-descending': return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'price-ascending': return sorted.sort((a, b) => a.price - b.price);
    case 'price-descending': return sorted.sort((a, b) => b.price - a.price);
    case 'created-ascending': return sorted.reverse();
    default: return sorted;
  }
};

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid-3' | 'grid-4' | 'grid-5' | 'list'>('grid-3');
  const [itemsPerPage, setItemsPerPage] = useState('12');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [page, setPage] = useState(1);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasActiveFilters = COLLECTION_FILTER_KEYS.some((key) => searchParams.get(key));

  const sortedProducts = useMemo(() => sortProducts(products, sortBy), [products, sortBy]);
  const perPage = Number(itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const firstIndex = (currentPage - 1) * perPage;
  const visibleProducts = sortedProducts.slice(firstIndex, firstIndex + perPage);

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
    setPage(1);
  };

  const handlePerPageChange = (value: string) => {
    setItemsPerPage(value);
    setPage(1);
  };

  const getGridClass = () => {
    switch (viewMode) {
      case 'grid-3': return 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3';
      case 'grid-4': return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4';
      case 'grid-5': return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
      case 'list': return 'grid-cols-1';
      default: return 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full">
      {/* Top Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-wrap items-center justify-between mb-[30px] lg:mb-[50px] p-4 bg-white/50 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
      >
        {/* Left Icons */}
        <div className="flex items-center gap-[15px] mb-[15px] sm:mb-0">
          <button 
            className={`transition-all hover:scale-110 ${viewMode === 'grid-5' ? 'text-[#d3122a]' : 'text-[#a1a1a6] hover:text-[#1d1d1f]'}`}
            onClick={() => setViewMode('grid-5')}
          >
            <Grid size={20} />
          </button>
          <button 
            className={`transition-all hover:scale-110 ${viewMode === 'grid-4' ? 'text-[#d3122a]' : 'text-[#a1a1a6] hover:text-[#1d1d1f]'}`}
            onClick={() => setViewMode('grid-4')}
          >
            <LayoutGrid size={20} />
          </button>
          <button 
            className={`transition-all hover:scale-110 ${viewMode === 'grid-3' ? 'text-[#d3122a]' : 'text-[#a1a1a6] hover:text-[#1d1d1f]'}`}
            onClick={() => setViewMode('grid-3')}
          >
            <Square size={20} />
          </button>
          <button 
            className={`transition-all hover:scale-110 ${viewMode === 'list' ? 'text-[#d3122a]' : 'text-[#a1a1a6] hover:text-[#1d1d1f]'}`}
            onClick={() => setViewMode('list')}
          >
            <List size={24} />
          </button>
        </div>

        {/* Right Info */}
        <div className="flex items-center gap-[20px] flex-wrap">
          <div className="hidden lg:block text-[14px] text-[#6e6e73] font-medium">
            {products.length
              ? `Showing ${firstIndex + 1} - ${firstIndex + visibleProducts.length} of ${products.length} results`
              : 'No results'}
          </div>
          
          <div className="flex items-center gap-[10px]">
            <span className="text-[14px] text-[#6e6e73]">Show</span>
            <CustomDropdown 
              options={showOptions}
              value={itemsPerPage}
              onChange={handlePerPageChange}
            />
          </div>

          <div className="hidden sm:flex items-center gap-[10px]">
            <label className="text-[14px] text-[#6e6e73]">Sort by:</label>
            <CustomDropdown 
              options={sortOptions}
              value={sortBy}
              onChange={handleSortChange}
            />
          </div>
        </div>
      </motion.div>

      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-[30px]"
        >
          <Link href={pathname} scroll={false} className="text-[#1d1d1f] hover:text-[#0071e3] text-[13px] font-medium transition-colors border-b border-transparent hover:border-[#0071e3] pb-0.5">
            Clear all filters
          </Link>
        </motion.div>
      )}

      {!products.length && (
        <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-16 text-center">
          <p className="text-[19px] font-semibold text-[#1d1d1f]">No products match your filters.</p>
          <p className="mt-2 text-[15px] text-[#6e6e73]">Try a different price range or clear the filters to see everything.</p>
          <Link href={pathname} scroll={false} className="mt-6 inline-block text-[15px] font-medium text-[#0071e3] hover:underline">
            Clear all filters
          </Link>
        </div>
      )}

      {/* Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={`grid gap-x-[30px] ${getGridClass()}`}
      >
        <AnimatePresence mode="popLayout">
          {visibleProducts.map((product) => (
            <motion.div 
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-[20px] flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              aria-current={pageNumber === currentPage ? 'page' : undefined}
              onClick={() => {
                setPage(pageNumber);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`h-10 min-w-10 rounded-full px-3 text-[14px] font-medium transition-colors ${
                pageNumber === currentPage ? 'bg-[#1d1d1f] text-white' : 'text-[#1d1d1f] hover:bg-gray-100'
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
