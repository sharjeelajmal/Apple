type ChipPickerProps = {
  label: string;
  options: { label: string; value: string }[];
  selected: string[];
  onToggle: (value: string) => void;
};

export default function ChipPicker({ label, options, selected, onToggle }: ChipPickerProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-[15px] font-semibold text-ink">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              aria-pressed={isSelected}
              className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${
                isSelected ? "border-accent bg-accent text-white" : "border-line bg-surface text-ink hover:border-ink"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export const toOptions = (values: readonly string[]) => values.map((value) => ({ label: value, value }));

export const toggleValue = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
