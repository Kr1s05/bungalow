package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/Kr1s05/reservations/db"
	"github.com/gin-gonic/gin"
)

func main() {
	database := db.SetupPSQL()
	router := gin.Default()

	router.GET("/reservations/:year/:month", func(c *gin.Context) {
		month, err := strconv.Atoi(c.Param("month"))
		if err != nil {
			c.AsciiJSON(http.StatusBadRequest, gin.H{"error": "Invalid month path parameter."})
			return
		}
		if month < 1 || month > 12 {
			c.AsciiJSON(http.StatusBadRequest, gin.H{"error": "Invalid month path parameter."})
			return
		}
		year, err := strconv.Atoi(c.Param("year"))
		if err != nil {
			c.AsciiJSON(http.StatusBadRequest, gin.H{"error": "Invalid year path parameter."})
			return
		}
		reservations := database.GetReservationsByMonth(year, time.Month(month))
		result := ReservationList{Month: month, Reservations: convertSliceToApiReservation(reservations)}
		c.AsciiJSON(http.StatusOK, result)
	})

	router.GET("/reservation/search", func(c *gin.Context) {

	})
	router.Run("localhost:8080")
}
