export type AlertType = "price-drop" | "back-in-stock";

export type ProductAlert = {
  id: string;
  type: AlertType;
  productTitle: string;
  productHandle: string;
  productImage: string;
  priceAtSubscribe: number;
  currentPrice: number;
  triggeredAt: string | null;
  triggeredPrice: number | null;
  createdAt: string;
};

export type AlertToggleResult = { subscribed: boolean; error?: string };
