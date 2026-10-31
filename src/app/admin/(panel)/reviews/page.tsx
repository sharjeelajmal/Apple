import Link from "next/link";
import { MessageCircleQuestion, Star } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminQuestionCard from "@/components/admin/reviews/AdminQuestionCard";
import AdminReviewCard from "@/components/admin/reviews/AdminReviewCard";
import EmptyState from "@/components/shared/dashboard/EmptyState";
import { requireAdmin } from "@/lib/adminAuth";
import { getAdminQuestions, getAdminReviews } from "@/lib/reviews";

export default async function AdminReviewsPage({ searchParams }: PageProps<"/admin/reviews">) {
  await requireAdmin();
  const { tab } = await searchParams;
  const showQuestions = tab === "questions";
  const [reviews, questions] = await Promise.all([getAdminReviews(), getAdminQuestions()]);
  const unansweredCount = questions.filter((question) => !question.answer).length;

  const tabs = [
    { label: `Reviews (${reviews.length})`, href: "/admin/reviews", isActive: !showQuestions },
    {
      label: `Questions (${questions.length})${unansweredCount ? ` · ${unansweredCount} unanswered` : ""}`,
      href: "/admin/reviews?tab=questions",
      isActive: showQuestions,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Reviews & Q&A"
        description="Hide or remove reviews and answer customer questions. Changes show on the product page right away."
      />

      <nav aria-label="Switch section" className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {tabs.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-full px-4 py-2 text-[14px] transition-colors ${
              item.isActive ? "bg-ink text-white" : "border border-line bg-surface text-ink hover:border-ink"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {showQuestions ? (
        questions.length ? (
          <div className="flex flex-col gap-4">
            {questions.map((question) => (
              <AdminQuestionCard key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <EmptyState icon={MessageCircleQuestion} title="No questions yet." description="Questions customers ask on product pages will appear here." />
        )
      ) : reviews.length ? (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <AdminReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Star} title="No reviews yet." description="Reviews customers write on product pages will appear here." />
      )}
    </>
  );
}
