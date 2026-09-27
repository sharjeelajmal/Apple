import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f5f5f7] pt-8 pb-10 text-[#6e6e73] text-[12px] leading-[1.33337] tracking-[-0.01em]">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6">
        
        {/* Footnote / Disclaimer section */}
        <div className="border-b border-[#d2d2d7] pb-4 mb-5">
          <p className="mb-2">
            1. Trade-in values will vary based on the condition, year, and configuration of your eligible trade-in device. Not all devices are eligible for credit. You must be at least 18 years old to be eligible to trade in for credit or for an Astor Store Gift Card.
          </p>
          <p className="mb-2">
            Available space is less and varies due to many factors. A standard configuration uses approximately 12GB to 17GB of space, including iOS 15 with its latest features and Apple apps that can be deleted.
          </p>
          <p>
            Astor, the Astor Logo, Mac, iPhone, iPad, and Apple Watch are trademarks of Astor Inc., registered in the U.S. and other countries.
          </p>
        </div>

        {/* Logo and Directory Links (Desktop Grid) */}
        <div className="hidden md:flex justify-between mb-8">
          {/* Column 1 */}
          <div className="flex-1 pr-4">
            <h3 className="font-semibold text-[#1d1d1f] mb-2.5">Shop and Learn</h3>
            <ul className="flex flex-col gap-2 mb-6">
              <li><Link href="/collections/macbook" className="hover:text-[#1d1d1f] hover:underline transition-colors">Mac</Link></li>
              <li><Link href="/collections/ipad" className="hover:text-[#1d1d1f] hover:underline transition-colors">iPad</Link></li>
              <li><Link href="/collections/iphone" className="hover:text-[#1d1d1f] hover:underline transition-colors">iPhone</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Watch</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Vision</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">AirPods</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">TV & Home</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Accessories</Link></li>
            </ul>

            <h3 className="font-semibold text-[#1d1d1f] mb-2.5">Astor Wallet</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Wallet</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor Card</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor Pay</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="flex-1 pr-4">
            <h3 className="font-semibold text-[#1d1d1f] mb-2.5">Account</h3>
            <ul className="flex flex-col gap-2 mb-6">
              <li><Link href="/account" className="hover:text-[#1d1d1f] hover:underline transition-colors">Manage Your Astor ID</Link></li>
              <li><Link href="/account" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor Store Account</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">iCloud.com</Link></li>
            </ul>

            <h3 className="font-semibold text-[#1d1d1f] mb-2.5">Entertainment</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor One</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor TV+</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor Music</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor Arcade</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor Fitness+</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor News+</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex-1 pr-4">
            <h3 className="font-semibold text-[#1d1d1f] mb-2.5">Astor Store</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Find a Store</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Genius Bar</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Today at Astor</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor Camp</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor Store App</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Refurbished and Clearance</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Financing</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Order Status</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Shopping Help</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="flex-1 pr-4">
            <h3 className="font-semibold text-[#1d1d1f] mb-2.5">For Business</h3>
            <ul className="flex flex-col gap-2 mb-6">
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor and Business</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Shop for Business</Link></li>
            </ul>

            <h3 className="font-semibold text-[#1d1d1f] mb-2.5">For Education</h3>
            <ul className="flex flex-col gap-2 mb-6">
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor and Education</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Shop for K-12</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Shop for College</Link></li>
            </ul>

            <h3 className="font-semibold text-[#1d1d1f] mb-2.5">For Healthcare</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor in Healthcare</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Health on Astor Watch</Link></li>
            </ul>
          </div>

          {/* Column 5 */}
          <div className="flex-1">
            <h3 className="font-semibold text-[#1d1d1f] mb-2.5">Astor Values</h3>
            <ul className="flex flex-col gap-2 mb-6">
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Accessibility</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Education</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Environment</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Inclusion and Diversity</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Privacy</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Supplier Responsibility</Link></li>
            </ul>

            <h3 className="font-semibold text-[#1d1d1f] mb-2.5">About Astor</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/pages/about" className="hover:text-[#1d1d1f] hover:underline transition-colors">Newsroom</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Astor Leadership</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Career Opportunities</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Investors</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Ethics & Compliance</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">Events</Link></li>
              <li><Link href="/pages/contact" className="hover:text-[#1d1d1f] hover:underline transition-colors">Contact Astor</Link></li>
            </ul>
          </div>
        </div>

        {/* Mobile Directory Links (Accordion style placeholders - simplified for this implementation) */}
        <div className="md:hidden flex flex-col gap-4 mb-8">
          <div className="border-b border-[#d2d2d7] pb-2">
            <h3 className="font-semibold text-[#1d1d1f] flex justify-between items-center cursor-pointer">Shop and Learn <ChevronRight size={14} /></h3>
          </div>
          <div className="border-b border-[#d2d2d7] pb-2">
            <h3 className="font-semibold text-[#1d1d1f] flex justify-between items-center cursor-pointer">Services <ChevronRight size={14} /></h3>
          </div>
          <div className="border-b border-[#d2d2d7] pb-2">
            <h3 className="font-semibold text-[#1d1d1f] flex justify-between items-center cursor-pointer">Account <ChevronRight size={14} /></h3>
          </div>
          <div className="border-b border-[#d2d2d7] pb-2">
            <h3 className="font-semibold text-[#1d1d1f] flex justify-between items-center cursor-pointer">Astor Store <ChevronRight size={14} /></h3>
          </div>
          <div className="border-b border-[#d2d2d7] pb-2">
            <h3 className="font-semibold text-[#1d1d1f] flex justify-between items-center cursor-pointer">About Astor <ChevronRight size={14} /></h3>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-4 border-t border-[#d2d2d7]">
          <div className="mb-4">
            More ways to shop: <Link href="#" className="text-[#0066cc] hover:underline">Find an Astor Store</Link> or <Link href="#" className="text-[#0066cc] hover:underline">other retailer</Link> near you. <span className="hidden sm:inline">Or call 1-800-MY-ASTOR.</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-[#d2d2d7] md:border-none pt-4 md:pt-0">
            <p className="mb-2 md:mb-0">Copyright © {new Date().getFullYear()} Astor Inc. All rights reserved.</p>
            <ul className="flex flex-wrap divide-x divide-[#d2d2d7]">
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors px-2 first:pl-0">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors px-2">Terms of Use</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors px-2">Sales and Refunds</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors px-2">Legal</Link></li>
              <li><Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors px-2 border-r-0">Site Map</Link></li>
            </ul>
            <p className="mt-2 md:mt-0 hidden lg:block hover:underline cursor-pointer">United States</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
