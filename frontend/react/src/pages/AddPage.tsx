import { ClientContext } from "@/api/AxiosClientProvider";
import { createReservation, newReservation } from "@/api/reservationsApi";
import ReservationForm from "@/components/ReservationForm";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

export default function AddPage() {
  const client = useContext(ClientContext);

  const { mutate: addReservation } = useMutation({
    mutationKey: ["add"],
    mutationFn: (r: newReservation) => createReservation(r, client),
  });

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-6">
      <ReservationForm
        updateFunction={(r) => {
          const reservation: newReservation = {
            FirstName: r.firstName,
            LastName: r.lastName,
            Email: r.email,
            PhoneNumber: r.phoneNumber,
            StartingDate: r.startingDate,
            EndingDate: r.endingDate,
            Price: Number(r.price),
            Confirmed: r.confirmed,
            Note: r.note,
          };
          addReservation(reservation);
        }}
      />
    </main>
  );
}
