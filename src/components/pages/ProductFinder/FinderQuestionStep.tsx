import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { FinderQuestion } from "@/config/productFinder";

type FinderQuestionStepProps = {
  question: FinderQuestion;
  selected?: string;
  onSelect: (value: string) => void;
};

export default function FinderQuestionStep({ question, selected, onSelect }: FinderQuestionStepProps) {
  return (
    <motion.div
      key={question.key}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <h2 className="mb-8 text-center text-[28px] font-semibold tracking-tight text-ink md:text-[40px]">{question.title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              aria-pressed={isSelected}
              className={`flex items-start justify-between gap-4 rounded-card border-2 bg-white p-5 text-left shadow-subtle transition-colors ${
                isSelected ? "border-accent" : "border-transparent hover:border-line"
              }`}
            >
              <span>
                <span className="block text-[17px] font-semibold text-ink">{option.label}</span>
                <span className="mt-1 block text-[14px] text-ink-muted">{option.description}</span>
              </span>
              {isSelected && <Check size={20} className="mt-0.5 shrink-0 text-accent" />}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
