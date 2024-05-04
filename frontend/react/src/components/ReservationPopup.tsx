import Popup from "reactjs-popup";
import ReservationCard from "./ReservationCard";
import {
  Reservation,
  confirmReservation,
  deleteReservation,
} from "@/api/reservationsApi";
import { useMutation } from "@tanstack/react-query";

export default function ReservationPopup(props: {
  reservation: Reservation;
  open: boolean;
  closeFn: () => void;
  updateFn: () => void;
}) {
  const confirmMutation = useMutation({
    mutationKey: ["confirm"],
    mutationFn: (id: number) => confirmReservation(id),
    onSuccess: props.updateFn,
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete"],
    mutationFn: (id: number) => deleteReservation(id),
    onSuccess: props.updateFn,
  });

  return (
    <Popup
      open={props.open}
      modal
      onClose={props.closeFn}
      closeOnDocumentClick={false}
      position={"center center"}
      className="bg-transparent my-popup"
      nested
    >
      <div className="bg-transparent">
        <ReservationCard
          {...props.reservation}
          closeFn={props.closeFn}
          deleteFn={(id) => {
            deleteMutation.mutate(id);
          }}
          confirmFn={(id) => {
            confirmMutation.mutate(id);
          }}
        />
      </div>
    </Popup>
  );
}
