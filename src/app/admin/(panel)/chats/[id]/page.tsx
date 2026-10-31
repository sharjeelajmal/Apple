import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronLeft, History, MessagesSquare } from "lucide-react";
import ChatTranscript from "@/components/admin/chats/ChatTranscript";
import UserAvatar from "@/components/shared/UserAvatar";
import { requireAdmin } from "@/lib/adminAuth";
import { getAssistantConversation } from "@/lib/assistantLog";
import { formatDate } from "@/lib/format";

const formatDateTime = (value: string) => formatDate(value, { year: "numeric", hour: "numeric", minute: "2-digit" });

export default async function AdminChatPage({ params }: PageProps<"/admin/chats/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const conversation = await getAssistantConversation(id);
  if (!conversation) notFound();

  return (
    <>
      <Link href="/admin/chats" className="mb-6 inline-flex items-center gap-1 text-[14px] text-ink-muted hover:text-ink">
        <ChevronLeft size={16} />
        All chats
      </Link>

      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-card border border-line-light bg-surface p-5 shadow-soft">
        <div className="flex items-center gap-4">
          <UserAvatar name={conversation.userName} className="h-12 w-12 text-[16px]" />
          <div>
            <h1 className="text-[21px] font-semibold text-ink">{conversation.userName}</h1>
            <Link
              href={`/admin/customers/${encodeURIComponent(conversation.userEmail)}`}
              className="text-[14px] text-accent hover:underline"
            >
              {conversation.userEmail}
            </Link>
          </div>
        </div>
        <dl className="flex flex-wrap gap-6 text-[13px]">
          {[
            { icon: CalendarDays, label: "Started", value: formatDateTime(conversation.startedAt) },
            { icon: History, label: "Last message", value: formatDateTime(conversation.lastMessageAt) },
            { icon: MessagesSquare, label: "Messages", value: String(conversation.messageCount) },
          ].map(({ icon: Icon, ...item }) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Icon size={17} />
              </span>
              <div>
                <dt className="text-ink-subtle">{item.label}</dt>
                <dd className="font-medium text-ink">{item.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </header>

      <div className="rounded-card border border-line-light bg-surface-muted/50 p-5 md:p-8">
        <ChatTranscript messages={conversation.messages} />
      </div>
    </>
  );
}
