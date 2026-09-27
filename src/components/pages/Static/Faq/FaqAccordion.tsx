"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/data/pages/faqData";

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <ul className="divide-y divide-line-light rounded-card border border-line-light bg-surface px-6 shadow-soft md:px-8">
      {items.map(({ question, answer }) => {
        const isOpen = openQuestion === question;

        return (
          <li key={question}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenQuestion(isOpen ? null : question)}
              className="flex w-full items-center justify-between gap-6 py-5 text-left md:py-6"
            >
              <span className="text-[17px] font-semibold text-ink">{question}</span>
              <Plus
                size={20}
                className={`shrink-0 text-ink-muted transition-transform duration-300 ease-smooth ${isOpen ? "rotate-45" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 pr-10 text-[15px] leading-relaxed text-ink-muted">{answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
