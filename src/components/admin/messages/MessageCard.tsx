"use client";

import { useTransition } from "react";
import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { deleteMessage, setMessageStatus } from "@/actions/admin/messageActions";
import { formatDate } from "@/lib/format";
import type { ContactMessage } from "@/lib/messages";

export default function MessageCard({ message }: { message: ContactMessage }) {
  const [isPending, startTransition] = useTransition();
  const isNew = message.status === "new";

  const handleDelete = () => {
    if (window.confirm(`Delete the message from ${message.name}?`)) {
      startTransition(() => deleteMessage(message.id));
    }
  };

  return (
    <article
      className={`rounded-card border bg-surface p-5 shadow-soft transition-opacity md:p-6 ${
        isNew ? "border-accent/40" : "border-line-light"
      } ${isPending ? "opacity-60" : ""}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[16px] font-semibold text-ink">
            {isNew && <span className="h-2 w-2 rounded-full bg-accent" aria-label="Unread" />}
            {message.name}
          </p>
          <p className="text-[13px] text-ink-muted">
            {message.email}
            {message.orderNumber && ` · Order ${message.orderNumber}`}
          </p>
        </div>
        <time className="text-[13px] text-ink-subtle" dateTime={message.createdAt}>
          {formatDate(message.createdAt, { year: "numeric", hour: "numeric", minute: "2-digit" })}
        </time>
      </header>

      <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-ink">{message.message}</p>

      <footer className="mt-5 flex flex-wrap gap-2 border-t border-line-light pt-4">
        <a
          href={`mailto:${message.email}?subject=${encodeURIComponent("Re: Your message")}`}
          className="flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-medium text-white hover:bg-black"
        >
          <Reply size={15} />
          Reply
        </a>
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => setMessageStatus(message.id, isNew ? "read" : "new"))}
          className="flex h-9 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-ink hover:bg-surface-muted"
        >
          {isNew ? <MailOpen size={15} /> : <Mail size={15} />}
          {isNew ? "Mark as read" : "Mark as unread"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={handleDelete}
          className="flex h-9 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-danger hover:border-danger hover:bg-danger-soft"
        >
          <Trash2 size={15} />
          Delete
        </button>
      </footer>
    </article>
  );
}
