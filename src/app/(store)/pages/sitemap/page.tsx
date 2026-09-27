import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/pages/Static/PageHero";
import { siteConfig } from "@/config/site";
import { sitemapGroups } from "@/config/siteLinks";
import { blogPosts } from "@/data/pages/blogData";

export const metadata: Metadata = {
  title: `Site Map | ${siteConfig.name}`,
  description: `Find every page on the ${siteConfig.name} website in one place.`,
};

const groups = [
  ...sitemapGroups,
  {
    title: "Latest Stories",
    links: blogPosts.map(({ slug, title }) => ({ label: title, href: `/blogs/news/${slug}` })),
  },
];

export default function SitemapPage() {
  return (
    <>
      <PageHero eyebrow="Site Map" title="Everything, in one place." />

      <div className="bg-surface-muted pb-20 md:pb-28">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-10 gap-y-12 rounded-[28px] border border-line-light bg-surface p-6 shadow-soft sm:grid-cols-2 sm:p-10 lg:grid-cols-3 md:p-14">
            {groups.map(({ title, links }) => (
              <section key={title}>
                <h2 className="border-b border-line-light pb-3 text-[17px] font-semibold text-ink">{title}</h2>
                <ul className="mt-4 flex flex-col gap-3 text-[15px]">
                  {links.map(({ label, href }) => (
                    <li key={href}>
                      <Link href={href} className="text-ink-muted transition-colors hover:text-hyperlink">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
