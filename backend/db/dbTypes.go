package db

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
	PersonId     uint      `gorm:"index"`
	StartingDate time.Time `gorm:"index"`
	EndingDate   time.Time `gorm:"index"`
}
