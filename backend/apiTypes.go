package main

import (
	"time"

	"github.com/Kr1s05/reservations/db"
)

type ApiReservation struct {
	ID           uint
	StartingDate time.Time
	EndingDate   time.Time
	Confirmed    bool
	Price        float32
	Note         string
	db.Person
}

type ReservationList []ApiReservation

type SearchKeyword struct {
	Word       string
	Categories []string
}

type Query struct {
	Keywords []SearchKeyword
	Month    int
	Year     int
}

func convertToApiReservation(r *db.Reservation) ApiReservation {
	var reservation ApiReservation
	reservation.ID = r.ID
	reservation.StartingDate = r.StartingDate
	reservation.EndingDate = r.EndingDate
	reservation.Person = r.Person
	reservation.Note = r.Note
	reservation.Price = r.Price
	reservation.Confirmed = r.Confirmed
	return reservation
}

func convertSliceToApiReservation(r *[]db.Reservation) []ApiReservation {
	reservations := make([]ApiReservation, len(*r))
	for i, reservation := range *r {
		reservations[i] = convertToApiReservation(&reservation)
	}
	return reservations
}

func convertRequestKeywordsToDbKeywords(w *[]SearchKeyword) *db.Keywords {
	var result db.Keywords
	for _, keyword := range *w {
		for _, category := range keyword.Categories {
			switch category {
			case "name":
				result.Name = append(result.Name, keyword.Word)
			case "email":
				result.Email = append(result.Email, keyword.Word)
			case "phone":
				result.Phone = append(result.Phone, keyword.Word)
			}
		}
	}
	return &result
}
