import CalendarCell from "./CalendarCell";
import { MONTH_SHORT_NAMES } from "./calendarUtils";

interface MonthGridProps {
  selectedMonth: number | null;
  currentMonth?: number | null;
  isDisabled?: (month: number) => boolean;
  onSelect: (month: number) => void;
}

export default function MonthGrid({ selectedMonth, currentMonth = null, isDisabled, onSelect }: MonthGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {MONTH_SHORT_NAMES.map((name, month) => (
        <CalendarCell
          key={name}
          isSelected={selectedMonth === month}
          isHighlighted={currentMonth === month}
          isDisabled={isDisabled?.(month)}
          onClick={() => onSelect(month)}
          className="h-12"
        >
          {name}
        </CalendarCell>
      ))}
    </div>
  );
}
