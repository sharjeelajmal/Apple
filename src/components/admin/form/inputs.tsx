import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const baseClassName =
  "w-full rounded-[10px] border border-line bg-surface px-3.5 text-[15px] text-ink outline-none transition-all duration-200 placeholder:text-ink-subtle hover:border-ink-subtle focus:border-accent focus:ring-4 focus:ring-accent/15 disabled:opacity-60";

export function TextInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`h-11 ${baseClassName} ${className}`} {...props} />;
}

export function TextArea({ className = "", rows = 4, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={`resize-y py-2.5 leading-relaxed ${baseClassName} ${className}`} {...props} />;
}
