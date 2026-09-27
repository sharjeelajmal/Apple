"use client";

import { useState } from "react";
import useSectionSave from "@/hooks/useSectionSave";
import { createId } from "@/lib/arrays";
import type { HeroSlide } from "@/types/cms";
import Field from "../../form/Field";
import ImageField from "../../form/ImageField";
import LinkInput from "../../form/LinkInput";
import Repeater from "../../form/Repeater";
import { TextInput } from "../../form/inputs";
import SectionEditorFrame from "../SectionEditorFrame";

const createSlide = (): HeroSlide => ({
  id: createId(),
  subtitle: "",
  title: "New slide",
  description: "",
  buttonText: "Shop Now",
  buttonLink: "/collections/all",
  image: "",
});

export default function HeroSlidesEditor({ initialValue }: { initialValue: HeroSlide[] }) {
  const [slides, setSlides] = useState(initialValue);
  const { status, isSaving, save } = useSectionSave("heroSlides");

  return (
    <SectionEditorFrame
      title="Hero Slider"
      description="The large rotating banner at the top of the home page."
      status={status}
      isSaving={isSaving}
      onSave={() => save(slides)}
    >
      <Repeater
        items={slides}
        onChange={setSlides}
        createItem={createSlide}
        addLabel="Add slide"
        itemLabel={(slide) => slide.title || "Untitled slide"}
        renderItem={(slide, update) => (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Small heading">
              <TextInput value={slide.subtitle} onChange={(event) => update({ subtitle: event.target.value })} />
            </Field>
            <Field label="Title">
              <TextInput value={slide.title} onChange={(event) => update({ title: event.target.value })} />
            </Field>
            <Field label="Description" className="md:col-span-2">
              <TextInput value={slide.description} onChange={(event) => update({ description: event.target.value })} />
            </Field>
            <Field label="Button text">
              <TextInput value={slide.buttonText} onChange={(event) => update({ buttonText: event.target.value })} />
            </Field>
            <Field label="Button link">
              <LinkInput value={slide.buttonLink} onChange={(event) => update({ buttonLink: event.target.value })} />
            </Field>
            <div className="md:col-span-2">
              <ImageField
                label="Background image"
                hint="Recommended: 1920 × 800 px"
                value={slide.image}
                onChange={(image) => update({ image })}
              />
            </div>
          </div>
        )}
      />
    </SectionEditorFrame>
  );
}
