package db

import (
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func SetupPSQL() *DB {
	dsn := "host=localhost user=bungalow_user password=1234 dbname=bungalow port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err.Error())
	}
	err = db.AutoMigrate(&Reservation{})
	if err != nil {
		panic(err.Error())
	}
	return &DB{DB: *db}
}

func (db *DB) GetReservationsByPeople(params *Person, preload bool) *[]Reservation {
	var reservations []Reservation
	params.FirstName = "%" + params.FirstName + "%"
	params.LastName = "%" + params.LastName + "%"
	params.PhoneNumber = "%" + params.PhoneNumber + "%"
	params.Email = "%" + params.Email + "%"
	if preload {
		db.Where("first_name like ? AND last_name like ? AND phone_number like ? AND email like ?", params.FirstName, params.LastName, params.PhoneNumber, params.Email).Find(&reservations)
	} else {
		db.Where("first_name like ? AND last_name like ? AND phone_number like ? AND email like ?", params.FirstName, params.LastName, params.PhoneNumber, params.Email).Find(&reservations)
	}
	return &reservations
}

func (db *DB) GetReservationById(id int) *Reservation {
	var reservation Reservation
	db.Find(&reservation, id)
	return &reservation
}

func (db *DB) GetReservationsByMonth(year int, month time.Month) *[]Reservation {
	var reservations []Reservation
	startOfMonth := time.Date(year, month, 1, 0, 0, 0, 0, time.Local)
	endOfMonth := startOfMonth.AddDate(0, 1, 0).Add(-time.Nanosecond)
	db.Where("starting_date BETWEEN ? AND ? OR ending_date BETWEEN ? AND ?", startOfMonth, endOfMonth, startOfMonth, endOfMonth).Find(&reservations)
	return &reservations
}

func (db *DB) GetReservationByDate(year int, month time.Month, day int) *Reservation {
	var reservation Reservation
	date := time.Date(year, month, day, 0, 0, 0, 0, time.Local)
	db.Limit(1).Where("starting_date <= ? AND ending_date > ?", date, date).Find(&reservation)
	if reservation.ID == 0 {
		return nil
	}
	return &reservation
}

func (db *DB) GetReservationsBySearchQuery(query string) *[]Reservation {
	var reservations []Reservation
	db.Where("first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone_number LIKE",
		"%"+query+"%", "%"+query+"%", "%"+query+"%", "%"+query+"%").Find(&reservations)
	return &reservations
}
