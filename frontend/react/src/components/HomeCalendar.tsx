import { useEffect, useState } from "react";
import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";
import { closestTo, isAfter, isBefore, isSameDay } from "date-fns";

export default function HomeCalendar() {
  const disabled: Array<Date> = [];
  const [state, setState] = useState<{
    currentMonth: Date;
    currentYear: number;
    selectedRange: DateRange | undefined;
  }>({
    currentMonth: new Date(2024, 3, 1),
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

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <>
      <Calendar
        className="h-fit w-fit"
        showOutsideDays={false}
        ISOWeek
        mode="range"
        onMonthChange={handleMonthChange}
        month={state.currentMonth}
        selected={state.selectedRange}
        onSelect={handleSelectionChange}
        disabled={filterDisabledDates}
        numberOfMonths={6}
        classNames={{
          month: "space-y-4",
          months: "grid gap-6 grid-rows-2 grid-cols-3",
          nav_button_next:
            "absolute end-0 hover:bg-primary hover:text-secondary",
          nav_button_previous:
            "absolute start-0 hover:bg-primary hover:text-secondary",
        }}
      />
    </>
  );
}
