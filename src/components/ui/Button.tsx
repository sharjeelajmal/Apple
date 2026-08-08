import React from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline" | "link";
type ButtonSize = "default" | "sm" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const getButtonClasses = (variant: ButtonVariant = "primary", size: ButtonSize = "default", className?: string) => {
  const baseClasses = "inline-flex items-center justify-center rounded-[980px] font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    primary: "bg-[#0071E3] text-white hover:bg-[#0077ED]",
    secondary: "border border-[#0066CC] text-[#0066CC] hover:bg-[#0066CC] hover:text-white",
    outline: "border border-[#0066CC] text-[#0066CC] bg-transparent hover:bg-[#0066CC] hover:text-white",
    link: "text-[#0066CC] hover:underline underline-offset-4",
  };
  
  const sizeClasses = {
    default: "px-[22px] py-[12px] text-[17px] leading-[20px] tracking-[-0.374px]",
    sm: "px-[16px] py-[8px] text-[14px]",
    lg: "px-[28px] py-[14px] text-[19px]",
  };

  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ""}`.trim();
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", href, ...props }, ref) => {
    const classes = getButtonClasses(variant, size, className);
    
    if (href) {
      return (
        <Link href={href} className={classes}>
          {props.children as React.ReactNode}
        </Link>
      );
    }
    return (
      <button className={classes} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";
