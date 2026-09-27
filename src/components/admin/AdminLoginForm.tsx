"use client";

import { useActionState } from "react";
import FloatingField from "@/components/ui/FloatingField";
import FormAlert from "@/components/ui/FormAlert";
import Spinner from "@/components/ui/Spinner";
import { adminLogin } from "@/actions/admin/authActions";

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(adminLogin, { error: "" });

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <FormAlert message={state.error} />
      <FloatingField name="email" type="email" label="Admin Email" autoComplete="username" required />
      <FloatingField name="password" type="password" label="Password" autoComplete="current-password" required />
      <button
        type="submit"
        disabled={isPending}
        className="mt-3 flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-[17px] font-medium text-white transition-colors hover:bg-black disabled:opacity-70"
      >
        {isPending && <Spinner className="h-4 w-4" />}
        {isPending ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
