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

export default function ReservationCard(
  reservation: Reservation & { className?: string }
) {
  return (
    <Card className={reservation.className}>
      <CardHeader>
        <CardTitle>
          {reservation.FirstName + " " + reservation.LastName}
        </CardTitle>
        <CardDescription className="grid grid-cols-2">
          <span>Email:</span>
          <span>{reservation.Email}</span>
          <span>Phone number:</span>
          <span>{reservation.PhoneNumber}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 ">
          <span>Starting Date:</span>
          <span>{reservation.StartingDate.toLocaleDateString()}</span>
          <span>Ending Date:</span>
          <span>{reservation.EndingDate.toLocaleDateString()}</span>
          <span>Length of stay:</span>
          <span>
            {differenceInCalendarDays(
              reservation.EndingDate,
              reservation.StartingDate
            )}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-between">
        <Button className="w-1/4">Confirm</Button>
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
