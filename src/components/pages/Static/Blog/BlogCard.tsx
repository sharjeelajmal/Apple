import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/data/pages/blogData";
import BlogMeta from "./BlogMeta";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link
      href={`/blogs/news/${post.slug}`}
      className={`group grid overflow-hidden rounded-card border border-line-light bg-surface shadow-soft transition-transform duration-300 ease-smooth hover:-translate-y-1 ${
        featured ? "md:grid-cols-2" : ""
      }`}
    >
      <div className={`relative overflow-hidden bg-surface-muted ${featured ? "aspect-[16/10] md:aspect-auto md:min-h-[400px]" : "aspect-[16/10]"}`}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes={featured ? "(min-width: 768px) 600px, 100vw" : "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
        />
      </div>
      <div className={`flex flex-col p-6 ${featured ? "justify-center md:p-12" : "md:p-7"}`}>
        <BlogMeta post={post} />
        <h2
          className={`mt-3 font-semibold tracking-tight text-ink ${
            featured ? "text-[28px] leading-tight md:text-[36px]" : "text-[21px] leading-snug"
          }`}
        >
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-ink-muted">{post.excerpt}</p>
        <span className="mt-5 text-[15px] font-medium text-accent group-hover:underline">Read more</span>
      </div>
    </Link>
  );
}
