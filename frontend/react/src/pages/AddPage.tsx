import { ClientContext } from "@/api/AxiosClientProvider";
import { createReservation, newReservation } from "@/api/reservationsApi";
import ReservationForm from "@/components/ReservationForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

export default function AddPage() {
  const { toast } = useToast();
  const client = useContext(ClientContext);

  const { mutate: addReservation } = useMutation({
    mutationKey: ["add"],
    mutationFn: (r: newReservation) => createReservation(r, client),
    onSuccess: () => {
      toast({
        title: "Successfuly added.",
        className: "text-center w-fit",
        duration: 1000,
      });
    },
  });

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-6">
      <ScrollArea
        className="h-[calc(100vh-185px)] lg:w-3/4 2xl:w-1/2"
        viewPortClasses="md:flex items-center"
      >
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
      </ScrollArea>
    </main>
  );
}
