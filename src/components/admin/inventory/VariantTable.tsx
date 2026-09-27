"use client";

import { variantLabel } from "@/lib/variants";
import type { ProductVariant } from "@/types/catalog";
import { TextInput } from "../form/inputs";

interface VariantTableProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

export default function VariantTable({ variants, onChange }: VariantTableProps) {
  const updateVariant = (index: number, patch: Partial<ProductVariant>) =>
    onChange(variants.map((variant, i) => (i === index ? { ...variant, ...patch } : variant)));

  const applyToAll = (field: "price" | "inventory") => {
    const value = variants[0]?.[field] ?? 0;
    onChange(variants.map((variant) => ({ ...variant, [field]: value })));
  };

  return (
    <div className="overflow-x-auto rounded-[12px] border border-line-light">
      <table className="w-full min-w-[480px] text-left text-[14px]">
        <thead className="border-b border-line-light bg-surface-muted text-[12px] uppercase tracking-wider text-ink-subtle">
          <tr>
            <th className="px-4 py-3 font-medium">Variant</th>
            <th className="px-4 py-3 font-medium">Price ($)</th>
            <th className="px-4 py-3 font-medium">Stock</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-light">
          {variants.map((variant, index) => (
            <tr key={variant.id}>
              <td className="px-4 py-2.5">
                <span className="flex items-center gap-2 font-medium text-ink">
                  {variant.color.hex && (
                    <span className="h-4 w-4 rounded-full border border-line" style={{ backgroundColor: variant.color.hex }} />
                  )}
                  {variantLabel(variant)}
                </span>
              </td>
              <td className="px-4 py-2.5">
                <TextInput
                  type="number"
                  min={0}
                  step="0.01"
                  aria-label={`Price for ${variantLabel(variant)}`}
                  value={variant.price}
                  onChange={(event) => updateVariant(index, { price: Number(event.target.value) })}
                  className="h-10 w-32"
                />
              </td>
              <td className="px-4 py-2.5">
                <TextInput
                  type="number"
                  min={0}
                  step="1"
                  aria-label={`Stock for ${variantLabel(variant)}`}
                  value={variant.inventory}
                  onChange={(event) => updateVariant(index, { inventory: Number(event.target.value) })}
                  className="h-10 w-28"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {variants.length > 1 && (
        <div className="flex flex-wrap gap-4 border-t border-line-light px-4 py-3 text-[13px]">
          <button type="button" onClick={() => applyToAll("price")} className="text-accent hover:underline">
            Use first price for all
          </button>
          <button type="button" onClick={() => applyToAll("inventory")} className="text-accent hover:underline">
            Use first stock for all
          </button>
        </div>
      )}
    </div>
  );
}
