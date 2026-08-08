"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/config/navigation";

export default function NavLinks() {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <li
          key={link.label}
          className="flex flex-col items-start px-0"
        >
          <Link
            href={link.href}
            className="flex flex-row justify-center items-center px-2 h-[44px] text-[12px] font-normal text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors whitespace-nowrap"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </>
  );
}
