package db

import (
	"time"

	"gorm.io/gorm"
)

type DB struct {
	gorm.DB
}

type Reservation struct {
	gorm.Model
	Person       `gorm:"embedded"`
	StartingDate time.Time `gorm:"index"`
	EndingDate   time.Time `gorm:"index"`
}

type Person struct {
	FirstName   string
	LastName    string
	Email       string
	PhoneNumber string
}
