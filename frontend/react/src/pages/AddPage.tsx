import { newReservation } from "@/api/reservationsApi";
import ReservationForm from "@/components/ReservationForm";
import { useEffect, useState } from "react";

export default function AddPage() {
  const [reservation, setReservation] = useState<newReservation>();
  useEffect(() => {}, [reservation]);
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-6">
      <ReservationForm
        updateFunction={(r) => {
          setReservation({
            FirstName: r.firstName,
            LastName: r.lastName,
            Email: r.email,
            PhoneNumber: r.phoneNumber,
            StartingDate: r.startingDate,
            EndingDate: r.endingDate,
            Price: Number(r.price),
            Confirmed: r.confirmed,
            Note: r.note,
          });
        }}
      />
    </main>
  );
}
