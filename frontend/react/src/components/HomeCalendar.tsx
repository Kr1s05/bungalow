import { useContext, useEffect, useState } from "react";
import { Calendar } from "./ui/calendar";
import {
  Reservation,
  getReservationsForMultipleMonths,
} from "@/api/reservationsApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, isAfter, isBefore, isSameDay } from "date-fns";
import { ActiveModifiers, SelectSingleEventHandler } from "react-day-picker";
import "reactjs-popup/dist/index.css";
import "@/style/popup.css";
import ReservationPopup from "./ReservationPopup";
import { getReservationForDate } from "@/util/reservations";
import { ClientContext } from "@/api/AxiosClientProvider";

export default function HomeCalendar() {
  const client = useContext(ClientContext);
  const [state, setState] = useState<{
    currentMonth: Date;
    currentYear: number;
    selectedDate: Date | undefined;
    cardInfo:
      | {
          reservation: Reservation;
        }
      | undefined;
    openModal: boolean;
  }>({
    currentMonth: new Date(2024, 3, 1),
    currentYear: new Date().getFullYear(),
    selectedDate: undefined,
    cardInfo: undefined,
    openModal: false,
  });

  const {
    data: reservations,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["reservations"],
    queryFn: async ({ signal }) => {
      return await getReservationsForMultipleMonths(
        state.currentYear,
        state.currentMonth.getMonth() + 1,
        6,
        signal,
        client
      );
    },
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["reservations"] });
  }, [state.currentMonth, queryClient]);

  useEffect(() => {
    const reservation = getReservationForDate(
      state.cardInfo?.reservation.StartingDate,
      reservations
    );
    const openModal = Boolean(reservation);
    setState((prevState) => ({
      ...prevState,
      cardInfo: reservation ? { reservation } : undefined,
      openModal,
    }));
  }, [reservations]);

  if (isError) {
    return (
      <p className="text-center text-xl">{"Error connecting to backend."}</p>
    );
  }

  if (isLoading) {
    return <p className="text-center text-xl">{"Loading..."}</p>;
  }

  const modifiersStyles = {
    reserved: {
      color: "hsl(var(--primary))",
      border: "1px solid hsl(var(--secondary))",
    },
    afterReservation: {
      color: "hsl(var(--destructive))",
      border: "1px solid hsl(var(--secondary))",
    },
  };

  const handleMonthChange = (month: Date) => {
    setState((prevState) => ({
      ...prevState,
      currentMonth: month,
      currentYear: month.getFullYear(),
    }));
  };

  const isReservedDate = (date: Date) => {
    if (!reservations) return false;
    for (const reservation of reservations) {
      if (isBefore(date, reservation.StartingDate)) continue;
      if (isAfter(date, reservation.EndingDate)) continue;
      return true;
    }
    return false;
  };

  const isAfterReservation = (date: Date) => {
    if (!reservations) return false;
    if (isReservedDate(date)) return false;
    for (const reservation of reservations) {
      if (isSameDay(date, addDays(reservation.EndingDate, 1))) return true;
    }
    return false;
  };

  const handleSelectionChange: SelectSingleEventHandler = (
    date,
    _,
    modifiers: ActiveModifiers
  ) => {
    let reservation: Reservation | undefined;
    if (modifiers.reserved && date) {
      reservation = getReservationForDate(date, reservations);
    }
    setState((prevState) => ({
      ...prevState,
      selectedDate: modifiers.reserved ? date : undefined,
      cardInfo:
        date && modifiers.reserved && reservation ? { reservation } : undefined,
      openModal: Boolean(date && modifiers.reserved && reservation),
    }));
  };

  const closeModal = () => {
    setState((prevState) => ({ ...prevState, openModal: false }));
  };

  const updateModal = () => {
    queryClient.invalidateQueries({ queryKey: ["reservations"] });
  };

  return (
    <>
      <Calendar
        className="h-fit w-fit"
        showOutsideDays={false}
        ISOWeek
        mode="single"
        selected={state.selectedDate}
        onSelect={handleSelectionChange}
        onMonthChange={handleMonthChange}
        month={state.currentMonth}
        numberOfMonths={6}
        modifiers={{
          reserved: isReservedDate,
          afterReservation: isAfterReservation,
        }}
        modifiersStyles={modifiersStyles}
        classNames={{
          month: "space-y-4 border rounded-3xl p-4 h-[395px]",
          months: "grid gap-3 xl:gap-6 grid-cols-1 lg:grid-cols-3",
          nav_button_next:
            "absolute end-0 hover:bg-primary hover:text-secondary",
          nav_button_previous:
            "absolute start-0 hover:bg-primary hover:text-secondary",
          day_selected: "!bg-primary !text-secondary",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&amp;:has([aria-selected].day-range-end)]:rounded-r-md [&amp;:has([aria-selected].day-outside)]:bg-accent/50 first:[&amp;:has([aria-selected])]:rounded-l-md last:[&amp;:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        }}
      />
      {state.cardInfo && (
        <ReservationPopup
          reservation={state.cardInfo.reservation}
          open={state.openModal}
          closeFn={closeModal}
          updateFn={updateModal}
        />
      )}
    </>
  );
}
