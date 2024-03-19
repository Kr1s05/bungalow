package dbdata

import (
	"time"

	"gorm.io/gorm"
)

type DB struct {
	gorm.DB
}

type Person struct {
	gorm.Model
	FirstName    string
	LastName     string
	Email        string
	PhoneNumber  string
	Reservations []Reservation `gorm:"foreignKey:PersonId"`
}

type Reservation struct {
	gorm.Model
	PersonId     uint
	StartingDate time.Time
	EndingDate   time.Time
}

func parseDate(dateStr string) time.Time {
	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		panic(err.Error())
	}
	return date
}
