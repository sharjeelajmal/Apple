import type { TextareaHTMLAttributes } from "react";

interface FloatingTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export default function FloatingTextarea({ label, error, id, className = "", ...props }: FloatingTextareaProps) {
  const fieldId = id ?? props.name;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={className}>
      <div
        className={`relative rounded-field border bg-surface transition-all duration-300 ease-smooth focus-within:ring-4 ${
          error
            ? "border-danger bg-danger-soft focus-within:ring-danger/15"
            : "border-line hover:border-ink-subtle focus-within:border-accent focus-within:ring-accent/15"
        }`}
      >
        <textarea
          id={fieldId}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className="peer block min-h-[160px] w-full resize-y rounded-field bg-transparent px-4 pb-3 pt-7 text-[17px] text-ink outline-none"
          {...props}
        />
        <label
          htmlFor={fieldId}
          className="pointer-events-none absolute left-4 top-4 text-[17px] text-ink-subtle transition-all duration-200 ease-smooth peer-focus:top-2 peer-focus:text-[12px] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[12px]"
        >
          {label}
        </label>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 pl-1 text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
