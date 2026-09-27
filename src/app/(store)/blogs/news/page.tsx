import type { Metadata } from "next";
import BlogCard from "@/components/pages/Static/Blog/BlogCard";
import PageHero from "@/components/pages/Static/PageHero";
import { siteConfig } from "@/config/site";
import { blogPosts } from "@/data/pages/blogData";

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name}`,
  description: "Reviews, buying guides, and tips to help you get more from your Apple devices.",
};

export default function BlogPage() {
  const [featuredPost, ...posts] = blogPosts;

  return (
    <>
      <PageHero
        eyebrow="The Blog"
        title="Stories, guides & news."
        description="Reviews, buying guides, and tips to help you get more from the devices you love."
      />

      <div className="bg-surface-muted pb-20 md:pb-28">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <BlogCard post={featuredPost} featured />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
