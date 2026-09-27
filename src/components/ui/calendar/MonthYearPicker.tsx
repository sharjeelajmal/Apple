"use client";

import { useState } from "react";
import CalendarHeader, { HeaderTitleButton } from "./CalendarHeader";
import CalendarPopover from "./CalendarPopover";
import MonthGrid from "./MonthGrid";
import YearGrid from "./YearGrid";

const YEARS_AHEAD = 20;

const parseValue = (value: string) => {
  const [month, year] = value.split("/").map(Number);
  return month && year ? { month: month - 1, year: 2000 + year } : null;
};

const formatValue = (month: number, year: number) => `${String(month + 1).padStart(2, "0")}/${String(year).slice(-2)}`;

interface MonthYearPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  buttonClassName: string;
}

export default function MonthYearPicker({
  label,
  value,
  onChange,
  placeholder = "MM / YY",
  buttonClassName,
}: MonthYearPickerProps) {
  const today = new Date();
  const minYear = today.getFullYear();
  const maxYear = minYear + YEARS_AHEAD;
  const selected = parseValue(value);

  return (
    <CalendarPopover
      label={label}
      displayValue={selected ? formatValue(selected.month, selected.year).replace("/", " / ") : ""}
      placeholder={placeholder}
      buttonClassName={buttonClassName}
    >
      {(close) => (
        <MonthYearPanel
          selected={selected}
          minYear={minYear}
          maxYear={maxYear}
          currentMonth={today.getMonth()}
          onSelect={(month, year) => {
            onChange(formatValue(month, year));
            close();
          }}
        />
      )}
    </CalendarPopover>
  );
}

interface MonthYearPanelProps {
  selected: { month: number; year: number } | null;
  minYear: number;
  maxYear: number;
  currentMonth: number;
  onSelect: (month: number, year: number) => void;
}

function MonthYearPanel({ selected, minYear, maxYear, currentMonth, onSelect }: MonthYearPanelProps) {
  const [view, setView] = useState<"months" | "years">("months");
  const [viewYear, setViewYear] = useState(selected?.year ?? minYear);

  if (view === "years") {
    return (
      <YearGrid
        selectedYear={viewYear}
        minYear={minYear}
        maxYear={maxYear}
        onSelect={(year) => {
          setViewYear(year);
          setView("months");
        }}
      />
    );
  }

  return (
    <>
      <CalendarHeader
        onPrevious={() => setViewYear((year) => year - 1)}
        onNext={() => setViewYear((year) => year + 1)}
        canGoPrevious={viewYear > minYear}
        canGoNext={viewYear < maxYear}
      >
        <HeaderTitleButton onClick={() => setView("years")}>{viewYear}</HeaderTitleButton>
      </CalendarHeader>
      <MonthGrid
        selectedMonth={selected?.year === viewYear ? selected.month : null}
        currentMonth={viewYear === minYear ? currentMonth : null}
        isDisabled={(month) => viewYear === minYear && month < currentMonth}
        onSelect={(month) => onSelect(month, viewYear)}
      />
    </>
  );
}
