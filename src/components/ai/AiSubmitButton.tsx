import { Sparkles } from "lucide-react";
import Spinner from "@/components/ui/Spinner";

type AiSubmitButtonProps = {
  isLoading: boolean;
  label: string;
  loadingLabel: string;
};

export default function AiSubmitButton({ isLoading, label, loadingLabel }: AiSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="flex h-12 items-center justify-center gap-2 self-start rounded-full bg-accent px-7 text-[16px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
    >
      {isLoading ? <Spinner className="h-4 w-4" /> : <Sparkles size={18} />}
      {isLoading ? loadingLabel : label}
    </button>
  );
}
