import "server-only";
import type { WithId } from "mongodb";
import type {
  AdminQuestion,
  AdminReview,
  ModerationStatus,
  ProductQuestion,
  Review,
  ReviewSummary,
} from "@/types/review";
import { productsCollection } from "./catalog";
import { db } from "./mongodb";
import { toObjectId } from "./objectId";
import { ordersCollection } from "./orders";

type ReviewDocument = {
  productId: string;
  userId: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  title: string;
  body: string;
  photos: string[];
  verifiedPurchase: boolean;
  status: ModerationStatus;
  createdAt: Date;
};

type QuestionDocument = {
  productId: string;
  userId: string;
  authorName: string;
  authorEmail: string;
  question: string;
  answer: string | null;
  answeredAt: Date | null;
  status: ModerationStatus;
  createdAt: Date;
};

export const reviewsCollection = db.collection<ReviewDocument>("reviews");
export const questionsCollection = db.collection<QuestionDocument>("product_questions");

export const toDisplayName = (name: string) => {
  const [first = "Customer", ...rest] = name.trim().split(/\s+/);
  const lastInitial = rest.at(-1)?.[0];
  return lastInitial ? `${first} ${lastInitial.toUpperCase()}.` : first;
};

const toReview = (document: WithId<ReviewDocument>): Review => ({
  id: String(document._id),
  productId: document.productId,
  authorName: document.authorName,
  rating: document.rating,
  title: document.title,
  body: document.body,
  photos: document.photos,
  verifiedPurchase: document.verifiedPurchase,
  status: document.status,
  createdAt: document.createdAt.toISOString(),
});

const toQuestion = (document: WithId<QuestionDocument>): ProductQuestion => ({
  id: String(document._id),
  productId: document.productId,
  authorName: document.authorName,
  question: document.question,
  answer: document.answer,
  answeredAt: document.answeredAt?.toISOString() ?? null,
  status: document.status,
  createdAt: document.createdAt.toISOString(),
});

export const summarizeReviews = (reviews: Pick<Review, "rating">[]): ReviewSummary => {
  const distribution: ReviewSummary["distribution"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(({ rating }) => distribution[rating as keyof typeof distribution]++);
  const total = reviews.length;
  const average = total ? reviews.reduce((sum, { rating }) => sum + rating, 0) / total : 0;
  return { average: Math.round(average * 10) / 10, total, distribution };
};

export async function getProductReviews(productId: string) {
  const documents = await reviewsCollection.find({ productId, status: "published" }).sort({ createdAt: -1 }).toArray();
  const reviews = documents.map(toReview);
  return { reviews, summary: summarizeReviews(reviews) };
}

export async function getProductQuestions(productId: string) {
  const documents = await questionsCollection
    .find({ productId, status: "published" })
    .sort({ answeredAt: -1, createdAt: -1 })
    .toArray();
  return documents.map(toQuestion);
}

export async function hasPurchasedProduct(userId: string, productId: string) {
  const order = await ordersCollection.findOne(
    { userId, status: { $ne: "cancelled" }, "items.productId": productId },
    { projection: { _id: 1 } }
  );
  return Boolean(order);
}

export async function hasReviewedProduct(userId: string, productId: string) {
  return Boolean(await reviewsCollection.findOne({ userId, productId }, { projection: { _id: 1 } }));
}

export async function getProductHandle(productId: string) {
  const objectId = toObjectId(productId);
  const product = objectId && (await productsCollection.findOne({ _id: objectId }, { projection: { handle: 1 } }));
  return product ? product.handle : null;
}

export async function refreshProductRating(productId: string) {
  const objectId = toObjectId(productId);
  if (!objectId) return null;

  const reviews = await reviewsCollection
    .find({ productId, status: "published" }, { projection: { rating: 1 } })
    .toArray();
  const { average, total } = summarizeReviews(reviews);
  const product = await productsCollection.findOneAndUpdate(
    { _id: objectId },
    { $set: { rating: average, totalReviews: total } },
    { projection: { handle: 1 } }
  );
  return product?.handle ?? null;
}

async function getProductLookup(productIds: string[]) {
  const ids = [...new Set(productIds)].flatMap((id) => toObjectId(id) ?? []);
  const products = await productsCollection.find({ _id: { $in: ids } }, { projection: { title: 1, handle: 1 } }).toArray();
  return new Map(products.map((product) => [String(product._id), product]));
}

export async function getAdminReviews(): Promise<AdminReview[]> {
  const documents = await reviewsCollection.find().sort({ createdAt: -1 }).toArray();
  const products = await getProductLookup(documents.map((document) => document.productId));

  return documents.map((document) => ({
    ...toReview(document),
    authorEmail: document.authorEmail,
    productTitle: products.get(document.productId)?.title ?? "Deleted product",
    productHandle: products.get(document.productId)?.handle ?? "",
  }));
}

export async function getAdminQuestions(): Promise<AdminQuestion[]> {
  const documents = await questionsCollection.find().sort({ createdAt: -1 }).toArray();
  const products = await getProductLookup(documents.map((document) => document.productId));

  return documents
    .map((document) => ({
      ...toQuestion(document),
      authorEmail: document.authorEmail,
      productTitle: products.get(document.productId)?.title ?? "Deleted product",
      productHandle: products.get(document.productId)?.handle ?? "",
    }))
    .sort((a, b) => Number(Boolean(a.answer)) - Number(Boolean(b.answer)));
}
