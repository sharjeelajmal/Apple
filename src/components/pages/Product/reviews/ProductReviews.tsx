import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import AiLoading from "@/components/ai/AiLoading";
import { MIN_REVIEWS_FOR_SUMMARY } from "@/lib/ai/features/summarizeReviews";
import { assistantConfig } from "@/config/env";
import { AUTH_ROUTES } from "@/config/auth";
import { getProductQuestions, getProductReviews, hasReviewedProduct } from "@/lib/reviews";
import { getSession } from "@/lib/session";
import FormReveal from "./FormReveal";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";
import ReviewForm from "./ReviewForm";
import ReviewInsights from "./ReviewInsights";
import ReviewList from "./ReviewList";
import ReviewSummaryPanel from "./ReviewSummaryPanel";

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
      <h2 id={`${id}-title`} className="mb-8 text-[28px] font-semibold tracking-tight text-ink md:text-[36px]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SignInPrompt({ action }: { action: string }) {
  return (
    <p className="mb-6 text-[15px] text-ink-muted">
      <Link href={AUTH_ROUTES.login} className="font-medium text-accent hover:underline">
        Sign in
      </Link>{" "}
      to {action}.
    </p>
  );
}

type ProductReviewsProps = {
  productId: string;
  productTitle: string;
};

export default async function ProductReviews({ productId, productTitle }: ProductReviewsProps) {
  const [{ reviews, summary }, questions, session] = await Promise.all([
    getProductReviews(productId),
    getProductQuestions(productId),
    getSession(),
  ]);
  const alreadyReviewed = session ? await hasReviewedProduct(session.user.id, productId) : false;

  return (
    <div className="mx-auto mt-16 grid max-w-[1200px] gap-16 px-4 sm:px-6 md:mt-24 lg:grid-cols-2 lg:px-8">
      <Section id="reviews" title="Customer reviews">
        {summary.total > 0 && (
          <div className="mb-8">
            <ReviewSummaryPanel summary={summary} />
          </div>
        )}

        {assistantConfig.isEnabled && reviews.length >= MIN_REVIEWS_FOR_SUMMARY && (
          <Suspense fallback={<div className="mb-8"><AiLoading message="AI is reading the reviews…" /></div>}>
            <ReviewInsights productTitle={productTitle} reviews={reviews} />
          </Suspense>
        )}

        {!session ? (
          <SignInPrompt action="write a review" />
        ) : alreadyReviewed ? (
          <p className="mb-6 text-[15px] text-ink-muted">Thanks for sharing your review of this product.</p>
        ) : (
          <FormReveal label="Write a review">
            <ReviewForm productId={productId} />
          </FormReveal>
        )}

        {reviews.length ? (
          <ReviewList reviews={reviews} />
        ) : (
          <p className="text-[15px] text-ink-muted">No reviews yet. Be the first to share your experience.</p>
        )}
      </Section>

      <Section id="questions" title="Questions & answers">
        {session ? (
          <FormReveal label="Ask a question">
            <QuestionForm productId={productId} />
          </FormReveal>
        ) : (
          <SignInPrompt action="ask a question" />
        )}

        {questions.length ? (
          <QuestionList questions={questions} />
        ) : (
          <p className="text-[15px] text-ink-muted">No questions yet. Ask anything about this product.</p>
        )}
      </Section>
    </div>
  );
}
