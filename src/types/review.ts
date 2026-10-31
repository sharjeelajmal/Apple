export type ModerationStatus = "published" | "hidden";

export type Review = {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  photos: string[];
  verifiedPurchase: boolean;
  status: ModerationStatus;
  createdAt: string;
};

export type AdminReview = Review & {
  productTitle: string;
  productHandle: string;
  authorEmail: string;
};

export type ReviewSummary = {
  average: number;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export type ProductQuestion = {
  id: string;
  productId: string;
  authorName: string;
  question: string;
  answer: string | null;
  answeredAt: string | null;
  status: ModerationStatus;
  createdAt: string;
};

export type AdminQuestion = ProductQuestion & {
  productTitle: string;
  productHandle: string;
  authorEmail: string;
};

export type FormActionState = {
  status: "idle" | "success" | "error";
  message: string;
};
