import { Keyword } from "@/components/SearchBar";
import client from "./AxiosClient";
import { GenericAbortSignal } from "axios";

export async function getReservationsForMonth(
  year: number,
  month: number
): Promise<ReservationListType> {
  return client.get(`/reservations/${year}/${month}`).then((response) => {
    if (response.status != 200)
      throw Error(response.statusText + response.status);
    const data: ApiReservationList = response.data;
    const reservations = data.map(ApiReservationToReservation);
    return reservations;
  });
}

export async function getReservationsForMultipleMonths(
  year: number,
  month: number,
  length: number
): Promise<ReservationListType> {
  return client
    .get(`/reservations/${year}/${month}/${length}`)
    .then((response) => {
      if (response.status != 200)
        throw Error(response.statusText + response.status);
      const data: ApiReservationList = response.data;
      const result: ReservationListType = data.map(ApiReservationToReservation);
      return result;
    });
}

export async function getFirstYear() {
  const response = await client.get("/reservations/first_year");
  return Number(response.data);
}

export async function searchReservations(
  query: Query,
  signal: GenericAbortSignal
): Promise<ReservationListType> {
  return client
    .post("/reservations/search", query, { signal })
    .then((response) => {
      if (response.status != 200)
        throw Error(response.statusText + response.status);
      const data: ApiReservationList = response.data;
      const result: ReservationListType = data.map(ApiReservationToReservation);
      return result;
    });
}

export async function getReservationById(id: string): Promise<Reservation> {
  if (id == "-1") throw new Error("Invalid id.");
  return client.get(`/reservation/${id}`).then((response) => {
    if (response.status != 200) throw new Error(response.data.error);
    const data: ApiReservation = response.data;
    return ApiReservationToReservation(data);
  });
}

export async function updateReservation(r: Reservation): Promise<void> {
  return client.post("/reservations/update", r).then((response) => {
    if (response.status != 200) throw new Error("Not updated.");
  });
}

export async function createReservation(r: Reservation): Promise<void> {
  return client.post("/reservations/add", r).then((response) => {
    if (response.status != 200) throw new Error("Not created.");
  });
}

export async function confirmReservation(id: number): Promise<void> {
  return client
    .post("/reservations/confirm", { ID: id, confirmed: true })
    .then((response) => {
      if (response.status != 200) throw new Error("Not confirmed.");
    });
}

export async function deleteReservation(id: number): Promise<void> {
  return client.delete(`/reservations/delete/${id}`).then((response) => {
    if (response.status != 200) throw new Error("Not deleted.");
  });
}

function ApiReservationToReservation(r: ApiReservation): Reservation {
  return {
    ID: r.ID,
    FirstName: r.FirstName,
    LastName: r.LastName,
    Email: r.Email,
    PhoneNumber: r.PhoneNumber,
    StartingDate: new Date(r.StartingDate),
    EndingDate: new Date(r.EndingDate),
    Price: r.Price,
    Note: r.Note,
    Confirmed: r.Confirmed,
  };
}

export type Query = { keywords: Array<Keyword>; month: number; year: number };

type ApiReservation = {
  ID: number;
  StartingDate: string;
  EndingDate: string;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Price: number;
  Note: string;
  Confirmed: boolean;
};

export type newReservation = {
  StartingDate: Date;
  EndingDate: Date;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Price: number;
  Note: string;
  Confirmed: boolean;
};

type ApiReservationList = Array<ApiReservation>;

export type ReservationListType = Array<Reservation>;

export type Reservation = newReservation & {
  ID: number;
};
