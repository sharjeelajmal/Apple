import { Eye, EyeOff } from "lucide-react";

interface PasswordToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

export default function PasswordToggle({ isVisible, onToggle }: PasswordToggleProps) {
  return (
    <button
      type="button"
      aria-label={isVisible ? "Hide password" : "Show password"}
      onClick={onToggle}
      className="flex h-10 w-10 items-center justify-center rounded-full text-ink-subtle transition-colors hover:text-ink"
    >
      {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}
