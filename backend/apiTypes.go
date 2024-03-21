package main

import "time"

type ApiPerson struct {
	ID           uint
	FirstName    string
	LastName     string
	Email        string
	Phone        string
	Reservations *[]ApiReservation
}

type ApiReservation struct {
	ID           uint
	StartingDate time.Time
	EndingDate   time.Time
}
