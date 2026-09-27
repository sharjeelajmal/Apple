import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FormAlertProps {
  message: string;
  tone?: "error" | "success";
}

const toneStyles = {
  error: { className: "border-danger/20 bg-danger-soft text-danger", icon: AlertCircle },
  success: { className: "border-positive/30 bg-positive/10 text-ink", icon: CheckCircle2 },
};

export default function FormAlert({ message, tone = "error" }: FormAlertProps) {
  if (!message) return null;

  const { className, icon: Icon } = toneStyles[tone];

  return (
    <div role="alert" className={`flex items-start gap-3 rounded-field border px-4 py-3 text-[14px] ${className}`}>
      <Icon size={18} className="mt-px shrink-0" />
      <p>{message}</p>
    </div>
  );
}
