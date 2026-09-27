import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/adminAuth";
import { messagesCollection } from "@/lib/messages";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const newMessageCount = await messagesCollection.countDocuments({ status: "new" });

  return <AdminShell newMessageCount={newMessageCount}>{children}</AdminShell>;
}
