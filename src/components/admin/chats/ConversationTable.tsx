import Link from "next/link";
import { Camera, ChevronRight, PackageCheck } from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";
import { formatDate } from "@/lib/format";
import type { AssistantConversationSummary } from "@/types/assistantLog";

const formatDateTime = (value: string) => formatDate(value, { year: "numeric", hour: "numeric", minute: "2-digit" });

export default function ConversationTable({ conversations }: { conversations: AssistantConversationSummary[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line-light bg-surface shadow-soft">
      <table className="w-full min-w-[860px] text-left text-[14px]">
        <thead className="border-b border-line-light text-[12px] uppercase tracking-wider text-ink-subtle">
          <tr>
            <th className="px-5 py-3 font-medium">Customer</th>
            <th className="px-5 py-3 font-medium">First question</th>
            <th className="px-5 py-3 font-medium">Messages</th>
            <th className="px-5 py-3 font-medium">Last activity</th>
            <th className="w-10 px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-line-light">
          {conversations.map((conversation) => {
            const href = `/admin/chats/${conversation.id}`;
            return (
              <tr key={conversation.id} className="transition-colors hover:bg-surface-muted">
                <td className="px-5 py-3">
                  <Link href={href} className="flex items-center gap-3">
                    <UserAvatar name={conversation.userName} className="h-10 w-10 text-[14px]" />
                    <span>
                      <span className="block font-semibold text-ink">{conversation.userName}</span>
                      <span className="block text-[13px] text-ink-muted">{conversation.userEmail}</span>
                    </span>
                  </Link>
                </td>
                <td className="max-w-[320px] px-5 py-3">
                  <Link href={href} className="line-clamp-2 text-ink hover:text-accent">
                    {conversation.firstQuestion}
                  </Link>
                  <span className="mt-1 flex flex-wrap gap-2 text-[12px] text-ink-muted">
                    {conversation.imageCount > 0 && (
                      <span className="flex items-center gap-1">
                        <Camera size={12} />
                        {conversation.imageCount} {conversation.imageCount === 1 ? "photo" : "photos"}
                      </span>
                    )}
                    {conversation.actionCount > 0 && (
                      <span className="flex items-center gap-1 font-medium text-amber-700">
                        <PackageCheck size={12} />
                        {conversation.actionCount} order {conversation.actionCount === 1 ? "action" : "actions"}
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-5 py-3 text-ink">{conversation.messageCount}</td>
                <td className="px-5 py-3 text-ink-muted">{formatDateTime(conversation.lastMessageAt)}</td>
                <td className="px-5 py-3">
                  <Link href={href} aria-label={`Open chat with ${conversation.userName}`} className="text-ink-subtle hover:text-ink">
                    <ChevronRight size={18} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
