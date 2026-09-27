import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface FloatingFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  trailing?: ReactNode;
}

const FloatingField = forwardRef<HTMLInputElement, FloatingFieldProps>(
  ({ label, error, trailing, id, className = "", ...props }, ref) => {
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
          <input
            ref={ref}
            id={fieldId}
            placeholder=" "
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
            className={`peer h-14 w-full rounded-field bg-transparent px-4 pt-5 text-[17px] text-ink outline-none ${
              trailing ? "pr-14" : ""
            }`}
            {...props}
          />
          <label
            htmlFor={fieldId}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-ink-subtle transition-all duration-200 ease-smooth peer-focus:top-[14px] peer-focus:text-[12px] peer-[:not(:placeholder-shown)]:top-[14px] peer-[:not(:placeholder-shown)]:text-[12px]"
          >
            {label}
          </label>
          {trailing && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>
          )}
        </div>
        {error && (
          <p id={errorId} role="alert" className="mt-2 pl-1 text-[13px] text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FloatingField.displayName = "FloatingField";

export default FloatingField;
