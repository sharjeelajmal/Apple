import { Sparkles } from "lucide-react";

export default function AiLoading({ message, lines = 3 }: { message: string; lines?: number }) {
  return (
    <div role="status" className="rounded-card bg-surface-muted p-5 md:p-6">
      <p className="flex items-center gap-2 text-[14px] font-medium text-accent">
        <Sparkles size={16} className="animate-pulse" />
        {message}
      </p>
      <div className="mt-4 flex flex-col gap-2.5">
        {Array.from({ length: lines }, (_, index) => (
          <span
            key={index}
            className="h-3 animate-pulse rounded-full bg-line-light"
            style={{ width: `${90 - index * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}
