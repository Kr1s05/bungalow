import { Reservation, ReservationListType } from "@/api/reservationsApi";
import { isAfter, isBefore } from "date-fns";

export const getReservationForDate = (
  date: Date | undefined,
  reservations: ReservationListType | undefined
): Reservation | undefined => {
  if (!reservations) return;
  if (!date) return;
  for (const reservation of reservations) {
    if (isBefore(date, reservation.StartingDate)) continue;
    if (isAfter(date, reservation.EndingDate)) continue;
    return reservation;
  }
};
