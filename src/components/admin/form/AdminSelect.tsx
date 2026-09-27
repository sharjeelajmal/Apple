"use client";

import { useState } from "react";
import CustomDropdown, { type DropdownOption } from "@/components/shared/CustomDropdown";

export const adminSelectButtonClass =
  "flex h-11 w-full items-center justify-between rounded-[10px] border border-line bg-surface px-3.5 text-left text-[15px] text-ink outline-none transition-all duration-200 hover:border-ink-subtle focus:border-accent focus:ring-4 focus:ring-accent/15";

interface AdminSelectProps {
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

export default function AdminSelect({
  options,
  value,
  defaultValue = "",
  onChange,
  name,
  placeholder,
  ariaLabel,
  className = "w-full",
}: AdminSelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;

  return (
    <CustomDropdown
      options={options}
      value={currentValue}
      onChange={(nextValue) => {
        setInternalValue(nextValue);
        onChange?.(nextValue);
      }}
      name={name}
      placeholder={placeholder}
      ariaLabel={ariaLabel}
      align="left"
      className={className}
      buttonClassName={adminSelectButtonClass}
    />
  );
}
