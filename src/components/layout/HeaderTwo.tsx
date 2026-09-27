"use client";

import { useState } from "react";
import Link from "next/link";
import NavLinks from "./header/NavLinks";
import MobileNav from "./header/MobileNav";
import SearchModal from "./header/SearchModal";
import BagFlyout from "./header/BagFlyout";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);

  return (
    <>
      <header
        id="globalnav"
        className="sticky top-0 z-50 w-full h-[44px] bg-[rgba(250,250,252,0.8)] backdrop-blur-xl backdrop-saturate-180 border-b border-[#d2d2d7]/50"
      >
        <div className="mx-auto flex h-full max-w-[1024px] items-center justify-between px-[16px] sm:px-[22px]">
          {/* Desktop Global Navigation */}
          <nav aria-label="Global" className="hidden md:flex h-full w-full">
            <ul
              id="globalnav-list"
              className="flex flex-row items-center w-full justify-between h-full m-0 -mx-[8px] p-0 list-none"
            >
              {/* Apple Logo */}
              <li className="flex items-center justify-center px-[8px] h-[44px]">
                <Link
                  href="/homeone"
                  aria-label="Apple"
                  className="flex items-center text-black/80 hover:text-black transition-colors h-[44px]"
                >
                  <svg
                    height="44"
                    viewBox="0 0 14 44"
                    width="14"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current"
                  >
                    <path d="m13.0729 17.6825a3.61 3.61 0 0 0 -1.7248 3.0365 3.5132 3.5132 0 0 0 2.1379 3.2223 8.394 8.394 0 0 1 -1.0948 2.2618c-.6816.9812-1.3943 1.9623-2.4787 1.9623s-1.3633-.63-2.613-.63c-1.2187 0-1.6525.6507-2.644.6507s-1.6834-.9089-2.4787-2.0243a9.7842 9.7842 0 0 1 -1.6628-5.2776c0-3.0984 2.014-4.7405 3.9969-4.7405 1.0535 0 1.9314.6919 2.5924.6919.63 0 1.6112-.7333 2.8092-.7333a3.7579 3.7579 0 0 1 3.1604 1.5802zm-3.7284-2.8918a3.5615 3.5615 0 0 0 .8469-2.22 1.5353 1.5353 0 0 0 -.031-.32 3.5686 3.5686 0 0 0 -2.3445 1.2084 3.4629 3.4629 0 0 0 -.8779 2.1585 1.419 1.419 0 0 0 .031.2892 1.19 1.19 0 0 0 .2169.0207 3.0935 3.0935 0 0 0 2.1586-1.1368z" />
                  </svg>
                </Link>
              </li>

              {/* Nav Links with animated Mega Menu */}
              <NavLinks />

              {/* Search Icon */}
              <li className="flex items-center justify-center px-[8px] h-[44px]">
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsBagOpen(false);
                  }}
                  aria-label="Search apple.com"
                  className="flex items-center text-black/80 hover:text-black transition-colors h-[44px] cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="44"
                    viewBox="0 0 15 44"
                    className="fill-current"
                  >
                    <path d="M14.298,27.202l-3.87-3.87c0.701-0.929,1.122-2.081,1.122-3.332c0-3.06-2.489-5.55-5.55-5.55c-3.06,0-5.55,2.49-5.55,5.55 c0,3.061,2.49,5.55,5.55,5.55c1.251,0,2.403-0.421,3.332-1.122l3.87,3.87c0.151,0.151,0.35,0.228,0.548,0.228 s0.396-0.076,0.548-0.228C14.601,27.995,14.601,27.505,14.298,27.202z M1.55,20c0-2.454,1.997-4.45,4.45-4.45 c2.454,0,4.45,1.997,4.45,4.45S8.454,24.45,6,24.45C3.546,24.45,1.55,22.454,1.55,20z" />
                  </svg>
                </button>
              </li>

              {/* Bag Icon */}
              <li className="flex items-center justify-center px-[8px] h-[44px]">
                <button
                  onClick={() => {
                    setIsBagOpen(!isBagOpen);
                    setIsSearchOpen(false);
                  }}
                  aria-label="Shopping Bag"
                  className="flex items-center text-black/80 hover:text-black transition-colors h-[44px] cursor-pointer"
                >
                  <svg
                    height="44"
                    viewBox="0 0 14 44"
                    width="14"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current"
                  >
                    <path d="m11.3535 16.0283h-1.0205a3.4229 3.4229 0 0 0 -3.333-2.9648 3.4229 3.4229 0 0 0 -3.333 2.9648h-1.02a2.1184 2.1184 0 0 0 -2.117 2.1162v7.7155a2.1186 2.1186 0 0 0 2.1162 2.1167h8.707a2.1186 2.1186 0 0 0 2.1168-2.1167v-7.7155a2.1184 2.1184 0 0 0 -2.1165-2.1162zm-4.3535-1.8652a2.3169 2.3169 0 0 1 2.2222 1.8652h-4.4444a2.3169 2.3169 0 0 1 2.2222-1.8652zm5.37 11.6969a1.0182 1.0182 0 0 1 -1.0166 1.0171h-8.7069a1.0182 1.0182 0 0 1 -1.0165-1.0171v-7.7155a1.0178 1.0178 0 0 1 1.0166-1.0166h8.707a1.0178 1.0178 0 0 1 1.0164 1.0166z" />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>

          {/* Mobile Navigation Bar */}
          <div className="flex md:hidden items-center justify-between h-full w-full">
            {/* Logo */}
            <Link
              href="/homeone"
              aria-label="Apple"
              className="flex items-center text-black/80 hover:text-black transition-colors h-[44px]"
            >
              <svg
                height="44"
                viewBox="0 0 14 44"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current"
              >
                <path d="m13.0729 17.6825a3.61 3.61 0 0 0 -1.7248 3.0365 3.5132 3.5132 0 0 0 2.1379 3.2223 8.394 8.394 0 0 1 -1.0948 2.2618c-.6816.9812-1.3943 1.9623-2.4787 1.9623s-1.3633-.63-2.613-.63c-1.2187 0-1.6525.6507-2.644.6507s-1.6834-.9089-2.4787-2.0243a9.7842 9.7842 0 0 1 -1.6628-5.2776c0-3.0984 2.014-4.7405 3.9969-4.7405 1.0535 0 1.9314.6919 2.5924.6919.63 0 1.6112-.7333 2.8092-.7333a3.7579 3.7579 0 0 1 3.1604 1.5802zm-3.7284-2.8918a3.5615 3.5615 0 0 0 .8469-2.22 1.5353 1.5353 0 0 0 -.031-.32 3.5686 3.5686 0 0 0 -2.3445 1.2084 3.4629 3.4629 0 0 0 -.8779 2.1585 1.419 1.419 0 0 0 .031.2892 1.19 1.19 0 0 0 .2169.0207 3.0935 3.0935 0 0 0 2.1586-1.1368z" />
              </svg>
            </Link>

            {/* Right Icons: Search, Bag, Hamburger */}
            <div className="flex items-center h-full space-x-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search apple.com"
                className="flex items-center text-black/80 hover:text-black transition-colors h-[44px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="44"
                  viewBox="0 0 15 44"
                  className="fill-current"
                >
                  <path d="M14.298,27.202l-3.87-3.87c0.701-0.929,1.122-2.081,1.122-3.332c0-3.06-2.489-5.55-5.55-5.55c-3.06,0-5.55,2.49-5.55,5.55 c0,3.061,2.49,5.55,5.55,5.55c1.251,0,2.403-0.421,3.332-1.122l3.87,3.87c0.151,0.151,0.35,0.228,0.548,0.228 s0.396-0.076,0.548-0.228C14.601,27.995,14.601,27.505,14.298,27.202z M1.55,20c0-2.454,1.997-4.45,4.45-4.45 c2.454,0,4.45,1.997,4.45,4.45S8.454,24.45,6,24.45C3.546,24.45,1.55,22.454,1.55,20z" />
                </svg>
              </button>
              <button
                onClick={() => setIsBagOpen(!isBagOpen)}
                aria-label="Shopping Bag"
                className="flex items-center text-black/80 hover:text-black transition-colors h-[44px]"
              >
                <svg
                  height="44"
                  viewBox="0 0 14 44"
                  width="14"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current"
                >
                  <path d="m11.3535 16.0283h-1.0205a3.4229 3.4229 0 0 0 -3.333-2.9648 3.4229 3.4229 0 0 0 -3.333 2.9648h-1.02a2.1184 2.1184 0 0 0 -2.117 2.1162v7.7155a2.1186 2.1186 0 0 0 2.1162 2.1167h8.707a2.1186 2.1186 0 0 0 2.1168-2.1167v-7.7155a2.1184 2.1184 0 0 0 -2.1165-2.1162zm-4.3535-1.8652a2.3169 2.3169 0 0 1 2.2222 1.8652h-4.4444a2.3169 2.3169 0 0 1 2.2222-1.8652zm5.37 11.6969a1.0182 1.0182 0 0 1 -1.0166 1.0171h-8.7069a1.0182 1.0182 0 0 1 -1.0165-1.0171v-7.7155a1.0178 1.0178 0 0 1 1.0166-1.0166h8.707a1.0178 1.0178 0 0 1 1.0164 1.0166z" />
                </svg>
              </button>
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <BagFlyout isOpen={isBagOpen} onClose={() => setIsBagOpen(false)} />
    </>
  );
}
