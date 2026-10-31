"use client";

import { askQuestion } from "@/actions/reviewActions";
import FloatingTextarea from "@/components/ui/FloatingTextarea";
import FormAlert from "@/components/ui/FormAlert";
import SubmitButton from "@/components/ui/SubmitButton";
import { QUESTION_MAX } from "@/config/reviews";
import usePreservedFormAction from "@/hooks/usePreservedFormAction";

export default function QuestionForm({ productId }: { productId: string }) {
  const { state, isPending, handleSubmit } = usePreservedFormAction(askQuestion.bind(null, productId));

  if (state.status === "success") {
    return <FormAlert tone="success" message={state.message} />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-card bg-surface-muted p-5 md:p-6">
      <FormAlert message={state.status === "error" ? state.message : ""} />
      <FloatingTextarea name="question" label="Ask about features, size, compatibility..." maxLength={QUESTION_MAX} required />
      <SubmitButton isLoading={isPending}>{isPending ? "Sending..." : "Submit question"}</SubmitButton>
    </form>
  );
}
