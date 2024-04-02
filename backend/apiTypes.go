package main

import (
	"time"

	"github.com/Kr1s05/reservations/db"
)

type ApiReservation struct {
	ID           uint
	StartingDate time.Time
	EndingDate   time.Time
	db.Person
}

type ReservationList struct {
	Month        int
	Reservations []ApiReservation
}

func convertToApiReservation(r *db.Reservation) ApiReservation {
	var reservation ApiReservation
	reservation.ID = r.ID
	reservation.StartingDate = r.StartingDate
	reservation.EndingDate = r.EndingDate
	reservation.Person = r.Person
	return reservation
}

func convertSliceToApiReservation(r *[]db.Reservation) []ApiReservation {
	reservations := make([]ApiReservation, len(*r))
	for i, reservation := range *r {
		reservations[i] = convertToApiReservation(&reservation)
	}
	return reservations
}
