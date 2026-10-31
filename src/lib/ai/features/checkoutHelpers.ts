import "server-only";
import type { CartItem } from "@/context/CartContext";
import { countriesData } from "@/data/countries";
import type { OrderAddress } from "@/types/order";
import { cacheKey, cachedAi } from "../cache";
import { catalogDigest, getInStockCatalog, pickKnownHandles } from "../catalogContext";
import { generateJson, objectSchema, stringArray } from "../generateJson";

export type CartTip = {
  kind: "pairing" | "storage" | "compatibility" | "value" | "other";
  message: string;
  handle: string;
};

export async function adviseCart(items: CartItem[]) {
  const catalog = await getInStockCatalog();
  const cart = items.map((item) =>
    [`${item.quantity} x ${item.title}`, item.variant?.storage, item.variant?.colorName, `$${item.price}`].filter(Boolean).join(" · ")
  );

  const result = await cachedAi(cacheKey("cart", cart), 24, () =>
    generateJson<{ summary: string; tips: CartTip[] }>({
      system: `You review a shopper's bag in an Apple store and give practical advice before checkout.
- summary: one friendly sentence about the bag.
- tips: 2 to 4 useful tips. Kinds: "pairing" (a product from the catalog that goes well with what's in the bag), "storage" (whether the chosen storage is enough for typical use), "compatibility" (things that do or don't work together), "value" (a better-value option in the catalog), "other".
Use "handle" only for a catalog product the tip recommends; otherwise leave it empty. Never invent discounts. Keep each tip under 30 words.`,
      schema: objectSchema({
        summary: { type: "string" },
        tips: {
          type: "array",
          items: objectSchema({
            kind: { type: "string", enum: ["pairing", "storage", "compatibility", "value", "other"] },
            message: { type: "string" },
            handle: { type: "string" },
          }),
        },
      }),
      content: `Bag:\n${cart.join("\n")}\n\nCatalog:\n${catalogDigest(catalog)}`,
    })
  );

  const known = new Map(pickKnownHandles(result.tips.filter((tip) => tip.handle), catalog).map((tip) => [tip.handle, tip.product]));
  return {
    summary: result.summary,
    tips: result.tips.map((tip) => ({ kind: tip.kind, message: tip.message, product: known.get(tip.handle) ?? null })),
  };
}

export type AddressReview = {
  status: "ok" | "needs_attention";
  issues: string[];
  suggested: Omit<OrderAddress, "country">;
};

export async function reviewAddress(address: OrderAddress) {
  const country = countriesData[address.country as keyof typeof countriesData];
  const allowedStates = country?.states.map((state) => `${state.value} (${state.label})`).join(", ");

  return cachedAi(cacheKey("address", address), 24, () =>
    generateJson<AddressReview>({
      system: `You check shipping addresses before checkout and catch mistakes: misspelled city or street names, a postal code that doesn't match the city or country format, a state that doesn't fit the city, or missing apartment details when the street clearly needs them.
- status: "ok" when the address looks deliverable as written, otherwise "needs_attention".
- issues: short, friendly explanations of each problem (empty when ok).
- suggested: the corrected address. Keep fields that are fine exactly as written. ${allowedStates ? `"state" must be one of these codes: ${allowedStates}.` : ""}
Never invent a house number or apartment that isn't implied by the input.`,
      schema: objectSchema({
        status: { type: "string", enum: ["ok", "needs_attention"] },
        issues: stringArray,
        suggested: objectSchema({
          street: { type: "string" },
          apartment: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
          postalCode: { type: "string" },
        }),
      }),
      maxTokens: 2000,
      content: `Country: ${country?.name ?? address.country}\nStreet: ${address.street}\nApartment: ${address.apartment || "none"}\nCity: ${address.city}\nState/region: ${address.state || "none"}\nPostal code: ${address.postalCode || "none"}`,
    })
  );
}
