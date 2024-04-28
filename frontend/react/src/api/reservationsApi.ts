import { Keyword } from "@/components/SearchBar";
import client from "./AxiosClient";
import { GenericAbortSignal } from "axios";

export async function getReservationsForMonth(
  year: number,
  month: number
): Promise<ReservationList> {
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
): Promise<ReservationList> {
  return client
    .get(`/reservations/${year}/${month}/${length}`)
    .then((response) => {
      if (response.status != 200)
        throw Error(response.statusText + response.status);
      const data: ApiReservationList = response.data;
      const result: ReservationList = data.map(ApiReservationToReservation);
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
): Promise<ReservationList> {
  return client
    .post("/reservations/search", query, { signal })
    .then((response) => {
      if (response.status != 200)
        throw Error(response.statusText + response.status);
      const data: ApiReservationList = response.data;
      const result: ReservationList = data.map(ApiReservationToReservation);
      return result;
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

type ApiReservationList = Array<ApiReservation>;

export type ReservationList = Array<Reservation>;

export type Reservation = {
  ID: number;
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
