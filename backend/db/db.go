package db

import (
	"reflect"
	"strings"
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

//select

func (db *DB) GetAllReservations() *[]Reservation {
	var reservations []Reservation
	db.Find(&reservations)
	return &reservations
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
	db.Where("starting_date BETWEEN ? AND ? OR ending_date BETWEEN ? AND ?", startOfMonth, endOfMonth, startOfMonth, endOfMonth).Order("starting_date ASC").Find(&reservations)
	return &reservations
}

func (db *DB) GetReservationsForPeriod(year int, month time.Month, length int) *[]Reservation {
	var reservations []Reservation
	startOfPeriod := time.Date(year, month, 1, 0, 0, 0, 0, time.Local)
	endOfPeriod := startOfPeriod.AddDate(0, length, 0).Add(-time.Nanosecond)
	db.Where("starting_date BETWEEN ? AND ? OR ending_date BETWEEN ? AND ?", startOfPeriod, endOfPeriod, startOfPeriod, endOfPeriod).Order("starting_date ASC").Find(&reservations)
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

func (db *DB) GetReservationsBySearchQuery(query *Keywords) *[]Reservation {
	var where string
	var reservations []Reservation
	if len(query.Name) > 0 {
		where += "( LOWER(first_name) SIMILAR TO LOWER('%(" + strings.Join(query.Name, "|") + ")%')"
		if len(query.Name) > 1 {
			where += " AND "
		} else {
			where += " OR "
		}
		where += "LOWER(last_name) SIMILAR TO LOWER('%(" + strings.Join(query.Name, "|") + ")%') )"
	}
	if len(query.Email) > 0 {
		where += " OR email SIMILAR TO '%(" + strings.Join(query.Email, "|") + ")%'"
	}
	if len(query.Phone) > 0 {
		where += " AND phone_number SIMILAR TO '%(" + strings.Join(query.Phone, "|") + ")%')"
	}

	db.Debug().Where(where).Find(&reservations)
	return &reservations
}

// create
func (db *DB) CreateReservation(reservation *Reservation) error {
	result := db.Create(reservation)
	return result.Error
}

// update
func (db *DB) UpdateReservation(reservation *Reservation) bool {
	var oldReservation Reservation
	db.First(&oldReservation, reservation.ID)
	if oldReservation.ID != reservation.ID {
		return false
	}

	oldValue := reflect.ValueOf(&oldReservation).Elem()
	newValue := reflect.ValueOf(reservation).Elem()

	for i := 0; i < oldValue.NumField(); i++ {
		oldField := oldValue.Field(i)
		newField := newValue.Field(i)
		if newField.IsValid() && !newField.IsZero() {
			oldField.Set(newField)
		}
	}

	result := db.Save(&oldReservation)
	return result.RowsAffected == 1 && result.Error == nil
}

// delete
func (db *DB) DeleteReservation(id int) bool {
	result := db.Delete(&Reservation{}, id)
	if result.RowsAffected != 1 || result.Error != nil {
		return false
	}
	return true
}
