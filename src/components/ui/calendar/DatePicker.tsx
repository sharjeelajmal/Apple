"use client";

import { useState } from "react";
import CalendarCell from "./CalendarCell";
import CalendarHeader, { HeaderTitleButton } from "./CalendarHeader";
import CalendarPopover from "./CalendarPopover";
import MonthGrid from "./MonthGrid";
import YearGrid from "./YearGrid";
import { getMonthDays, isSameDay, MONTH_LONG_NAMES, startOfDay, WEEKDAY_NAMES } from "./calendarUtils";

const YEARS_AHEAD = 10;

type View = "days" | "months" | "years";

interface DatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
  placeholder?: string;
  buttonClassName: string;
}

export default function DatePicker({ label, value, onChange, minDate, placeholder = "Select a date", buttonClassName }: DatePickerProps) {
  const displayValue = value
    ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(value)
    : "";

  return (
    <CalendarPopover label={label} displayValue={displayValue} placeholder={placeholder} buttonClassName={buttonClassName}>
      {(close) => (
        <DatePanel
          value={value}
          minDate={minDate ? startOfDay(minDate) : null}
          onSelect={(date) => {
            onChange(date);
            close();
          }}
        />
      )}
    </CalendarPopover>
  );
}

interface DatePanelProps {
  value: Date | null;
  minDate: Date | null;
  onSelect: (date: Date) => void;
}

function DatePanel({ value, minDate, onSelect }: DatePanelProps) {
  const today = new Date();
  const initial = value ?? minDate ?? today;
  const [view, setView] = useState<View>("days");
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [viewYear, setViewYear] = useState(initial.getFullYear());

  const minYear = minDate?.getFullYear() ?? today.getFullYear() - YEARS_AHEAD;
  const maxYear = today.getFullYear() + YEARS_AHEAD;

  const shiftMonth = (direction: -1 | 1) => {
    const next = new Date(viewYear, viewMonth + direction, 1);
    setViewMonth(next.getMonth());
    setViewYear(next.getFullYear());
  };

  const isBeforeMin = (date: Date) => Boolean(minDate && date < minDate);

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

  if (view === "months") {
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
          selectedMonth={viewMonth}
          currentMonth={viewYear === today.getFullYear() ? today.getMonth() : null}
          isDisabled={(month) => isBeforeMin(new Date(viewYear, month + 1, 0))}
          onSelect={(month) => {
            setViewMonth(month);
            setView("days");
          }}
        />
      </>
    );
  }

  return (
    <>
      <CalendarHeader
        onPrevious={() => shiftMonth(-1)}
        onNext={() => shiftMonth(1)}
        canGoPrevious={!isBeforeMin(new Date(viewYear, viewMonth, 0))}
      >
        <HeaderTitleButton onClick={() => setView("months")}>{MONTH_LONG_NAMES[viewMonth]}</HeaderTitleButton>
        <HeaderTitleButton onClick={() => setView("years")}>{viewYear}</HeaderTitleButton>
      </CalendarHeader>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_NAMES.map((weekday) => (
          <span key={weekday} className="pb-1 text-[12px] font-medium text-ink-subtle">
            {weekday}
          </span>
        ))}
        {getMonthDays(viewYear, viewMonth).map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />;
          const date = new Date(viewYear, viewMonth, day);

          return (
            <CalendarCell
              key={day}
              isSelected={Boolean(value && isSameDay(value, date))}
              isHighlighted={isSameDay(today, date)}
              isDisabled={isBeforeMin(date)}
              onClick={() => onSelect(date)}
              className="h-9"
            >
              {day}
            </CalendarCell>
          );
        })}
      </div>
    </>
  );
}
