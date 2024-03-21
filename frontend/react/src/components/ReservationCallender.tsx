import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";
import { closestTo, isAfter, isBefore, isSameDay } from "date-fns";

export default function ReservationCallender() {
  const disabled = [new Date(), new Date(2024, 2, 6)];
  const [state, setState] = useState<{
    currentMonth: Date;
    currentYear: number;
    selectedRange: DateRange | undefined;
  }>({
    currentMonth: new Date(),
    currentYear: new Date().getFullYear(),
    selectedRange: undefined,
  });

  const handleMonthChange = (month: Date) => {
    setState((prevState) => ({
      ...prevState,
      currentMonth: month,
      currentYear: month.getFullYear(),
    }));
  };

  const handleSelectionChange = (range: DateRange | undefined) => {
    setState((prevState) => ({
      ...prevState,
      selectedRange: range,
    }));
  };

  const filterDisabledDates = (date: Date) => {
    if (!(state.selectedRange && state.selectedRange.from))
      return disabled.some((d) => isSameDay(d, date));
    let disable = false;
    const closestBefore = closestTo(
      state.selectedRange.from,
      disabled.filter((d) => isBefore(d, state.selectedRange.from))
    );
    const closestAfter = closestTo(
      state.selectedRange.from,
      disabled.filter((d) => isAfter(d, state.selectedRange.from))
    );
    if (closestBefore)
      disable = isBefore(date, closestBefore) || isSameDay(date, closestBefore);
    if (disable) return disable;
    if (closestAfter)
      disable = isAfter(date, closestAfter) || isSameDay(date, closestAfter);
    return disable;
  };

  return (
    <>
      <Calendar
        className="h-[400px]"
        showOutsideDays
        ISOWeek
        mode="range"
        onMonthChange={handleMonthChange}
        month={state.currentMonth}
        selected={state.selectedRange}
        onSelect={handleSelectionChange}
        disabled={filterDisabledDates}
      />
    </>
  );
}
