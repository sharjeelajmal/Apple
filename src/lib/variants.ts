import type { ProductColor, ProductInput, ProductVariant } from "@/types/catalog";
import { slugify } from "./slugify";

const DEFAULT_COLOR: ProductColor = { name: "", hex: "" };

const variantKey = (storage: string, hex: string) => `${storage}|${hex}`;

export const variantLabel = (variant: Pick<ProductVariant, "storage" | "color">) =>
  [variant.storage, variant.color.name].filter(Boolean).join(" · ") || "Standard";

export const buildVariants = ({
  availableStorages,
  availableColors,
  variants,
}: Pick<ProductInput, "availableStorages" | "availableColors" | "variants">): ProductVariant[] => {
  const storages = availableStorages.length ? availableStorages : [""];
  const colors = availableColors.length ? availableColors : [DEFAULT_COLOR];
  const existing = new Map(variants.map((variant) => [variantKey(variant.storage, variant.color.hex), variant]));
  const fallbackPrice = variants[0]?.price ?? 0;

  return storages.flatMap((storage) =>
    colors.map((color) => {
      const current = existing.get(variantKey(storage, color.hex));

      return {
        id: current?.id ?? ([slugify(storage), slugify(color.name)].filter(Boolean).join("-") || "default"),
        storage,
        color: { name: color.name, hex: color.hex },
        price: current?.price ?? fallbackPrice,
        inventory: current?.inventory ?? 0,
        image: color.image || current?.image || "",
      };
    })
  );
};
