import { useEffect, useState } from "react";
import { Calendar } from "./ui/calendar";
import { getReservationsForMultipleMonths } from "@/api/reservationsApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function HomeCalendar() {
  const [state, setState] = useState<{
    currentMonth: Date;
    currentYear: number;
  }>({
    currentMonth: new Date(2024, 3, 1),
    currentYear: new Date().getFullYear(),
  });

  const { data, isError, isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      return await getReservationsForMultipleMonths(
        state.currentYear,
        state.currentMonth.getMonth() + 1,
        6
      );
    },
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["reservations"] });
  }, [state.currentMonth, queryClient]);

  if (isError) {
    return (
      <p className="text-center text-xl">{"Error connecting to backend."}</p>
    );
  }

  if (isLoading) {
    return <p className="text-center text-xl">{"Loading..."}</p>;
  }

  const handleMonthChange = (month: Date) => {
    setState((prevState) => ({
      ...prevState,
      currentMonth: month,
      currentYear: month.getFullYear(),
    }));
  };

  const filterDisabledDates = (date: Date) => {
    return false;
  };

  return (
    <>
      <Calendar
        className="h-fit w-fit"
        showOutsideDays={false}
        ISOWeek
        mode="default"
        onMonthChange={handleMonthChange}
        month={state.currentMonth}
        disabled={filterDisabledDates}
        numberOfMonths={6}
        classNames={{
          month: "space-y-4 border rounded-3xl p-4 h-[395px]",
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
