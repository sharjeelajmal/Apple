import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { AUTH_ROUTES } from "@/config/auth";

export default function AssistantSignInPrompt({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet-500 text-white shadow-float">
        <LockKeyhole size={36} />
      </span>
      <h3 className="mt-6 text-[21px] font-semibold text-ink">Sign in to chat</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
        Our AI assistant is available to signed-in customers, so it can check your orders and keep your conversation safe.
      </p>
      <div className="mt-6 flex w-full flex-col gap-3">
        <Link
          href={AUTH_ROUTES.login}
          onClick={onNavigate}
          className="flex h-11 items-center justify-center rounded-full bg-accent text-[15px] font-medium text-white hover:bg-accent-hover"
        >
          Sign in
        </Link>
        <Link
          href={AUTH_ROUTES.register}
          onClick={onNavigate}
          className="flex h-11 items-center justify-center rounded-full border border-line text-[15px] font-medium text-ink hover:border-ink"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
