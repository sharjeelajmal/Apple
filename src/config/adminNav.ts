import { Bot, LayoutDashboard, LayoutTemplate, Mail, Package, ShoppingBag, Star, Users, type LucideIcon } from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Home Page CMS", href: "/admin/cms", icon: LayoutTemplate },
  { label: "Inventory", href: "/admin/inventory", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reviews & Q&A", href: "/admin/reviews", icon: Star },
  { label: "AI Chats", href: "/admin/chats", icon: Bot },
  { label: "Messages", href: "/admin/messages", icon: Mail },
];
