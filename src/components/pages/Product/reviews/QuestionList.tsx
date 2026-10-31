import { siteConfig } from "@/config/site";
import { formatLongDate } from "@/lib/format";
import type { ProductQuestion } from "@/types/review";

export default function QuestionList({ questions }: { questions: ProductQuestion[] }) {
  return (
    <ul className="flex flex-col">
      {questions.map((question) => (
        <li key={question.id} className="border-b border-line-light py-5 last:border-b-0">
          <p className="text-[15px] font-semibold text-ink">
            <span className="mr-2 text-accent">Q:</span>
            {question.question}
          </p>
          <p className="mt-1 text-[13px] text-ink-subtle">
            Asked by {question.authorName} on {formatLongDate(question.createdAt)}
          </p>
          {question.answer ? (
            <div className="mt-3 rounded-field bg-surface-muted p-4">
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink">
                <span className="mr-2 font-semibold text-positive">A:</span>
                {question.answer}
              </p>
              <p className="mt-2 text-[13px] text-ink-subtle">Answered by the {siteConfig.name} team</p>
            </div>
          ) : (
            <p className="mt-3 text-[14px] italic text-ink-muted">Our team will answer this soon.</p>
          )}
        </li>
      ))}
    </ul>
  );
}
