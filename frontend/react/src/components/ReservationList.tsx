import { Reservation, ReservationListType } from "@/api/reservationsApi";
import { ScrollArea } from "./ui/scroll-area";
import ReservationElement from "./ReservationElement";
import ReservationPopup from "./ReservationPopup";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getReservationForDate } from "@/util/reservations";

export default function ReservationList(props: {
  reservations: ReservationListType;
}) {
  const [state, setState] = useState<{
    open: boolean;
    reservation: Reservation | undefined;
  }>({
    open: false,
    reservation: undefined,
  });

  useEffect(() => {
    const reservation = getReservationForDate(
      state.reservation?.StartingDate,
      props.reservations
    );
    const open = Boolean(reservation);
    setState({ reservation, open });
  }, [props.reservations]);

  const queryClient = useQueryClient();
  const modalFunction = (reservation: Reservation) => {
    setState({ reservation, open: true });
  };
  const updateFn = () => {
    queryClient.invalidateQueries({ queryKey: ["search"] });
  };
  return (
    <>
      <ScrollArea className="h-[calc(100vh-270px)] w-full lg:w-2/3 text-xl flex flex-col">
        {props.reservations.map((reservation) => (
          <ReservationElement
            reservation={reservation}
            key={reservation.ID}
            modalFn={modalFunction}
          />
        ))}
      </ScrollArea>
      {state.reservation && (
        <ReservationPopup
          open={state.open}
          reservation={state.reservation}
          closeFn={() => setState({ open: false, reservation: undefined })}
          updateFn={updateFn}
        />
      )}
    </>
  );
}
