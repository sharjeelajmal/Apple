"use client";

import { submitReview } from "@/actions/reviewActions";
import FloatingField from "@/components/ui/FloatingField";
import FloatingTextarea from "@/components/ui/FloatingTextarea";
import FormAlert from "@/components/ui/FormAlert";
import SubmitButton from "@/components/ui/SubmitButton";
import { REVIEW_BODY_MAX, REVIEW_TITLE_MAX } from "@/config/reviews";
import usePreservedFormAction from "@/hooks/usePreservedFormAction";
import ReviewPhotoPicker from "./ReviewPhotoPicker";
import StarRatingInput from "./StarRatingInput";

export default function ReviewForm({ productId }: { productId: string }) {
  const { state, isPending, handleSubmit } = usePreservedFormAction(submitReview.bind(null, productId));

  if (state.status === "success") {
    return <FormAlert tone="success" message={state.message} />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-card bg-surface-muted p-5 md:p-6">
      <FormAlert message={state.status === "error" ? state.message : ""} />
      <StarRatingInput name="rating" />
      <FloatingField name="title" label="Review title" maxLength={REVIEW_TITLE_MAX} required />
      <FloatingTextarea name="body" label="What did you like or dislike?" maxLength={REVIEW_BODY_MAX} required />
      <ReviewPhotoPicker name="photos" />
      <SubmitButton isLoading={isPending}>{isPending ? "Posting..." : "Post review"}</SubmitButton>
    </form>
  );
}
