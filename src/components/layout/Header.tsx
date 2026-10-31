"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, Sparkles, User, X } from "lucide-react";
import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter, FiYoutube } from "react-icons/fi";
import SearchOverlay from "./SearchOverlay";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { wishlistItems } = useWishlist();
  const [bounceWishlist, setBounceWishlist] = useState(false);

  const { totalItems } = useCart();
  const [bounceCart, setBounceCart] = useState(false);

  useEffect(() => {
    const handleWishlistUpdate = () => {
      setBounceWishlist(true);
      setTimeout(() => setBounceWishlist(false), 300);
    };
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => {
      setBounceCart(true);
      setTimeout(() => setBounceCart(false), 300);
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="w-full relative z-50">
        {/* Top Header */}
        <div className="hidden md:block py-2 border-b border-gray-100 text-[#333333] text-sm">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <span>USD</span>
              </div>
              <span className="text-gray-300">|</span>
              <div>
                Order Online Call Us <a href="tel:0123456789" className="font-semibold">(0123) 456789</a>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <a href="#" className="hover:text-[#d3122a] transition-colors"><FiTwitter size={14} className="icon-outline" /></a>
              <a href="#" className="hover:text-[#d3122a] transition-colors"><FiInstagram size={14} className="icon-outline" /></a>
              <a href="#" className="hover:text-[#d3122a] transition-colors"><FiLinkedin size={14} className="icon-outline" /></a>
              <a href="#" className="hover:text-[#d3122a] transition-colors"><FiYoutube size={14} className="icon-outline" /></a>
              <a href="#" className="hover:text-[#d3122a] transition-colors"><FiFacebook size={14} className="icon-outline" /></a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className={`w-full transition-all duration-300 z-50 ${isSticky ? "fixed top-0 left-0 shadow-sm py-3 bg-white/80 backdrop-blur-lg" : "py-5 bg-white"}`}>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            {/* Mobile Menu Trigger & Logo */}
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden text-gray-800"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              <Link href="/">
                <Image 
                  src="/Header/applelogo.png" 
                  alt="Astor" 
                  width={150} 
                  height={40} 
                  className="w-[120px] md:w-[150px]"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 text-[14px] font-semibold text-[#333333]">
              <Link href="/" className="hover:text-[#d3122a] transition-colors uppercase">Home</Link>
              <Link href="/collections/macbook" className="hover:text-[#d3122a] transition-colors uppercase">Mac</Link>
              <Link href="/collections/iphone" className="hover:text-[#d3122a] transition-colors uppercase">iPhone</Link>
              <Link href="/ai-features" className="flex items-center gap-1 text-accent hover:text-[#d3122a] transition-colors uppercase">
                <Sparkles size={14} />
                AI Features
              </Link>
              <Link href="/pages/about" className="hover:text-[#d3122a] transition-colors uppercase">About Us</Link>
              <Link href="/pages/contact" className="hover:text-[#d3122a] transition-colors uppercase">Contact</Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4 md:gap-6 text-gray-800">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="hover:text-[#d3122a] transition-colors"
                aria-label="Search"
              >
                <Search size={22} />
              </button>
              <Link href="/account" aria-label="Account" className="hover:text-[#d3122a] transition-colors hidden sm:block"><User size={22} /></Link>
              <Link href="/wishlist" className="relative hover:text-[#d3122a] transition-colors hidden sm:block">
                <Heart id="header-wishlist-icon" size={22} />
                {wishlistItems.length > 0 && (
                  <span className={`absolute -top-2 -right-2 bg-[#d3122a] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold transition-transform ${bounceWishlist ? "scale-125" : "scale-100"}`}>
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative hover:text-[#d3122a] transition-colors">
                <ShoppingBag id="header-cart-icon" size={22} />
                {totalItems > 0 && (
                  <span className={`absolute -top-2 -right-2 bg-[#d3122a] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold transition-transform ${bounceCart ? "scale-125" : "scale-100"}`}>
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Offcanvas Menu */}
      <div className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setMobileMenuOpen(false)}>
        <div 
          className={`fixed top-0 left-0 h-full w-[300px] bg-white transform transition-transform duration-300 overflow-y-auto ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTimeout(() => setIsSearchOpen(true), 300);
                }}
                className="flex-1 flex items-center bg-gray-100 rounded-md overflow-hidden text-gray-500 hover:bg-gray-200 transition-colors py-2 px-3"
              >
                <Search size={16} />
                <span className="ml-2 text-sm">Search products...</span>
              </button>
              <button className="ml-4 text-gray-800" onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-sm font-semibold text-[#333333]">
              <Link href="/" className="border-b pb-3 uppercase">Home</Link>
              <Link href="/collections/macbook" className="border-b pb-3 uppercase">Mac</Link>
              <Link href="/collections/iphone" className="border-b pb-3 uppercase">iPhone</Link>
              <Link href="/ai-features" className="border-b pb-3 uppercase text-accent">AI Features</Link>
              <Link href="/pages/about" className="border-b pb-3 uppercase">About Us</Link>
              <Link href="/pages/contact" className="border-b pb-3 uppercase">Contact</Link>
            </nav>
            <div className="mt-8 flex justify-center gap-4 text-gray-500">
              <a href="#"><FiTwitter size={18} className="icon-outline" /></a>
              <a href="#"><FiInstagram size={18} className="icon-outline" /></a>
              <a href="#"><FiLinkedin size={18} className="icon-outline" /></a>
              <a href="#"><FiYoutube size={18} className="icon-outline" /></a>
              <a href="#"><FiFacebook size={18} className="icon-outline" /></a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
