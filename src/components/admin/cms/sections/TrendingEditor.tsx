"use client";

import { useState } from "react";
import { productCategories, type CategorySlug } from "@/config/categories";
import useSectionSave from "@/hooks/useSectionSave";
import type { TrendingSection } from "@/types/cms";
import Field from "../../form/Field";
import { TextInput } from "../../form/inputs";
import SectionEditorFrame from "../SectionEditorFrame";

const MAX_PRODUCTS_PER_TAB = 12;

export default function TrendingEditor({ initialValue }: { initialValue: TrendingSection }) {
  const [value, setValue] = useState(initialValue);
  const { status, isSaving, save } = useSectionSave("trending");
  const update = (patch: Partial<TrendingSection>) => setValue((prev) => ({ ...prev, ...patch }));

  const toggleCategory = (slug: CategorySlug) =>
    update({
      categories: value.categories.includes(slug)
        ? value.categories.filter((item) => item !== slug)
        : [...value.categories, slug],
    });

  return (
    <SectionEditorFrame
      title="Trending Items"
      description="Tabs that show the newest products from the categories you choose."
      status={status}
      isSaving={isSaving}
      onSave={() => save(value)}
    >
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Heading">
            <TextInput value={value.title} onChange={(event) => update({ title: event.target.value })} />
          </Field>
          <Field label="Products per tab">
            <TextInput
              type="number"
              min={1}
              max={MAX_PRODUCTS_PER_TAB}
              value={value.productsPerTab}
              onChange={(event) =>
                update({ productsPerTab: Math.min(MAX_PRODUCTS_PER_TAB, Math.max(1, Number(event.target.value))) })
              }
            />
          </Field>
        </div>
        <fieldset>
          <legend className="mb-2 text-[13px] font-medium text-ink">Tabs (in the order you select them)</legend>
          <div className="flex flex-wrap gap-2">
            {productCategories.map(({ slug, name }) => {
              const position = value.categories.indexOf(slug);
              const isSelected = position !== -1;

              return (
                <button
                  key={slug}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleCategory(slug)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-[14px] transition-colors ${
                    isSelected ? "bg-ink text-white" : "border border-line bg-surface text-ink hover:border-ink"
                  }`}
                >
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">{position + 1}</span>
                  )}
                  {name}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>
    </SectionEditorFrame>
  );
}
