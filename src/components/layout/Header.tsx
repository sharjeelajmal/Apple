import Link from "next/link";
import Image from "next/image";
import NavLinks from "./header/NavLinks";
import MobileNav from "./header/MobileNav";
import CartIndicator from "./header/CartIndicator";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full h-[44px] bg-white/70 backdrop-blur-md backdrop-saturate-150 border-b border-gray-200/50 transition-colors duration-300">
      <div className="mx-auto flex h-full max-w-[996px] items-center justify-between px-4 lg:px-0">
        <nav aria-label="Global" className="hidden md:flex h-full w-full mx-auto">
          <ul
            id="globalnav-list"
            className="flex flex-row items-center w-full justify-between h-full m-0 p-0 list-none"
          >
            {/* Apple Logo */}
            <li className="flex items-center justify-center px-2 h-full">
              <Link
                href="/"
                aria-label="Apple"
                className="flex items-center text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors h-full"
              >
                <Image
                  src="/Header/applelogo.png"
                  alt="Apple Logo"
                  width={32}
                  height={32}
                  className="w-[28px] h-auto object-contain"
                />
              </Link>
            </li>

            {/* Nav Links */}
            <NavLinks />

            {/* Search Icon */}
            <li className="flex items-center justify-center px-2 h-full">
              <button
                aria-label="Search apple.com"
                className="flex items-center text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors h-full"
              >
                <Image
                  src="/Header/search.png"
                  alt="Search"
                  width={16}
                  height={16}
                  className="w-[15px] h-auto object-contain"
                />
              </button>
            </li>

            {/* Bag Icon */}
            <li className="flex items-center justify-center px-2 h-full">
              <CartIndicator />
            </li>
          </ul>
        </nav>
        
        {/* Mobile Layout (only shown on small screens) */}
        <div className="flex md:hidden items-center justify-between h-full w-full">
          {/* Logo on Left */}
          <Link
            href="/"
            aria-label="Apple"
            className="flex items-center text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors h-[44px]"
          >
            <Image
              src="/Header/applelogo.png"
              alt="Apple Logo"
              width={32}
              height={32}
              className="w-[28px] h-auto object-contain"
            />
          </Link>
          
          {/* Right Icons: Search, Bag, Hamburger */}
          <div className="flex items-center h-full space-x-5">
            <button
              aria-label="Search apple.com"
              className="flex items-center text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors h-[44px]"
            >
              <Image
                src="/Header/search.png"
                alt="Search"
                width={18}
                height={18}
                className="w-[18px] h-auto object-contain"
              />
            </button>
            <CartIndicator />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
