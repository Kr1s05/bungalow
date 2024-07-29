import { Reservation } from "@/api/reservationsApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { differenceInCalendarDays } from "date-fns";
import { Button } from "./ui/button";
import { CircleCheckBig, History, X } from "lucide-react";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import { useState } from "react";
import "@/style/popup.css";

export default function ReservationCard(
  reservation: Reservation & { className?: string } & {
    confirmFn: (id: number) => void;
    deleteFn: (id: number) => void;
    closeFn: () => void;
  }
) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  return (
    <Card className={reservation.className + " xl:text-lg relative"}>
      <Button
        className="absolute top-2 right-2 p-1 m-0 h-fit rounded-full"
        variant={"outline"}
        onClick={reservation.closeFn}
      >
        <X size={25} />
      </Button>
      <CardHeader>
        <CardTitle>
          {reservation.FirstName + " " + reservation.LastName}
        </CardTitle>
        <CardDescription className="grid grid-cols-3">
          <span className="col-span-2 md:col-span-1">Email:</span>
          <span className="col-span-3 md:col-span-2">{reservation.Email}</span>
          <span className="col-span-2 sm:col-span-1">Phone number: </span>
          <span className="md:col-span-2">{reservation.PhoneNumber}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row">
          <div className="flex flex-col items-start w-1/3">
            <span>Starting Date: </span>
            <span>Ending Date: </span>
            <span className="hidden md:block">Length of stay: </span>
            <span>Price: </span>
            <span>Note: </span>
          </div>
          <div className="flex flex-col items-start w-1/2 md:w-1/3">
            <span>{reservation.StartingDate.toLocaleDateString()}</span>
            <span>{reservation.EndingDate.toLocaleDateString()}</span>
            <span className="hidden md:block">
              {1 +
                differenceInCalendarDays(
                  reservation.EndingDate,
                  reservation.StartingDate
                )}
            </span>
            <span>{reservation.Price + " лв"}</span>
            <span>{reservation.Note}</span>
          </div>
          <div className="flex flex-col text-start items-center w-1/6 md:w-1/3">
            <span className="mb-5">Status: </span>
            {reservation.Confirmed ? (
              <CircleCheckBig size={40} color="green" />
            ) : (
              <History size={40} color="hsl(var(--primary))" />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-between">
        <Button
          className="w-1/4"
          disabled={reservation.Confirmed}
          onClick={() => reservation.confirmFn(reservation.ID)}
        >
          {reservation.Confirmed ? "Confirmed" : "Confirm"}
        </Button>
        <Link to={`/private/edit/${reservation.ID}`} className="w-1/4">
          <Button className="w-full" variant={"secondary"}>
            Edit
          </Button>
        </Link>
        <Button
          variant={"destructive"}
          className="w-1/4"
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
      </CardFooter>
      <Popup
        className="my-nested-popup bg-transparent"
        position={"top center"}
        open={open}
        closeOnDocumentClick
        onClose={closeModal}
        modal
      >
        <div className="border border-secondary bg-background p-2 rounded-md flex flex-col gap-4">
          <h3 className="text-center text-2xl">Are you sure?</h3>
          <p className="p-2">This action is irreversible!</p>
          <div className="w-full flex flex-row p-2 gap-4">
            <Button className="grow" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              className="grow"
              variant={"destructive"}
              onClick={() => reservation.deleteFn(reservation.ID)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Popup>
    </Card>
  );
}
