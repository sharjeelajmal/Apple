"use client";

import { useState } from "react";
import useIsClient from "@/hooks/useIsClient";
import useSectionSave from "@/hooks/useSectionSave";
import type { CountdownSection } from "@/types/cms";
import Field from "../../form/Field";
import ImageField from "../../form/ImageField";
import DatePicker from "@/components/ui/calendar/DatePicker";
import AdminSelect, { adminSelectButtonClass } from "../../form/AdminSelect";
import { TextInput } from "../../form/inputs";
import SectionEditorFrame from "../SectionEditorFrame";

const MINUTE_STEP = 30;

const timeOptions = Array.from({ length: (24 * 60) / MINUTE_STEP }, (_, index) => {
  const hours = Math.floor((index * MINUTE_STEP) / 60);
  const minutes = (index * MINUTE_STEP) % 60;
  const value = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  const label = new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return { value, label };
});

const toTimeValue = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(Math.floor(date.getMinutes() / MINUTE_STEP) * MINUTE_STEP).padStart(2, "0")}`;

const withTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes).toISOString();
};

export default function CountdownEditor({ initialValue }: { initialValue: CountdownSection }) {
  const [value, setValue] = useState(initialValue);
  const { status, isSaving, save } = useSectionSave("countdown");
  const update = (patch: Partial<CountdownSection>) => setValue((prev) => ({ ...prev, ...patch }));
  const endDate = new Date(value.endDate);
  const isClient = useIsClient();

  return (
    <SectionEditorFrame
      title="Countdown Banner"
      description="A full-width sale banner with a live countdown timer."
      status={status}
      isSaving={isSaving}
      onSave={() => save(value)}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Small heading">
          <TextInput value={value.subtitle} onChange={(event) => update({ subtitle: event.target.value })} />
        </Field>
        <Field label="Title">
          <TextInput value={value.title} onChange={(event) => update({ title: event.target.value })} />
        </Field>
        {isClient && (
          <div className="grid grid-cols-[1fr_140px] gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-ink">Sale ends on</span>
              <DatePicker
                label="Sale end date"
                value={endDate}
                minDate={new Date()}
                onChange={(date) => update({ endDate: withTime(date, toTimeValue(endDate)) })}
                buttonClassName={adminSelectButtonClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-ink">Time</span>
              <AdminSelect
                ariaLabel="Sale end time"
                value={toTimeValue(endDate)}
                options={timeOptions}
                onChange={(time) => update({ endDate: withTime(endDate, time) })}
              />
            </div>
          </div>
        )}
        <div className="md:col-span-2">
          <ImageField label="Background image" hint="Recommended: 1920 × 600 px" value={value.image} onChange={(image) => update({ image })} />
        </div>
      </div>
    </SectionEditorFrame>
  );
}
