"use client";

import { useState } from "react";
import CalendarCell from "./CalendarCell";
import CalendarHeader from "./CalendarHeader";

const YEARS_PER_PAGE = 12;

interface YearGridProps {
  selectedYear: number | null;
  minYear: number;
  maxYear: number;
  onSelect: (year: number) => void;
}

export default function YearGrid({ selectedYear, minYear, maxYear, onSelect }: YearGridProps) {
  const anchorYear = selectedYear ?? minYear;
  const [pageStart, setPageStart] = useState(minYear + Math.floor((anchorYear - minYear) / YEARS_PER_PAGE) * YEARS_PER_PAGE);
  const years = Array.from({ length: YEARS_PER_PAGE }, (_, index) => pageStart + index);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <CalendarHeader
        onPrevious={() => setPageStart((start) => start - YEARS_PER_PAGE)}
        onNext={() => setPageStart((start) => start + YEARS_PER_PAGE)}
        canGoPrevious={pageStart > minYear}
        canGoNext={pageStart + YEARS_PER_PAGE <= maxYear}
      >
        <span className="px-3 py-1.5 text-[15px] font-semibold text-ink">
          {pageStart} – {Math.min(pageStart + YEARS_PER_PAGE - 1, maxYear)}
        </span>
      </CalendarHeader>
      <div className="grid grid-cols-3 gap-2">
        {years.map((year) => (
          <CalendarCell
            key={year}
            isSelected={selectedYear === year}
            isHighlighted={currentYear === year}
            isDisabled={year < minYear || year > maxYear}
            onClick={() => onSelect(year)}
            className="h-12"
          >
            {year}
          </CalendarCell>
        ))}
      </div>
    </>
  );
}
