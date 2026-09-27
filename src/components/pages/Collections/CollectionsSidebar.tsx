'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { productCategories, type CategorySlug } from '@/config/categories';
import { collectionMenu } from '@/config/collectionMenu';
import type { Availability } from '@/lib/catalog';
import PriceFilterForm from './PriceFilterForm';

const availabilityOptions: { value: Availability; label: string }[] = [
  { value: 'in-stock', label: 'In stock' },
  { value: 'out-of-stock', label: 'Out of stock' },
];

const pageLinks = [
  { label: 'About Us', href: '/pages/about' },
  { label: 'Contact', href: '/pages/contact' },
];

type CollectionsSidebarProps = {
  categoryCounts: Partial<Record<CategorySlug, number>>;
  availabilityCounts: Record<Availability, number>;
  highestPrice: number;
};

export default function CollectionsSidebar({ categoryCounts, availabilityCounts, highestPrice }: CollectionsSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeQuery = searchParams.get('q') ?? '';
  const activeAvailability = searchParams.get('availability');

  const categories = productCategories.map(({ slug, name }) => ({
    name,
    href: `/collections/${slug}`,
    count: categoryCounts[slug] ?? 0,
  }));

  const updateParams = (changes: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => (value ? params.set(key, value) : params.delete(key)));
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleAvailabilityChange = (value: Availability) =>
    updateParams({ availability: activeAvailability === value ? null : value });

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, staggerChildren: 0.1, ease: 'easeOut' as const },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="w-full pr-4">
      <motion.div variants={itemVariants} className="mb-[40px]">
        <h2 className="text-[14px] text-[#1d1d1f] mb-[15px] font-semibold uppercase tracking-wider">Categories</h2>
        <ul className="flex flex-col gap-3">
          {categories.map((cat) => {
            const isActive = pathname === cat.href && !activeQuery;
            return (
              <li key={cat.name} className="group flex items-center justify-between">
                <Link
                  href={cat.href}
                  className={`text-[15px] transition-all flex-1 ${isActive ? 'text-[#0071e3] font-medium' : 'text-[#6e6e73] hover:text-[#1d1d1f]'}`}
                >
                  {cat.name}
                </Link>
                <span className={`text-[13px] bg-gray-100 px-2 py-0.5 rounded-full transition-colors ${isActive ? 'bg-[#0071e3]/10 text-[#0071e3]' : 'text-[#a1a1a6] group-hover:bg-gray-200 group-hover:text-[#1d1d1f]'}`}>
                  {cat.count}
                </span>
              </li>
            );
          })}
        </ul>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-[40px]">
        <h2 className="text-[14px] text-[#1d1d1f] mb-[15px] font-semibold uppercase tracking-wider">Custom Menu</h2>
        <ul className="flex flex-col gap-4">
          {collectionMenu.map((menu) => {
            const href = `/collections/${menu.category}`;
            const isActive = pathname === href && !activeQuery;
            return (
              <li key={menu.title} className="group">
                <Link
                  href={href}
                  className={`text-[15px] transition-colors block mb-2 font-medium uppercase ${isActive ? 'text-[#0071e3]' : 'text-[#1d1d1f] hover:text-[#0071e3]'}`}
                >
                  {menu.title}
                </Link>
                <ul className="pl-3 flex flex-col gap-2 border-l-[2px] border-gray-100 ml-1">
                  {menu.searches.map((search) => {
                    const isSearchActive = pathname === href && activeQuery === search;
                    return (
                      <li key={search}>
                        <Link
                          href={`${href}?q=${encodeURIComponent(search)}`}
                          className={`text-[14px] transition-colors block px-2 py-0.5 rounded-md ${isSearchActive ? 'text-[#0071e3] bg-[#0071e3]/5 font-medium' : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-gray-50'}`}
                        >
                          {search}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
          {pageLinks.map(({ label, href }) => (
            <li key={href}>
              <Link href={href} className="text-[15px] text-[#1d1d1f] hover:text-[#0071e3] transition-colors block font-medium">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-[40px]">
        <h2 className="text-[14px] text-[#1d1d1f] mb-[15px] font-semibold uppercase tracking-wider">Availability</h2>
        <ul className="flex flex-col gap-3">
          {availabilityOptions.map(({ value, label }) => {
            const isChecked = activeAvailability === value;
            return (
              <li key={value}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  onClick={() => handleAvailabilityChange(value)}
                  className="flex w-full items-center justify-between group text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${isChecked ? 'bg-[#0071e3] border-[#0071e3]' : 'border-gray-300 group-hover:border-[#0071e3]'}`}>
                      {isChecked && (
                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className={`text-[15px] transition-colors ${isChecked ? 'text-[#1d1d1f] font-medium' : 'text-[#6e6e73] group-hover:text-[#1d1d1f]'}`}>
                      {label}
                    </span>
                  </span>
                  <span className="text-[13px] text-[#a1a1a6]">{availabilityCounts[value]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-[40px]">
        <h2 className="text-[14px] text-[#1d1d1f] mb-[15px] font-semibold uppercase tracking-wider">Price</h2>
        <PriceFilterForm
          key={`${searchParams.get('minPrice') ?? ''}-${searchParams.get('maxPrice') ?? ''}`}
          initialMin={searchParams.get('minPrice') ?? ''}
          initialMax={searchParams.get('maxPrice') ?? ''}
          highestPrice={highestPrice}
          onApply={updateParams}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="bg-[#f5f5f7] rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg transition-shadow duration-500">
        <Link href="/collections/apple-watch" className="block relative aspect-square md:aspect-auto">
          <img src="https://bigon-6.myshopify.com/cdn/shop/files/fdfdfdf_grande.jpg?v=1643623055" alt="Shop Apple Watch" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
