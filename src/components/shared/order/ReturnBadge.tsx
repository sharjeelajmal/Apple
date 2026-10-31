import { Undo2 } from "lucide-react";
import { returnStatusLabels, type ReturnStatus } from "@/types/order";

const returnStyles: Record<ReturnStatus, string> = {
  requested: "bg-amber-50 text-amber-700",
  approved: "bg-positive/10 text-positive",
  rejected: "bg-danger-soft text-danger",
};

export default function ReturnBadge({ status }: { status: ReturnStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-semibold ${returnStyles[status]}`}>
      <Undo2 size={12} />
      {returnStatusLabels[status]}
    </span>
  );
}
