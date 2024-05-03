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
import { CircleCheckBig, History } from "lucide-react";

export default function ReservationCard(
  reservation: Reservation & { className?: string }
) {
  return (
    <Card className={reservation.className + " xl:text-lg"}>
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
              {differenceInCalendarDays(
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
        <Button className="w-1/4" disabled={reservation.Confirmed}>
          {reservation.Confirmed ? "Confirmed" : "Confirm"}
        </Button>
        <Button className="w-1/4" variant={"secondary"}>
          Edit
        </Button>
        <Button className="w-1/4" variant={"destructive"}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
