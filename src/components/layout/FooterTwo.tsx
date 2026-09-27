"use client";

import { useState } from "react";
import Link from "next/link";

interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

interface FooterColumn {
  sections: FooterSection[];
}

const footerColumns: FooterColumn[] = [
  {
    sections: [
      {
        title: "Shop and Learn",
        links: [
          { label: "Store", href: "/storeone" },
          { label: "Mac", href: "/mac/" },
          { label: "iPad", href: "/ipad/" },
          { label: "iPhone", href: "/iphone/" },
          { label: "Watch", href: "/watch/" },
          { label: "Vision", href: "/apple-vision-pro/" },
          { label: "AirPods", href: "/airpods/" },
          { label: "TV & Home", href: "/tv-home/" },
          { label: "AirTag", href: "/airtag/" },
          { label: "Accessories", href: "/us/shop/goto/buy_accessories" },
          { label: "Gift Cards", href: "/us/shop/goto/giftcards" },
        ],
      },
      {
        title: "Apple Wallet",
        links: [
          { label: "Wallet", href: "/wallet/" },
          { label: "Apple Card", href: "/apple-card/" },
          { label: "Apple Pay", href: "/apple-pay/" },
          { label: "Apple Cash", href: "/apple-cash/" },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "Account",
        links: [
          { label: "Manage Your Apple Account", href: "https://account.apple.com/" },
          { label: "Apple Store Account", href: "/us/shop/goto/account" },
          { label: "iCloud.com", href: "https://www.icloud.com" },
        ],
      },
      {
        title: "Entertainment",
        links: [
          { label: "Apple One", href: "/apple-one/" },
          { label: "Apple TV", href: "/apple-tv/" },
          { label: "Apple Music", href: "/apple-music/" },
          { label: "Apple Arcade", href: "/apple-arcade/" },
          { label: "Apple Fitness+", href: "/apple-fitness-plus/" },
          { label: "Apple News+", href: "/apple-news/" },
          { label: "Apple Podcasts", href: "/apple-podcasts/" },
          { label: "Apple Books", href: "/apple-books/" },
          { label: "App Store", href: "/app-store/" },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "Apple Store",
        links: [
          { label: "Find a Store", href: "/retail/" },
          { label: "Genius Bar", href: "/retail/geniusbar/" },
          { label: "Today at Apple", href: "/today/" },
          { label: "Group Reservations", href: "/today/groups/" },
          { label: "Apple Camp", href: "/today/camp/" },
          { label: "Apple Store App", href: "https://apps.apple.com/us/app/apple-store/id375380948" },
          { label: "Certified Refurbished", href: "/us/shop/goto/special_deals" },
          { label: "Apple Upgrade", href: "/us/shop/goto/apple_upgrade" },
          { label: "Apple Trade In", href: "/us/shop/goto/trade_in" },
          { label: "Financing", href: "/us/shop/goto/payment_plan" },
          { label: "Carrier Deals at Apple", href: "/us/shop/goto/buy_iphone/carrier_offers" },
          { label: "Order Status", href: "/us/shop/goto/order/list" },
          { label: "Shopping Help", href: "/us/shop/goto/help" },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "For Business",
        links: [
          { label: "Apple and Business", href: "/business/" },
          { label: "Shop for Business", href: "/retail/business/" },
        ],
      },
      {
        title: "For Education",
        links: [
          { label: "Apple and Education", href: "/education/" },
          { label: "Shop for K-12", href: "/education/k12/how-to-buy/" },
          { label: "Shop for College", href: "/us/shop/goto/educationrouting" },
        ],
      },
      {
        title: "For Healthcare",
        links: [
          { label: "Apple and Healthcare", href: "/healthcare/" },
        ],
      },
      {
        title: "For Government",
        links: [
          { label: "Apple and Government", href: "/government/" },
          { label: "Shop for Veterans and Military", href: "/us/shop/goto/eppstore/veteransandmilitary" },
          { label: "Shop for State and Local Employees", href: "/us_epp_67909/store" },
          { label: "Shop for Federal Employees", href: "/us_epp_55499/store" },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "Apple Values",
        links: [
          { label: "Accessibility", href: "/accessibility/" },
          { label: "Education", href: "/education-initiative/" },
          { label: "Environment", href: "/environment/" },
          { label: "Inclusion and Diversity", href: "/diversity/" },
          { label: "Privacy", href: "/privacy/" },
          { label: "Racial Equity and Justice", href: "/racial-equity-justice-initiative/" },
          { label: "Supply Chain Innovation", href: "/supply-chain/" },
        ],
      },
      {
        title: "About Apple",
        links: [
          { label: "Newsroom", href: "/newsroom/" },
          { label: "Apple Leadership", href: "/leadership/" },
          { label: "Career Opportunities", href: "/careers/us/" },
          { label: "Investors", href: "https://investor.apple.com/" },
          { label: "Ethics & Compliance", href: "/compliance/" },
          { label: "Events", href: "/apple-events/" },
          { label: "Contact Apple", href: "/contact/" },
        ],
      },
    ],
  },
];

export default function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <footer
      id="ac-globalfooter"
      className="w-full bg-[#f5f5f7] text-[#6e6e73] text-[12px] leading-[1.33337] tracking-[-0.01em] border-t border-[#d2d2d7]"
    >
      <div className="max-w-[980px] mx-auto px-[16px] sm:px-[22px]">
        {/* Footnotes Section (Sosumi) */}
        <section
          aria-label="Footnotes"
          className="pt-[17px] pb-[11px] border-b border-[#d2d2d7] text-[11px] leading-[1.36364] tracking-[-0.01em] text-[#6e6e73]"
        >
          <ul className="list-none m-0 p-0 space-y-[9.6px]">
            <li id="footnote-asterisk-1">
              <small className="mr-1">*</small>
              Through August 28, 2026, Apple will donate $10 for every purchase made in the U.S. using Apple Pay on{" "}
              <Link href="/homeone" className="text-[#424245] underline hover:text-[#1d1d1f]">
                apple.com
              </Link>
              , through the Apple Store app, or at an Apple Store. Donations are limited to a maximum of one million dollars ($1,000,000). The donation goes to the National Park Foundation.
            </li>
            <li id="footnote-asterisk-2">
              <small className="mr-1">**</small>
              Available for Qualified Purchasers only. Qualified Purchasers receive an Apple Gift Card when they purchase an eligible Mac or iPad (“Eligible Product”) at a Qualifying Location through September 24, 2026. Gift card values may vary by Eligible Product. Customers will receive a discount equal to the value of the Apple Gift Card off the price of the Eligible Product, but will be charged for all items in their cart, including the Apple Gift Card. Only one Apple Gift Card per Eligible Product per Qualified Purchaser. Offer subject to availability. While supplies last. Additional restrictions apply. View full offer terms{" "}
              <Link href="/shop" className="text-[#424245] underline hover:text-[#1d1d1f]">
                here
              </Link>
              .
            </li>
          </ul>

          <ol className="list-decimal pl-[17px] my-[9.6px] space-y-[9.6px]">
            <li id="footnote-1">
              Trade‑in values will vary based on the condition, year, and configuration of your eligible trade‑in device. Not all devices are eligible for credit. You must be at least the age of majority to be eligible to trade in for credit or for an Apple Gift Card. Trade‑in value may be applied toward qualifying new device purchase, or added to an Apple Gift Card. Actual value awarded is based on receipt of a qualifying device matching the description provided when estimate was made. Sales tax may be assessed on full value of a new device purchase. In‑store trade‑in requires presentation of a valid photo ID (local law may require saving this information). Offer may not be available in all stores and may vary between in‑store and online trade‑in. Some stores may have additional requirements. Apple or its trade‑in partners reserve the right to refuse, cancel, or limit quantity of any trade‑in transaction for any reason. More details are available from Apple’s trade-in partner for trade‑in and recycling of eligible devices. Restrictions and limitations may apply.
            </li>
          </ol>

          <ul className="list-none m-0 p-0 space-y-[9.6px]">
            <li>
              <p>
                To access and use all Apple&nbsp;Card features and products available only to Apple&nbsp;Card users, you must add Apple&nbsp;Card to Wallet on an iPhone or iPad that supports and has the latest version of iOS or iPadOS. Apple&nbsp;Card is subject to credit approval, available only for qualifying applicants in the United States, and issued by Goldman Sachs Bank USA, Salt Lake City Branch.
              </p>
              <p className="pt-[0.8em]">
                Apple&nbsp;Payments&nbsp;Services&nbsp;LLC, a subsidiary of Apple&nbsp;Inc., is a service provider of Goldman Sachs Bank USA for Apple&nbsp;Card and Savings accounts. Neither Apple&nbsp;Inc. nor Apple&nbsp;Payments&nbsp;Services&nbsp;LLC is a bank.
              </p>
              <p className="pt-[0.8em]">
                All communications from Apple and Goldman Sachs Bank USA about Apple&nbsp;Card (including transactional and marketing communications) and customer service support are available in English. Certain communications about Apple&nbsp;Card can be viewed in another language depending on your device language settings. If you reside in the U.S. Virgin Islands, American Samoa, Guam, Northern Mariana Islands, or U.S. Minor Outlying Islands, please call Goldman Sachs at 877-255-5923 with questions about Apple&nbsp;Card.
              </p>
            </li>
            <li>
              Learn more about how Apple Card applications are evaluated at{" "}
              <Link href="https://support.apple.com" className="text-[#424245] underline hover:text-[#1d1d1f]">
                support.apple.com/kb/HT209218
              </Link>
              .
            </li>
            <li>
              A subscription is required for Apple Arcade, Apple Fitness+, Apple Music, and Apple TV.
            </li>
            <li>
              Features are subject to change. Some features, applications, and services may not be available in all regions or all languages.
            </li>
          </ul>
        </section>

        {/* Directory Navigation 5-Columns */}
        <nav
          aria-label="Apple Directory"
          className="pt-[20px] pb-[28px] grid grid-cols-1 md:grid-cols-5 gap-y-0 md:gap-x-[20px]"
        >
          {footerColumns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col">
              {col.sections.map((sec) => {
                const isOpen = !!openSections[sec.title];
                return (
                  <div key={sec.title} className="border-b md:border-none border-[#d2d2d7] py-[10px] md:py-0 md:mb-[24px]">
                    {/* Mobile Button Header */}
                    <button
                      onClick={() => toggleSection(sec.title)}
                      className="w-full flex items-center justify-between md:hidden text-left font-normal text-[#1d1d1f] py-[2px]"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[12px] font-semibold">{sec.title}</span>
                      <span className="text-[12px] text-[#86868b]">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {/* Desktop Header Title */}
                    <h3 className="hidden md:block font-semibold text-[#1d1d1f] text-[12px] leading-[1.33337] mb-[0.8em] tracking-[-0.01em]">
                      {sec.title}
                    </h3>

                    {/* Directory Links List */}
                    <ul
                      className={`m-0 p-0 list-none space-y-[0.8em] pt-[8px] md:pt-0 ${
                        isOpen ? "block" : "hidden md:block"
                      }`}
                    >
                      {sec.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-[12px] text-[#6e6e73] hover:text-[#1d1d1f] hover:underline transition-colors block"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Legal & Country Selector Section */}
        <section className="pt-[17px] pb-[19px] border-t border-[#d2d2d7]">
          <div className="text-[12px] leading-[1.33337] text-[#6e6e73] mb-[7px]">
            More ways to shop:{" "}
            <Link href="/retail" className="text-[#0066cc] underline hover:text-[#0066cc]">
              Find an Apple Store
            </Link>{" "}
            or{" "}
            <Link href="/retail" className="text-[#0066cc] underline hover:text-[#0066cc]">
              other retailer
            </Link>{" "}
            near you. <span className="whitespace-nowrap">Or call <a href="tel:1-800-692-7753" className="text-[#0066cc] underline">1-800-MY-APPLE</a> (1-800-692-7753).</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-[6px] pt-[3px]">
            <div className="flex flex-col lg:flex-row lg:items-center gap-x-[30px] gap-y-[4px]">
              <div className="text-[12px] text-[#6e6e73]">
                Copyright © 2026 Apple Inc. All rights reserved.
              </div>

              <ul className="flex flex-wrap items-center gap-x-[7px] text-[12px] text-[#424245] m-0 p-0 list-none">
                <li>
                  <Link href="/privacy" className="hover:underline hover:text-[#1d1d1f]">
                    Privacy Policy
                  </Link>
                </li>
                <li className="text-[#d2d2d7]">|</li>
                <li>
                  <Link href="/legal/terms" className="hover:underline hover:text-[#1d1d1f]">
                    Terms of Use
                  </Link>
                </li>
                <li className="text-[#d2d2d7]">|</li>
                <li>
                  <Link href="/shop/refunds" className="hover:underline hover:text-[#1d1d1f]">
                    Sales and Refunds
                  </Link>
                </li>
                <li className="text-[#d2d2d7]">|</li>
                <li>
                  <Link href="/legal" className="hover:underline hover:text-[#1d1d1f]">
                    Legal
                  </Link>
                </li>
                <li className="text-[#d2d2d7]">|</li>
                <li>
                  <Link href="/sitemap" className="hover:underline hover:text-[#1d1d1f]">
                    Site Map
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-left md:text-right mt-[2px] md:mt-0">
              <Link
                href="/choose-country-region"
                className="text-[12px] text-[#424245] hover:text-[#1d1d1f] hover:underline"
              >
                United States
              </Link>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}
