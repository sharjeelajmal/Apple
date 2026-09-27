"use client";

import { useState } from "react";
import useSectionSave from "@/hooks/useSectionSave";
import type { ProductShowcase } from "@/types/cms";
import Field from "../../form/Field";
import { TextInput } from "../../form/inputs";
import ProductPicker, { type ProductOption } from "../ProductPicker";
import SectionEditorFrame from "../SectionEditorFrame";

interface CarouselEditorProps {
  initialValue: ProductShowcase;
  productOptions: ProductOption[];
}

export default function CarouselEditor({ initialValue, productOptions }: CarouselEditorProps) {
  const [value, setValue] = useState(initialValue);
  const { status, isSaving, save } = useSectionSave("carousel");
  const update = (patch: Partial<ProductShowcase>) => setValue((prev) => ({ ...prev, ...patch }));

  return (
    <SectionEditorFrame
      title="Product Carousel"
      description="A heading with a handpicked row of products."
      status={status}
      isSaving={isSaving}
      onSave={() => save(value)}
    >
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Heading">
            <TextInput value={value.title} onChange={(event) => update({ title: event.target.value })} />
          </Field>
          <Field label="Subheading">
            <TextInput value={value.subtitle} onChange={(event) => update({ subtitle: event.target.value })} />
          </Field>
        </div>
        <ProductPicker
          label="Products"
          options={productOptions}
          value={value.productHandles}
          onChange={(productHandles) => update({ productHandles })}
        />
      </div>
    </SectionEditorFrame>
  );
}
