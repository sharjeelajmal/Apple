"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { finderQuestions, type FinderAnswers } from "@/config/productFinder";
import { findBestMatches, type FinderProduct } from "@/lib/productFinder";
import FinderQuestionStep from "./FinderQuestionStep";
import FinderResults from "./FinderResults";

type ProductFinderProps = {
  products: FinderProduct[];
};

type PartialAnswers = Partial<Record<keyof FinderAnswers, string>>;

const isComplete = (answers: PartialAnswers): answers is FinderAnswers =>
  finderQuestions.every((question) => Boolean(answers[question.key]));

export default function ProductFinder({ products }: ProductFinderProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<PartialAnswers>({});

  const totalSteps = finderQuestions.length;
  const question = finderQuestions[step];
  const showResults = step >= totalSteps && isComplete(answers);
  const matches = useMemo(() => (isComplete(answers) ? findBestMatches(products, answers) : []), [products, answers]);

  const handleSelect = (value: string) => {
    setAnswers((current) => ({ ...current, [question.key]: value }));
    setStep((current) => current + 1);
  };

  const handleRestart = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-10 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setStep((current) => current - 1)}
          disabled={step === 0}
          aria-label="Previous question"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-muted disabled:invisible"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${(Math.min(step, totalSteps) / totalSteps) * 100}%` }}
          />
        </div>
        <span className="w-12 shrink-0 text-right text-[13px] text-ink-subtle">
          {Math.min(step + 1, totalSteps)}/{totalSteps}
        </span>
      </div>

      {showResults ? (
        <FinderResults
          matches={matches}
          collectionHref={`/collections/${answers.category}`}
          onRestart={handleRestart}
        />
      ) : (
        <AnimatePresence mode="wait">
          <FinderQuestionStep
            key={question.key}
            question={question}
            selected={answers[question.key]}
            onSelect={handleSelect}
          />
        </AnimatePresence>
      )}
    </div>
  );
}
