import { formatLongDate } from "@/lib/format";
import type { BlogPost } from "@/data/pages/blogData";

interface BlogMetaProps {
  post: Pick<BlogPost, "category" | "publishedAt" | "readTime">;
}

export default function BlogMeta({ post }: BlogMetaProps) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 text-[13px] text-ink-muted">
      <span className="font-semibold uppercase tracking-wider text-accent">{post.category}</span>
      <span aria-hidden>·</span>
      <time dateTime={post.publishedAt}>{formatLongDate(post.publishedAt)}</time>
      <span aria-hidden>·</span>
      <span>{post.readTime}</span>
    </p>
  );
}
