import Image from "next/image";
import Link from "next/link";
import { Home, Phone, Mail, ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { siteConfig } from "@/config/site";
import { footerLinkGroups } from "@/config/siteLinks";

export default function Footer() {
  return (
    <footer className="w-full bg-white pt-16 pb-8 sm:pt-24 border-t border-[#f5f5f7]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Column 1: Contact Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-8 hover:opacity-80 transition-opacity">
              <Image 
                src="/Header/applelogo.png" 
                alt="Astor" 
                width={150} 
                height={40} 
                className="max-w-[130px]"
              />
            </Link>
            <div className="flex flex-col gap-4 text-[14px] text-[#6e6e73]">
              <p className="flex items-start gap-3">
                <span className="mt-1 text-[#1d1d1f]"><Home size={18} /></span>
                <span className="leading-relaxed">{siteConfig.contact.address}</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-[#1d1d1f]"><Phone size={18} /></span>
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-[#1d1d1f] transition-colors">{siteConfig.contact.phone}</a>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-[#1d1d1f]"><Mail size={18} /></span>
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-[#1d1d1f] transition-colors">{siteConfig.contact.email}</a>
              </p>
            </div>
          </div>

          {footerLinkGroups.map(({ title, links }) => (
            <div key={title} className="lg:col-span-1">
              <h5 className="text-[#1d1d1f] font-semibold text-[16px] mb-6 tracking-tight">{title}</h5>
              <ul className="flex flex-col gap-3.5 text-[14px] text-[#6e6e73]">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-[#1d1d1f] transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Social Media */}
          <div className="lg:col-span-1">
            <h5 className="text-[#1d1d1f] font-semibold text-[16px] mb-6 tracking-tight">Social Media</h5>
            <ul className="flex flex-col gap-3.5 text-[14px] text-[#6e6e73]">
              <li><a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#1d1d1f] transition-colors"><FaFacebook size={18} /> Facebook</a></li>
              <li><a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#1d1d1f] transition-colors"><FaInstagram size={18} /> Instagram</a></li>
              <li><a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#1d1d1f] transition-colors"><FaLinkedin size={18} /> LinkedIn</a></li>
              <li><a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#1d1d1f] transition-colors"><FaTwitter size={18} /> Twitter</a></li>
            </ul>
          </div>

          {/* Column 5: Subscription */}
          <div className="lg:col-span-1">
            <h2 className="text-[#1d1d1f] text-[20px] font-semibold mb-3 tracking-tight">Subscribe.</h2>
            <p className="text-[14px] text-[#6e6e73] mb-6 leading-relaxed">
              Sign up to get the latest on new products, events, and more.
            </p>
            <form className="relative group">
              <input 
                type="email" 
                placeholder="Your email address." 
                className="w-full bg-[#f5f5f7] border border-transparent rounded-full py-3.5 pl-5 pr-12 text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#d2d2d7] focus:bg-white transition-all duration-300"
                required
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white text-[#1d1d1f] rounded-full shadow-sm hover:bg-[#1d1d1f] hover:text-white transition-all duration-300"
                aria-label="Subscribe"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-[#f5f5f7] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[13px] text-[#86868b]">Copyright © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
            {/* Minimalist Payment Icons */}
            <div className="h-7 w-11 bg-[#f5f5f7] rounded-md flex items-center justify-center border border-[#e5e5ea] text-[#1d1d1f] font-bold text-[9px] tracking-wider">PAYPAL</div>
            <div className="h-7 w-11 bg-[#f5f5f7] rounded-md flex items-center justify-center border border-[#e5e5ea] text-[#1d1d1f] font-bold text-[11px] tracking-wider">VISA</div>
            <div className="h-7 w-11 bg-[#f5f5f7] rounded-md flex items-center justify-center border border-[#e5e5ea] flex-col">
              <div className="flex gap-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1d1d1f]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#86868b] -ml-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
