import type { InputHTMLAttributes, ReactNode } from "react";

export const checkoutInputClass =
  "w-full h-[56px] px-4 rounded-lg border outline-none text-[17px] text-ink transition-all bg-surface-muted focus:bg-surface focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-ink-subtle";

export const checkoutControlClass = (hasError: boolean) =>
  `${checkoutInputClass} flex items-center justify-between gap-3 text-left ${hasError ? "border-danger" : "border-line"}`;

interface CheckoutFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  containerClassName?: string;
}

export default function CheckoutField({
  error,
  leading,
  trailing,
  containerClassName = "",
  className = "",
  ...props
}: CheckoutFieldProps) {
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      <div className="relative">
        {leading && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle">{leading}</span>}
        <input
          aria-invalid={Boolean(error)}
          aria-label={props.placeholder}
          className={`${checkoutInputClass} ${error ? "border-danger" : "border-line"} ${leading ? "pl-12" : ""} ${trailing ? "pr-20" : ""} ${className}`}
          {...props}
        />
        {trailing && <span className="absolute right-4 top-1/2 -translate-y-1/2">{trailing}</span>}
      </div>
      <FieldError message={error} />
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 pl-1 text-[13px] text-danger">
      {message}
    </p>
  );
}
