package db

import (
	"os"
	"strings"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func SetupPSQL() *DB {
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	database := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")
	ssl := os.Getenv("DB_SSL")
	if ssl == "" {
		ssl = "disable"
	}
	dsn := "host=" + host + " user=" + user + " password=" + password + " dbname=" + database + " port=" + port + " sslmode=" + ssl + ""
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

func (db *DB) GetReservationsByYear(year int) *[]Reservation {
	var reservations []Reservation
	startOfYear := time.Date(year, 1, 1, 0, 0, 0, 0, time.Local)
	endOfYear := startOfYear.AddDate(1, 0, 0).Add(-time.Nanosecond)
	db.Where("starting_date BETWEEN ? AND ? OR ending_date BETWEEN ? AND ?", startOfYear, endOfYear, startOfYear, endOfYear).Order("starting_date ASC").Find(&reservations)
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

func (db *DB) GetReservationsBySearchQuery(query *Keywords, month time.Month, year int) *[]Reservation {
	var where string
	var reservations []Reservation
	var startDate, endDate time.Time
	if month == -1 {
		startDate = time.Date(year, 1, 1, 0, 0, 0, 0, time.Local)
		endDate = startDate.AddDate(1, 0, 0).Add(-time.Nanosecond)
	} else {
		startDate = time.Date(year, month, 1, 0, 0, 0, 0, time.Local)
		endDate = startDate.AddDate(0, 1, 0).Add(-time.Nanosecond)
	}

	if len(query.Name) > 0 {
		where += "((LOWER(first_name) SIMILAR TO LOWER('%(" + strings.Join(query.Name, "|") + ")%')"
		if len(query.Name) > 1 {
			where += " AND "
		} else {
			where += " OR "
		}
		where += "LOWER(last_name) SIMILAR TO LOWER('%(" + strings.Join(query.Name, "|") + ")%') )"
		if len(query.Email) == 0 {
			where += ")"
		}
	}
	if len(query.Email) > 0 {
		if len(query.Name) > 0 {
			where += " OR"
		} else {
			where += "("
		}
		where += " email SIMILAR TO '%(" + strings.Join(query.Email, "|") + ")%')"
	}
	if len(query.Phone) > 0 {
		if len(query.Email) > 0 || len(query.Name) > 0 {
			where += " AND"
		}
		where += " phone_number SIMILAR TO '%(" + strings.Join(query.Phone, "|") + ")%'"
	}
	db.Debug().Where("(starting_date BETWEEN ? AND ? OR ending_date BETWEEN ? AND ?) AND ("+where+")", startDate, endDate, startDate, endDate).Order("starting_date ASC").Find(&reservations)
	return &reservations
}

func (db *DB) GetFirstYear() int {
	var year int
	db.Raw("select extract(year from MIN(starting_date)) from reservations").First(&year)
	return year
}

// create
func (db *DB) CreateReservation(reservation *Reservation) error {
	result := db.Create(reservation)
	return result.Error
}

// update
func (db *DB) UpdateReservation(reservation *Reservation) bool {
	result := db.Save(&reservation)
	return result.RowsAffected == 1 && result.Error == nil
}

func (db *DB) SetConfirmed(id uint, confirmed bool) int64 {
	result := db.Model(&Reservation{}).Where("id = ?", id).Update("confirmed", confirmed)
	return result.RowsAffected
}

// delete
func (db *DB) DeleteReservation(id int) bool {
	result := db.Delete(&Reservation{}, id)
	if result.RowsAffected != 1 || result.Error != nil {
		return false
	}
	return true
}
