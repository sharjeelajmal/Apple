"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { answerQuestion, deleteQuestion, setQuestionStatus } from "@/actions/admin/reviewActions";
import { ANSWER_MAX } from "@/config/reviews";
import { formatLongDate } from "@/lib/format";
import type { AdminQuestion } from "@/types/review";
import ModerationActions from "./ModerationActions";

export default function AdminQuestionCard({ question }: { question: AdminQuestion }) {
  const [isPending, startTransition] = useTransition();
  const [answer, setAnswer] = useState(question.answer ?? "");
  const isHidden = question.status === "hidden";
  const hasChanges = answer.trim() !== (question.answer ?? "");

  const handleDelete = () => {
    if (window.confirm("Delete this question? This can't be undone.")) {
      startTransition(() => deleteQuestion(question.id));
    }
  };

  return (
    <article
      className={`rounded-card border bg-surface p-5 shadow-soft transition-opacity md:p-6 ${
        question.answer ? "border-line-light" : "border-accent/40"
      } ${isPending ? "opacity-60" : ""}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href={`/products/${question.productHandle}`} target="_blank" className="text-[13px] text-accent hover:underline">
            {question.productTitle}
          </Link>
          <p className="mt-1 text-[13px] text-ink-muted">
            {question.authorName} · {question.authorEmail}
            {isHidden && <span className="ml-2 rounded-full bg-surface-muted px-2.5 py-0.5 text-[12px]">Hidden</span>}
          </p>
        </div>
        <time className="text-[13px] text-ink-subtle" dateTime={question.createdAt}>
          {formatLongDate(question.createdAt)}
        </time>
      </header>

      <p className="mt-4 text-[16px] font-semibold text-ink">{question.question}</p>

      <label className="mt-4 block">
        <span className="mb-2 block text-[13px] font-medium text-ink-muted">
          {question.answer ? "Your answer" : "Write an answer"}
        </span>
        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          maxLength={ANSWER_MAX}
          rows={3}
          className="w-full resize-y rounded-field border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none focus:border-accent"
        />
      </label>

      <footer className="mt-4 flex flex-wrap gap-2 border-t border-line-light pt-4">
        <button
          type="button"
          disabled={isPending || !hasChanges}
          onClick={() => startTransition(() => answerQuestion(question.id, answer))}
          className="flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-white hover:bg-black disabled:opacity-40"
        >
          {question.answer ? "Update answer" : "Post answer"}
        </button>
        <ModerationActions
          status={question.status}
          isPending={isPending}
          onToggle={() => startTransition(() => setQuestionStatus(question.id, isHidden ? "published" : "hidden"))}
          onDelete={handleDelete}
        />
      </footer>
    </article>
  );
}
