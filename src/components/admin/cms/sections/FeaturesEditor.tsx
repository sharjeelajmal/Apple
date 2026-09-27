"use client";

import { useState } from "react";
import useSectionSave from "@/hooks/useSectionSave";
import { createId } from "@/lib/arrays";
import type { ServiceFeature } from "@/types/cms";
import Field from "../../form/Field";
import ImageField from "../../form/ImageField";
import Repeater from "../../form/Repeater";
import { TextArea, TextInput } from "../../form/inputs";
import SectionEditorFrame from "../SectionEditorFrame";

const createFeature = (): ServiceFeature => ({ id: createId(), title: "New feature", description: "", icon: "" });

export default function FeaturesEditor({ initialValue }: { initialValue: ServiceFeature[] }) {
  const [features, setFeatures] = useState(initialValue);
  const { status, isSaving, save } = useSectionSave("features");

  return (
    <SectionEditorFrame
      title="Service Features"
      description="Icons with short benefits, like free delivery, near the bottom of the page."
      status={status}
      isSaving={isSaving}
      onSave={() => save(features)}
    >
      <Repeater
        items={features}
        onChange={setFeatures}
        createItem={createFeature}
        addLabel="Add feature"
        itemLabel={(feature) => feature.title || "Untitled feature"}
        renderItem={(feature, update) => (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-4">
              <Field label="Title">
                <TextInput value={feature.title} onChange={(event) => update({ title: event.target.value })} />
              </Field>
              <Field label="Description" hint="Press Enter for a new line.">
                <TextArea rows={3} value={feature.description} onChange={(event) => update({ description: event.target.value })} />
              </Field>
            </div>
            <ImageField label="Icon" hint="Transparent PNG or SVG" value={feature.icon} onChange={(icon) => update({ icon })} />
          </div>
        )}
      />
    </SectionEditorFrame>
  );
}
