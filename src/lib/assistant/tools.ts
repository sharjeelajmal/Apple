import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import { getCategoryName, isCategorySlug, productCategories } from "@/config/categories";
import { getProductByHandle, getStartingPrice, getStorefrontProducts, getTotalInventory } from "@/lib/catalog";
import { cancelOrderAndRestock, requestOrderReturn, RETURN_WINDOW_DAYS } from "@/lib/orderChanges";
import { getOrdersForUser } from "@/lib/orders";
import { searchCatalog } from "@/lib/search";
import { faqCategories } from "@/data/pages/faqData";
import { legalDocuments } from "@/data/pages/legalData";
import { orderStatusLabels, returnStatusLabels } from "@/types/order";
import type { CatalogProduct } from "@/types/catalog";

const MAX_SEARCH_RESULTS = 8;
const MAX_ORDERS = 5;
const POLICY_SLUGS = ["shipping-policy", "refund-policy", "terms-of-use"];

export type ToolContext = {
  userId: string | null;
  viewingProduct: { handle: string; title: string } | null;
  voiceLanguage: "en" | "hi" | "ur" | null;
};

const confirmedOrderSchema = (extra: Record<string, unknown> = {}) => ({
  type: "object" as const,
  properties: {
    order_number: { type: "string", description: "The order number, e.g. W1A2B3C4D5." },
    ...extra,
    confirmed: { type: "boolean", description: "True only if the shopper explicitly confirmed this action in their latest message." },
  },
  required: ["order_number", ...Object.keys(extra), "confirmed"],
  additionalProperties: false,
});
const categorySlugs = productCategories.map((category) => category.slug);

export const assistantTools: Anthropic.Beta.BetaTool[] = [
  {
    name: "search_products",
    description:
      "Search the store's live catalog by name or by feature (e.g. 'foldable', 'titanium', 'Apple Pencil'). Use it before recommending or comparing anything. " +
      "All filters are optional; combine a text query (model name, storage, color, feature) with category and price limits. " +
      "Returns up to 8 products with their starting price in USD, storage and color options, stock and rating.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text search, e.g. 'iPhone 17 Pro' or 'MacBook Air 15'." },
        category: { type: "string", enum: categorySlugs, description: "Limit results to one category." },
        max_price: { type: "number", description: "Highest starting price in USD." },
        min_price: { type: "number", description: "Lowest starting price in USD." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_product_details",
    description:
      "Get the full description, every storage/color variant with its price and stock, and the rating for one product. " +
      "Use the handle returned by search_products.",
    input_schema: {
      type: "object",
      properties: { handle: { type: "string", description: "Product handle, e.g. 'iphone-17'." } },
      required: ["handle"],
      additionalProperties: false,
    },
  },
  {
    name: "get_my_orders",
    description:
      "Get the signed-in shopper's most recent orders with status, items, total and estimated delivery. " +
      "Use it when they ask about their orders, delivery or tracking.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "cancel_order",
    description:
      "Cancel one of the signed-in shopper's orders that hasn't shipped yet (status placed or processing). " +
      "Only call after the shopper has confirmed; the cancellation is immediate.",
    input_schema: confirmedOrderSchema(),
  },
  {
    name: "request_return",
    description:
      `Request a return for a delivered order within ${RETURN_WINDOW_DAYS} days of delivery. ` +
      "Our team reviews the request and emails a prepaid label. Only call after the shopper has confirmed.",
    input_schema: confirmedOrderSchema({
      reason: { type: "string", description: "The shopper's reason for the return, in their words." },
    }),
  },
  {
    name: "get_store_info",
    description:
      "Get the store's FAQ and policies: shipping, returns and refunds, payment methods, warranty and account help. " +
      "Use it before answering any question about how the store works.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
];

const summarize = (product: CatalogProduct) => ({
  handle: product.handle,
  title: product.title,
  category: getCategoryName(product.category),
  startingPrice: getStartingPrice(product),
  storageOptions: product.availableStorages,
  colors: product.availableColors.map((color) => color.name),
  inStock: getTotalInventory(product) > 0,
  rating: product.totalReviews ? `${product.rating}/5 from ${product.totalReviews} reviews` : "No reviews yet",
});

const readString = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const readNumber = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : null);

async function searchWithDescriptions(query: string) {
  const [{ products: titleMatches }, allProducts] = await Promise.all([searchCatalog(query), getStorefrontProducts()]);
  const words = query.toLowerCase().split(/\s+/).filter((word) => word.length > 2);
  const descriptionMatches = allProducts.filter((product) => {
    const text = product.description.toLowerCase();
    return words.length > 0 && words.every((word) => text.includes(word));
  });

  const seen = new Set<string>();
  return [...titleMatches, ...descriptionMatches].filter((product) => !seen.has(product.id) && seen.add(product.id));
}

async function searchProducts(input: Record<string, unknown>) {
  const query = readString(input.query);
  const category = readString(input.category);
  const maxPrice = readNumber(input.max_price);
  const minPrice = readNumber(input.min_price);

  const products = query
    ? await searchWithDescriptions(query)
    : await getStorefrontProducts({ category: isCategorySlug(category) ? category : undefined });

  const matches = products
    .filter((product) => !isCategorySlug(category) || product.category === category)
    .filter((product) => maxPrice === null || getStartingPrice(product) <= maxPrice)
    .filter((product) => minPrice === null || getStartingPrice(product) >= minPrice);

  return {
    totalMatches: matches.length,
    products: matches.slice(0, MAX_SEARCH_RESULTS).map(summarize),
  };
}

async function getProductDetails(input: Record<string, unknown>) {
  const product = await getProductByHandle(readString(input.handle));
  if (!product) return { error: "No product found with that handle. Search again to get a valid handle." };

  return {
    ...summarize(product),
    description: product.description,
    variants: product.variants.map((variant) => ({
      storage: variant.storage,
      color: variant.color.name,
      price: variant.price,
      inStock: variant.inventory > 0,
    })),
  };
}

async function getMyOrders(_input: Record<string, unknown>, { userId }: ToolContext) {
  if (!userId) return { signedIn: false, message: "The shopper is not signed in. Ask them to sign in at /account/login." };

  const orders = await getOrdersForUser(userId);
  return {
    signedIn: true,
    totalOrders: orders.length,
    orders: orders.slice(0, MAX_ORDERS).map((order) => ({
      orderNumber: order.id,
      status: orderStatusLabels[order.status],
      placedAt: order.placedAt,
      estimatedDelivery: order.estimatedDelivery,
      total: order.subtotal,
      items: order.items.map((item) => `${item.quantity} x ${item.title}`),
      canCancel: order.status === "placed" || order.status === "processing",
      returnStatus: order.returnRequest ? returnStatusLabels[order.returnRequest.status] : null,
    })),
    ordersPage: "/account/orders",
  };
}

async function getStoreInfo() {
  return {
    faq: faqCategories.map(({ title, items }) => ({ topic: title, items })),
    policies: legalDocuments
      .filter((document) => POLICY_SLUGS.includes(document.slug))
      .map(({ slug, title, sections }) => ({
        title,
        page: `/pages/${slug}`,
        content: sections.map(({ heading, paragraphs }) => `${heading}: ${paragraphs.join(" ")}`),
      })),
    contactPage: "/pages/contact",
  };
}

const readOrderAction = (input: Record<string, unknown>, { userId }: ToolContext) => {
  if (!userId) return { error: "The shopper is not signed in. Ask them to sign in at /account/login." };
  if (input.confirmed !== true) return { error: "Ask the shopper to confirm before doing this." };

  const orderNumber = readString(input.order_number).toUpperCase();
  return orderNumber ? { userId, orderNumber } : { error: "An order number is required." };
};

async function cancelOrder(input: Record<string, unknown>, context: ToolContext) {
  const action = readOrderAction(input, context);
  return "error" in action ? action : cancelOrderAndRestock(action.orderNumber, action.userId);
}

async function requestReturn(input: Record<string, unknown>, context: ToolContext) {
  const action = readOrderAction(input, context);
  return "error" in action ? action : requestOrderReturn(action.orderNumber, action.userId, readString(input.reason));
}

type ToolExecutor = (input: Record<string, unknown>, context: ToolContext) => Promise<object>;

const executors: Record<string, ToolExecutor> = {
  search_products: searchProducts,
  get_product_details: getProductDetails,
  get_my_orders: getMyOrders,
  cancel_order: cancelOrder,
  request_return: requestReturn,
  get_store_info: getStoreInfo,
};

export async function runAssistantTool(name: string, input: unknown, context: ToolContext) {
  const executor = executors[name];
  if (!executor) return { content: `Unknown tool: ${name}`, isError: true };

  const args = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  return { content: JSON.stringify(await executor(args, context)), isError: false };
}
