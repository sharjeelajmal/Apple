'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import FloatingPanel from '@/components/ui/FloatingPanel';
import useDismiss from '@/hooks/useDismiss';

const LIST_MAX_HEIGHT = 280;

export type DropdownOption = {
  label: string;
  value: string;
};

type CustomDropdownProps = {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  name?: string;
  ariaLabel?: string;
  disabled?: boolean;
  align?: 'left' | 'right';
};

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  className = '',
  buttonClassName,
  name,
  ariaLabel,
  disabled = false,
  align = 'right',
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dismissRefs = useMemo(() => [triggerRef, panelRef], []);
  const closeDropdown = useCallback(() => setIsOpen(false), []);

  const selectedOption = options.find((opt) => opt.value === value);

  useDismiss(dismissRefs, closeDropdown);

  return (
    <div className={`relative ${className}`} ref={triggerRef}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClassName || "flex items-center justify-between min-w-[80px] w-full bg-gray-100/80 hover:bg-gray-200/80 text-[#1d1d1f] font-medium text-[14px] py-1.5 pl-3 pr-2 rounded-lg transition-colors border-none outline-none focus:ring-2 focus:ring-[#0071e3]/20"}
      >
        <span className="truncate mr-2">{selectedOption ? selectedOption.label : placeholder}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-[#6e6e73]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <FloatingPanel
            ref={panelRef}
            anchorRef={triggerRef}
            align={align}
            maxHeight={LIST_MAX_HEIGHT}
            className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-xl shadow-lg"
          >
            <ul role="listbox" aria-label={ariaLabel ?? placeholder} className="py-1">
              {options.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === option.value}
                    className={`w-full text-left px-4 py-2 text-[14px] transition-colors ${
                      value === option.value
                        ? 'bg-[#0071e3]/10 text-[#0071e3] font-medium'
                        : 'text-[#1d1d1f] hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </FloatingPanel>
        )}
      </AnimatePresence>
    </div>
  );
}
