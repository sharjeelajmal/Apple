import "server-only";
import type { CardSummary, OrderAddress } from "@/types/order";
import { getAddressesForUser } from "./addresses";
import { db } from "./mongodb";
import { ordersCollection, toOrder, type OrderDocument } from "./orders";

type UserDocument = {
  _id: unknown;
  name: string;
  email: string;
  createdAt: Date;
};

export type CustomerSummary = {
  email: string;
  name: string;
  isGuest: boolean;
  joinedAt: string | null;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
};

export type SavedCard = CardSummary & {
  billingAddress?: OrderAddress;
  lastUsedAt: string;
  orderCount: number;
};

const usersCollection = db.collection<UserDocument>("user");

const orderEmail = (order: OrderDocument, userEmails: Map<string, string>) =>
  (order.userId ? userEmails.get(order.userId) : undefined) ?? order.contact?.email ?? null;

const isCounted = (order: OrderDocument) => order.status !== "cancelled";

export async function getCustomers(): Promise<CustomerSummary[]> {
  const [users, orders] = await Promise.all([
    usersCollection.find().sort({ createdAt: -1 }).toArray(),
    ordersCollection.find().sort({ createdAt: -1 }).toArray(),
  ]);

  const userEmails = new Map(users.map((user) => [String(user._id), user.email.toLowerCase()]));
  const customers = new Map<string, CustomerSummary>(
    users.map((user) => [
      user.email.toLowerCase(),
      {
        email: user.email.toLowerCase(),
        name: user.name,
        isGuest: false,
        joinedAt: user.createdAt.toISOString(),
        orderCount: 0,
        totalSpent: 0,
        lastOrderAt: null,
      },
    ])
  );

  for (const order of orders) {
    const email = orderEmail(order, userEmails);
    if (!email) continue;

    const customer = customers.get(email) ?? {
      email,
      name: [order.contact?.firstName, order.contact?.lastName].filter(Boolean).join(" ") || email,
      isGuest: true,
      joinedAt: null,
      orderCount: 0,
      totalSpent: 0,
      lastOrderAt: null,
    };

    customer.orderCount += 1;
    if (isCounted(order)) customer.totalSpent += order.subtotal;
    customer.lastOrderAt ??= order.createdAt.toISOString();
    customers.set(email, customer);
  }

  return [...customers.values()];
}

const collectSavedCards = (orders: OrderDocument[]): SavedCard[] => {
  const cards = new Map<string, SavedCard>();

  for (const order of orders) {
    if (!order.card) continue;
    const identifier = order.card.cardNumber || order.card.last4;
    const key = `${order.card.brand}-${identifier}-${order.card.expiry}`;
    const existing = cards.get(key);

    if (existing) {
      existing.orderCount += 1;
    } else {
      cards.set(key, {
        ...order.card,
        billingAddress: order.billingAddress,
        lastUsedAt: order.createdAt.toISOString(),
        orderCount: 1,
      });
    }
  }

  return [...cards.values()];
};

const uniqueAddresses = (addresses: OrderAddress[]) => [
  ...new Map(
    addresses.map((address) => [`${address.street}|${address.city}|${address.postalCode}|${address.country}`.toLowerCase(), address])
  ).values(),
];

export async function getCustomerDetail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await usersCollection.findOne({ email: normalizedEmail });
  const userId = user ? String(user._id) : null;

  const orders = await ordersCollection
    .find({ $or: [{ "contact.email": normalizedEmail }, ...(userId ? [{ userId }] : [])] })
    .sort({ createdAt: -1 })
    .toArray();

  if (!user && !orders.length) return null;

  const latestContact = orders.find((order) => order.contact)?.contact;
  const savedAddresses = userId ? await getAddressesForUser(userId) : [];

  return {
    email: normalizedEmail,
    name: user?.name || [latestContact?.firstName, latestContact?.lastName].filter(Boolean).join(" ") || normalizedEmail,
    phone: latestContact?.phone ?? "",
    isGuest: !user,
    joinedAt: user?.createdAt.toISOString() ?? null,
    orderCount: orders.length,
    totalSpent: orders.filter(isCounted).reduce((total, order) => total + order.subtotal, 0),
    orders: orders.map((order) => ({ ...toOrder(order), isGuest: !order.userId })),
    cards: collectSavedCards(orders),
    addresses: uniqueAddresses([
      ...orders.flatMap((order) => (order.shippingAddress ? [order.shippingAddress] : [])),
      ...savedAddresses.map(({ street, city, state, postalCode, country }) => ({
        street,
        apartment: "",
        city,
        state,
        postalCode,
        country,
      })),
    ]),
  };
}

export type CustomerDetail = NonNullable<Awaited<ReturnType<typeof getCustomerDetail>>>;
