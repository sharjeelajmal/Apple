import Form from "next/form";
import { Bot, MessagesSquare, PackageCheck, Search, Users } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ChatStatTile from "@/components/admin/chats/ChatStatTile";
import ConversationTable from "@/components/admin/chats/ConversationTable";
import EmptyState from "@/components/shared/dashboard/EmptyState";
import { requireAdmin } from "@/lib/adminAuth";
import { getAssistantConversations, getAssistantStats } from "@/lib/assistantLog";

export default async function AdminChatsPage({ searchParams }: PageProps<"/admin/chats">) {
  await requireAdmin();
  const { q } = await searchParams;
  const search = typeof q === "string" ? q : "";
  const [conversations, stats] = await Promise.all([getAssistantConversations(search), getAssistantStats()]);

  return (
    <>
      <AdminPageHeader
        title="AI Chats"
        description="Every conversation customers have with the AI assistant, saved even if they clear the chat on their side."
      />

      <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <ChatStatTile icon={MessagesSquare} label="Conversations" value={stats.conversations} />
        <ChatStatTile icon={Users} label="Customers" value={stats.customers} />
        <ChatStatTile icon={Bot} label="Messages" value={stats.messages} />
        <ChatStatTile icon={PackageCheck} label="Order actions by AI" value={stats.actions} />
      </div>

      <Form action="/admin/chats" className="relative mb-6 max-w-[420px]">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle" />
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Search by name, email or question"
          aria-label="Search chats"
          className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-[14px] text-ink outline-none focus:border-accent"
        />
      </Form>

      {conversations.length ? (
        <ConversationTable conversations={conversations} />
      ) : (
        <EmptyState
          icon={Bot}
          title={search ? "No chats match your search." : "No chats yet."}
          description="Conversations appear here as soon as a signed-in customer messages the assistant."
        />
      )}
    </>
  );
}
