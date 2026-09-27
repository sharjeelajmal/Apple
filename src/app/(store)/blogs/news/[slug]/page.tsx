import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import BlogCard from "@/components/pages/Static/Blog/BlogCard";
import BlogMeta from "@/components/pages/Static/Blog/BlogMeta";
import UserAvatar from "@/components/shared/UserAvatar";
import { siteConfig } from "@/config/site";
import { blogPosts, getBlogPost } from "@/data/pages/blogData";

const RELATED_POSTS_LIMIT = 3;

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blogs/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  return post
    ? {
        title: `${post.title} | ${siteConfig.name}`,
        description: post.excerpt,
        openGraph: { title: post.title, description: post.excerpt, images: [post.image], type: "article" },
      }
    : {};
}

export default async function BlogPostPage({ params }: PageProps<"/blogs/news/[slug]">) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter((item) => item.slug !== slug).slice(0, RELATED_POSTS_LIMIT);

  return (
    <div className="bg-surface-muted pb-20 md:pb-28">
      <article>
        <header className="mx-auto max-w-[800px] px-4 pb-10 pt-12 sm:px-6 md:pt-20 lg:px-8">
          <Link href="/blogs/news" className="mb-8 inline-flex items-center gap-1 text-[14px] text-hyperlink hover:underline">
            <ChevronLeft size={16} />
            All stories
          </Link>
          <BlogMeta post={post} />
          <h1 className="mt-4 text-[36px] font-semibold leading-[1.1] tracking-tight text-ink md:text-[52px]">
            {post.title}
          </h1>
          <p className="mt-5 text-[19px] leading-relaxed text-ink-muted md:text-[21px]">{post.excerpt}</p>
          <div className="mt-8 flex items-center gap-3">
            <UserAvatar name={post.author} className="h-10 w-10 text-[14px]" />
            <span className="text-[15px] font-medium text-ink">{post.author}</span>
          </div>
        </header>

        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-surface">
            <Image src={post.image} alt={post.title} fill priority sizes="(min-width: 1100px) 1100px, 100vw" className="object-cover" />
          </div>
        </div>

        <div className="mx-auto max-w-[720px] px-4 pt-12 sm:px-6 md:pt-16 lg:px-8">
          {post.content.map(({ type, text }) =>
            type === "heading" ? (
              <h2 key={text} className="mb-4 mt-10 text-[28px] font-semibold tracking-tight text-ink">
                {text}
              </h2>
            ) : (
              <p key={text} className="mb-6 text-[19px] leading-[1.7] text-ink/85">
                {text}
              </p>
            )
          )}
        </div>
      </article>

      <section className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-6 md:mt-28 lg:px-8">
        <h2 className="mb-8 text-[28px] font-semibold tracking-tight text-ink md:text-[36px]">Keep reading.</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.map((relatedPost) => (
            <BlogCard key={relatedPost.slug} post={relatedPost} />
          ))}
        </div>
      </section>
    </div>
  );
}
