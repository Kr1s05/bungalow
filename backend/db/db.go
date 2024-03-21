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
	err = db.AutoMigrate(&Person{}, &Reservation{})
	if err != nil {
		panic(err.Error())
	}
	return &DB{DB: *db}
}

func (db *DB) GetPersonById(id int, preload bool) *Person {
	var p Person
	if preload {
		db.Preload("Reservations").Where("id = ?", id).First(&p)
	} else {
		db.Where("id = ?", id).First(&p)
	}
	return &p
}

func (db *DB) GetFilteredPeople(params *Person, preload bool) *[]Person {
	var people []Person
	params.FirstName = "%" + params.FirstName + "%"
	params.LastName = "%" + params.LastName + "%"
	params.PhoneNumber = "%" + params.PhoneNumber + "%"
	params.Email = "%" + params.Email + "%"
	if preload {
		db.Preload("Reservations").Where("first_name like ? AND last_name like ? AND phone_number like ? AND email like ?", params.FirstName, params.LastName, params.PhoneNumber, params.Email).Find(&people)
	} else {
		db.Where("first_name like ? AND last_name like ? AND phone_number like ? AND email like ?", params.FirstName, params.LastName, params.PhoneNumber, params.Email).Find(&people)
	}
	return &people
}

func (db *DB) GetReservationsById(personId int) *[]Reservation {
	var reservations []Reservation
	db.Where("person_id = ?", personId).Find(&reservations)
	return &reservations
}

func (db *DB) GetReservationsByMonth(year int, month time.Month) *[]Reservation {
	var reservations []Reservation
	startOfMonth := time.Date(year, month, 1, 0, 0, 0, 0, time.Local)
	endOfMonth := startOfMonth.AddDate(0, 1, 0).Add(-time.Nanosecond)
	db.Where("starting_date BETWEEN ? AND ? OR ending_date BETWEEN ? AND ?", startOfMonth, endOfMonth, startOfMonth, endOfMonth).Find(&reservations)
	return &reservations
}

func (db *DB) GetPersonByReservationDate(year int, month time.Month, day int) *Person {
	var person Person
	date := time.Date(year, month, day, 0, 0, 0, 0, time.Local)
	db.Limit(1).Joins("inner join reservations on reservations.person_id = people.id").Preload("Reservations", "reservations.starting_date <= ? AND reservations.ending_date > ?", date, date).Where("reservations.starting_date <= ? AND reservations.ending_date > ?", date, date).Find(&person)
	if person.ID == 0 {
		return nil
	}
	return &person
}
