package main

import (
	"github.com/Kr1s05/reservations/db"
)

func main() {
	db.SetupPSQL()
	// reservations := []db.Reservation{
	// 	{PersonId: 1, StartingDate: time.Date(2024, time.July, 18, 0, 0, 0, 0, time.UTC), EndingDate: time.Date(2024, time.August, 8, 0, 0, 0, 0, time.UTC)},
	// 	{PersonId: 1, StartingDate: time.Date(2024, time.June, 18, 0, 0, 0, 0, time.UTC), EndingDate: time.Date(2024, time.July, 1, 0, 0, 0, 0, time.UTC)},
	// }
	// conn.Create(&reservations)
	// person := conn.GetPersonByReservationDate(2024, time.July, 10)
	// fmt.Printf("%+v", person)
}
