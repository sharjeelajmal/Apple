import { BookOpen, PackageSearch, PackageX, Search, Tag, Undo2, Wrench, type LucideIcon } from "lucide-react";
import { adminToolLabels } from "@/config/assistant";
import type { AssistantToolCall } from "@/types/assistantLog";

const toolIcons: Record<string, LucideIcon> = {
  search_products: Search,
  get_product_details: Tag,
  get_my_orders: PackageSearch,
  cancel_order: PackageX,
  request_return: Undo2,
  get_store_info: BookOpen,
};

const describeInput = (input: Record<string, unknown>) =>
  Object.entries(input)
    .filter(([key, value]) => key !== "confirmed" && value !== "" && value !== undefined)
    .map(([key, value]) => `${key.replace(/_/g, " ")}: ${String(value)}`)
    .join(" · ");

export default function ToolCallList({ toolCalls }: { toolCalls: AssistantToolCall[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {toolCalls.map((call, index) => {
        const Icon = toolIcons[call.name] ?? Wrench;
        const details = describeInput(call.input);
        return (
          <li
            key={index}
            className={`flex items-start gap-2 rounded-field px-3 py-2 text-[13px] ${
              call.ok ? "bg-surface-muted text-ink-muted" : "bg-danger-soft text-danger"
            }`}
          >
            <Icon size={15} className="mt-0.5 shrink-0" />
            <span>
              <span className="font-semibold text-ink">{adminToolLabels[call.name] ?? call.name}</span>
              {details && <span> ({details})</span>}
              <span className="block">{call.summary}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
