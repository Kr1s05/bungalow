import { Reservation } from "@/api/reservationsApi";
import { CircleCheckBig, History } from "lucide-react";

export default function ReservationElement(props: {
  reservation: Reservation;
  modalFn: (reservation: Reservation) => void;
}) {
  return (
    <div onClick={() => props.modalFn(props.reservation)}>
      <div className="relative w-100 h-fit border border-primary shadow-md shadow-secondary rounded-md p-2 grid grid-cols-2 my-2 md:hidden">
        <span>
          {props.reservation.FirstName + " " + props.reservation.LastName}
        </span>
        <span>{props.reservation.PhoneNumber}</span>
        <span className="col-span-2">{props.reservation.Email}</span>
        <span className="col-span-2">
          {props.reservation.StartingDate.toLocaleDateString() +
            " - " +
            props.reservation.EndingDate.toLocaleDateString()}
        </span>
        <div className="flex items-center justify-center absolute size-fit sm:bottom-4 bottom-3 sm:right-8 right-6">
          {props.reservation.Confirmed ? (
            <CircleCheckBig size={35} color="green" />
          ) : (
            <History size={35} color="hsl(var(--primary))" />
          )}
        </div>
      </div>
      <div className="hidden md:grid grid-cols-7 w-100 h-fit border border-primary shadow-md shadow-secondary rounded-md p-2 my-3 leading-7 xl:leading-8">
        <div className="flex flex-col">
          <span>Name: </span>
          <span>Email: </span>
          <span>Date: </span>
          <span>Note: </span>
        </div>
        <div className="flex flex-col col-span-4 lg:pl-8">
          <span>
            {props.reservation.FirstName + " " + props.reservation.LastName}
          </span>
          <span>{props.reservation.Email}</span>
          <span>
            {props.reservation.StartingDate.toLocaleDateString() +
              " - " +
              props.reservation.EndingDate.toLocaleDateString()}
          </span>
          <span>{props.reservation.Note}</span>
        </div>
        <div className="flex-col flex text-lg">
          <span>Price: </span>
          <span className="my-auto text-xl lg:text-2xl">
            {props.reservation.Price + " лв"}
          </span>
        </div>
        <div className="flex items-center justify-center">
          {props.reservation.Confirmed ? (
            <CircleCheckBig size={45} color="green" />
          ) : (
            <History size={45} color="hsl(var(--primary))" />
          )}
        </div>
      </div>
    </div>
  );
}
