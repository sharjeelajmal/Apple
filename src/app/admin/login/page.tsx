import { redirect } from "next/navigation";
import { FaApple } from "react-icons/fa";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { siteConfig } from "@/config/site";
import { ADMIN_ROUTES, isAdminAuthenticated } from "@/lib/adminAuth";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect(ADMIN_ROUTES.dashboard);
  }

  return (
    <main className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-surface-muted px-4 py-16">
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="w-full max-w-[420px] rounded-[28px] border border-white/60 bg-surface/80 p-8 shadow-float backdrop-blur-xl sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
            <FaApple size={28} />
          </span>
          <h1 className="mt-5 text-[28px] font-semibold tracking-tight text-ink">{siteConfig.name} Admin</h1>
          <p className="mt-2 text-[15px] text-ink-muted">Sign in to manage your store.</p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
