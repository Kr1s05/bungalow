import {
  Reservation,
  getReservationById,
  updateReservation,
} from "@/api/reservationsApi";
import ReservationForm from "@/components/ReservationForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { reservationSchema } from "@/schemas/ReservationSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

export default function EditPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["edit"],
    queryFn: () => getReservationById(id ? id : "-1"),
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["edit"] });
    return () => {
      queryClient.invalidateQueries({ queryKey: ["edit"] });
    };
  }, []);

  const [reservation, setReservation] = useState<Reservation | undefined>(data);
  useEffect(() => {
    if (data && data.ID && data.ID != 0) {
      setReservation(data);
    }
  }, [data]);

  const navigate = useNavigate();
  const updateMutation = useMutation({
    mutationKey: ["update"],
    mutationFn: updateReservation,
  });

  if (isError)
    return (
      <main className="p-6 text-lg text-center">
        {" "}
        <p>Error connecting to backend.</p>
      </main>
    );
  if (isLoading || !data)
    return (
      <main className="text-lg text-center p-6">
        <p>Loading...</p>
      </main>
    );

  if (data.ID == 0) return navigate("/");
  const updateFn = (r: z.infer<typeof reservationSchema>) => {
    const reservation: Reservation = {
      ID: Number(id),
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
    updateMutation.mutate(reservation);
  };

  return (
    <main className="h-full w-full p-4 flex flex-col items-center">
      <ScrollArea
        className="h-[calc(100vh-106px)] lg:w-3/4 2xl:w-1/2"
        viewPortClasses="md:flex items-center"
      >
        <ReservationForm reservation={reservation} updateFunction={updateFn} />
      </ScrollArea>
    </main>
  );
}
