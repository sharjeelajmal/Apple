"use server";

import { revalidatePath } from "next/cache";
import {
  QUESTION_MAX,
  QUESTION_MIN,
  REVIEW_BODY_MAX,
  REVIEW_BODY_MIN,
  REVIEW_PHOTO_LIMIT,
  REVIEW_PHOTO_MAX_MB,
  REVIEW_TITLE_MAX,
} from "@/config/reviews";
import { getProductById } from "@/lib/catalog";
import { uploadImage } from "@/lib/cloudinary";
import {
  hasPurchasedProduct,
  hasReviewedProduct,
  questionsCollection,
  refreshProductRating,
  reviewsCollection,
  toDisplayName,
} from "@/lib/reviews";
import { getSession } from "@/lib/session";
import type { FormActionState } from "@/types/review";

const failure = (message: string): FormActionState => ({ status: "error", message });

const readText = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

const readPhotos = (formData: FormData) =>
  formData.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);

const validatePhotos = (photos: File[]) => {
  if (photos.length > REVIEW_PHOTO_LIMIT) return `You can add up to ${REVIEW_PHOTO_LIMIT} photos.`;
  if (photos.some((photo) => !photo.type.startsWith("image/"))) return "Photos must be image files.";
  if (photos.some((photo) => photo.size > REVIEW_PHOTO_MAX_MB * 1024 * 1024)) {
    return `Each photo must be under ${REVIEW_PHOTO_MAX_MB} MB.`;
  }
  return "";
};

async function getActiveProduct(productId: string) {
  const product = await getProductById(productId);
  return product?.status === "active" ? product : null;
}

export async function submitReview(
  productId: string,
  _state: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const session = await getSession();
  if (!session) return failure("Please sign in to write a review.");

  const product = await getActiveProduct(productId);
  if (!product) return failure("This product is no longer available.");

  const rating = Number(formData.get("rating"));
  const title = readText(formData, "title");
  const body = readText(formData, "body");
  const photos = readPhotos(formData);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return failure("Please choose a star rating.");
  if (!title) return failure("Please add a title for your review.");
  if (title.length > REVIEW_TITLE_MAX) return failure(`Keep the title under ${REVIEW_TITLE_MAX} characters.`);
  if (body.length < REVIEW_BODY_MIN) return failure(`Tell us a bit more — at least ${REVIEW_BODY_MIN} characters.`);
  if (body.length > REVIEW_BODY_MAX) return failure(`Keep your review under ${REVIEW_BODY_MAX} characters.`);

  const photoError = validatePhotos(photos);
  if (photoError) return failure(photoError);

  const { id: userId, name, email } = session.user;
  if (await hasReviewedProduct(userId, productId)) return failure("You've already reviewed this product.");

  let photoUrls: string[];
  try {
    photoUrls = await Promise.all(photos.map(uploadImage));
  } catch {
    return failure("We couldn't upload your photos. Please try again.");
  }

  await reviewsCollection.insertOne({
    productId,
    userId,
    authorName: toDisplayName(name),
    authorEmail: email,
    rating,
    title,
    body,
    photos: photoUrls,
    verifiedPurchase: await hasPurchasedProduct(userId, productId),
    status: "published",
    createdAt: new Date(),
  });

  await refreshProductRating(productId);
  revalidatePath(`/products/${product.handle}`);
  return { status: "success", message: "Thanks! Your review is now live." };
}

export async function askQuestion(
  productId: string,
  _state: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const session = await getSession();
  if (!session) return failure("Please sign in to ask a question.");

  const product = await getActiveProduct(productId);
  if (!product) return failure("This product is no longer available.");

  const question = readText(formData, "question");
  if (question.length < QUESTION_MIN) return failure(`Your question needs at least ${QUESTION_MIN} characters.`);
  if (question.length > QUESTION_MAX) return failure(`Keep your question under ${QUESTION_MAX} characters.`);

  await questionsCollection.insertOne({
    productId,
    userId: session.user.id,
    authorName: toDisplayName(session.user.name),
    authorEmail: session.user.email,
    question,
    answer: null,
    answeredAt: null,
    status: "published",
    createdAt: new Date(),
  });

  revalidatePath(`/products/${product.handle}`);
  return { status: "success", message: "Thanks! We'll answer your question soon." };
}
