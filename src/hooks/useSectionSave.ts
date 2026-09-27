import { useState, useTransition } from "react";
import { saveHomeSection } from "@/actions/admin/cmsActions";
import type { SaveStatus } from "@/components/admin/form/SaveBar";
import type { HomeContent, HomeSectionKey } from "@/types/cms";

export default function useSectionSave<Key extends HomeSectionKey>(section: Key) {
  const [status, setStatus] = useState<SaveStatus>({ tone: "success", message: "" });
  const [isSaving, startTransition] = useTransition();

  const save = (value: HomeContent[Key]) =>
    startTransition(async () => {
      setStatus({ tone: "success", message: "" });
      const { error } = await saveHomeSection(section, value);
      setStatus(error ? { tone: "error", message: error } : { tone: "success", message: "Saved. The home page is updated." });
    });

  return { status, isSaving, save };
}
