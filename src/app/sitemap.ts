import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { sitemapGroups } from "@/config/siteLinks";
import { blogPosts } from "@/data/pages/blogData";

const PRIVATE_PATHS = ["/account", "/cart", "/wishlist"];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = sitemapGroups
    .flatMap((group) => group.links)
    .filter(({ href }) => !PRIVATE_PATHS.some((path) => href.startsWith(path)))
    .map(({ href }) => ({ url: `${siteConfig.url}${href}` }));

  const posts = blogPosts.map(({ slug, publishedAt }) => ({
    url: `${siteConfig.url}/blogs/news/${slug}`,
    lastModified: publishedAt,
  }));

  return [...pages, ...posts];
}
