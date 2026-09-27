"use client";

import { useState } from "react";
import useSectionSave from "@/hooks/useSectionSave";
import { createId } from "@/lib/arrays";
import type { CategoryBanner } from "@/types/cms";
import Field from "../../form/Field";
import ImageField from "../../form/ImageField";
import LinkInput from "../../form/LinkInput";
import Repeater from "../../form/Repeater";
import { TextArea, TextInput } from "../../form/inputs";
import SectionEditorFrame from "../SectionEditorFrame";

const createBanner = (): CategoryBanner => ({
  id: createId(),
  title: "New banner",
  subtitle: "",
  image: "",
  link: "/collections/all",
});

export default function CategoryBannersEditor({ initialValue }: { initialValue: CategoryBanner[] }) {
  const [banners, setBanners] = useState(initialValue);
  const { status, isSaving, save } = useSectionSave("categoryBanners");

  return (
    <SectionEditorFrame
      title="Category Banners"
      description="Image cards below the hero slider that link to collections."
      status={status}
      isSaving={isSaving}
      onSave={() => save(banners)}
    >
      <Repeater
        items={banners}
        onChange={setBanners}
        createItem={createBanner}
        addLabel="Add banner"
        itemLabel={(banner) => banner.title.replace(/\n/g, " ") || "Untitled banner"}
        renderItem={(banner, update) => (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" hint="Press Enter for a new line.">
              <TextArea rows={2} value={banner.title} onChange={(event) => update({ title: event.target.value })} />
            </Field>
            <div className="grid gap-4">
              <Field label="Subtitle">
                <TextInput value={banner.subtitle} onChange={(event) => update({ subtitle: event.target.value })} />
              </Field>
              <Field label="Link">
                <LinkInput value={banner.link} onChange={(event) => update({ link: event.target.value })} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <ImageField label="Image" hint="Recommended: 1000 × 575 px" value={banner.image} onChange={(image) => update({ image })} />
            </div>
          </div>
        )}
      />
    </SectionEditorFrame>
  );
}
