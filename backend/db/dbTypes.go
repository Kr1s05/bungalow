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
	Confirmed    bool
	Price        float32
	Note         string
}

type Person struct {
	FirstName   string
	LastName    string
	Email       string
	PhoneNumber string
}

type Keywords struct {
	Name  []string
	Email []string
	Phone []string
}
