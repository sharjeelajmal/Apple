"use client";

import { useState } from "react";
import useSectionSave from "@/hooks/useSectionSave";
import type { TestimonialSection } from "@/types/cms";
import Field from "../../form/Field";
import ImageField from "../../form/ImageField";
import { TextArea, TextInput } from "../../form/inputs";
import ProductPicker, { type ProductOption } from "../ProductPicker";
import SectionEditorFrame from "../SectionEditorFrame";

interface TestimonialEditorProps {
  initialValue: TestimonialSection;
  productOptions: ProductOption[];
}

export default function TestimonialEditor({ initialValue, productOptions }: TestimonialEditorProps) {
  const [value, setValue] = useState(initialValue);
  const { status, isSaving, save } = useSectionSave("testimonial");
  const update = (patch: Partial<TestimonialSection>) => setValue((prev) => ({ ...prev, ...patch }));

  return (
    <SectionEditorFrame
      title="Testimonial"
      description="A customer quote shown next to a small product grid."
      status={status}
      isSaving={isSaving}
      onSave={() => save(value)}
    >
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Customer name">
            <TextInput value={value.author} onChange={(event) => update({ author: event.target.value })} />
          </Field>
          <Field label="Role / title">
            <TextInput value={value.role} onChange={(event) => update({ role: event.target.value })} />
          </Field>
          <Field label="Quote" className="md:col-span-2">
            <TextArea rows={4} value={value.quote} onChange={(event) => update({ quote: event.target.value })} />
          </Field>
          <div className="md:col-span-2">
            <ImageField label="Customer photo" hint="Square image, at least 150 × 150 px" value={value.avatar} onChange={(avatar) => update({ avatar })} />
          </div>
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
