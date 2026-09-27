import { Mail } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import MessageCard from "@/components/admin/messages/MessageCard";
import EmptyState from "@/components/shared/dashboard/EmptyState";
import { requireAdmin } from "@/lib/adminAuth";
import { getContactMessages } from "@/lib/messages";

export default async function MessagesPage() {
  await requireAdmin();
  const messages = await getContactMessages();
  const unreadCount = messages.filter((message) => message.status === "new").length;

  return (
    <>
      <AdminPageHeader
        title="Messages"
        description={`Messages sent from the Contact Us page${unreadCount ? ` · ${unreadCount} unread` : ""}.`}
      />

      {messages.length ? (
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Mail} title="No messages yet." description="Messages from the Contact Us form will appear here." />
      )}
    </>
  );
}
