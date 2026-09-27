import type { ReactNode } from "react";
import Spinner from "./Spinner";

interface SubmitButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  children: ReactNode;
}

export default function SubmitButton({ isLoading, disabled, children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className="mt-2 flex h-11 items-center justify-center gap-2 self-start rounded-full bg-accent px-6 text-[15px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
    >
      {isLoading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}
