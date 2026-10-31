"use server";

import { revalidatePath } from "next/cache";
import { ANSWER_MAX } from "@/config/reviews";
import { assertAdmin } from "@/lib/adminAuth";
import { toObjectId } from "@/lib/objectId";
import { getProductHandle, questionsCollection, refreshProductRating, reviewsCollection } from "@/lib/reviews";
import type { ModerationStatus } from "@/types/review";

const requireObjectId = (id: string) => {
  const objectId = toObjectId(id);
  if (!objectId) throw new Error("Item not found.");
  return objectId;
};

const revalidateProduct = (handle: string | null) => {
  revalidatePath("/admin/reviews");
  if (handle) revalidatePath(`/products/${handle}`);
};

async function syncReviewedProduct(productId: string | undefined) {
  revalidateProduct(productId ? await refreshProductRating(productId) : null);
}

async function syncQuestionProduct(productId: string | undefined) {
  revalidateProduct(productId ? await getProductHandle(productId) : null);
}

export async function setReviewStatus(reviewId: string, status: ModerationStatus) {
  await assertAdmin();
  const review = await reviewsCollection.findOneAndUpdate({ _id: requireObjectId(reviewId) }, { $set: { status } });
  await syncReviewedProduct(review?.productId);
}

export async function deleteReview(reviewId: string) {
  await assertAdmin();
  const review = await reviewsCollection.findOneAndDelete({ _id: requireObjectId(reviewId) });
  await syncReviewedProduct(review?.productId);
}

export async function answerQuestion(questionId: string, answer: string) {
  await assertAdmin();
  const text = answer.trim().slice(0, ANSWER_MAX);
  const question = await questionsCollection.findOneAndUpdate(
    { _id: requireObjectId(questionId) },
    { $set: { answer: text || null, answeredAt: text ? new Date() : null } }
  );
  await syncQuestionProduct(question?.productId);
}

export async function setQuestionStatus(questionId: string, status: ModerationStatus) {
  await assertAdmin();
  const question = await questionsCollection.findOneAndUpdate({ _id: requireObjectId(questionId) }, { $set: { status } });
  await syncQuestionProduct(question?.productId);
}

export async function deleteQuestion(questionId: string) {
  await assertAdmin();
  const question = await questionsCollection.findOneAndDelete({ _id: requireObjectId(questionId) });
  await syncQuestionProduct(question?.productId);
}
