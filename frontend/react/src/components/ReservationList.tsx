import { ReservationListType } from "@/api/reservationsApi";
import { ScrollArea } from "./ui/scroll-area";
import ReservationElement from "./ReservationElement";

export default function ReservationList(props: {
  reservations: ReservationListType;
}) {
  return (
    <ScrollArea className="h-[calc(100vh-270px)] w-full lg:w-2/3 text-xl flex flex-col">
      {props.reservations.map((reservation) => (
        <ReservationElement reservation={reservation} key={reservation.ID} />
      ))}
    </ScrollArea>
  );
}
