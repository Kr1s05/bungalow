package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/Kr1s05/reservations/db"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database := db.SetupPSQL()
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "content-type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

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
		result := convertSliceToApiReservation(reservations)
		c.AsciiJSON(http.StatusOK, result)
	})

	router.GET("/reservations/:year/:month/:length", func(c *gin.Context) {
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
		length, err := strconv.Atoi(c.Param("length"))
		if err != nil {
			c.AsciiJSON(http.StatusBadRequest, gin.H{"error": "Invalid length path parameter."})
			return
		}
		reservations := database.GetReservationsForPeriod(year, time.Month(month), length)
		result := convertSliceToApiReservation(reservations)
		c.AsciiJSON(http.StatusOK, result)
	})

	router.GET("/reservation/:id", func(ctx *gin.Context) {
		id, err := strconv.Atoi(ctx.Param("id"))
		if err != nil {
			ctx.AsciiJSON(http.StatusBadRequest, gin.H{"error": "Invalid id path parameter."})
			return
		}
		reservation := database.GetReservationById(id)
		result := convertToApiReservation(reservation)
		ctx.AsciiJSON(http.StatusOK, result)
	})

	router.GET("/reservations", func(c *gin.Context) {
		reservations := database.GetAllReservations()
		result := convertSliceToApiReservation(reservations)
		c.AsciiJSON(http.StatusOK, result)
	})

	router.GET("/reservations/first_year", func(ctx *gin.Context) {
		year := database.GetFirstYear()
		ctx.AsciiJSON(http.StatusOK, year)
	})

	router.POST("/reservations/search", func(c *gin.Context) {
		var query Query
		c.Bind(&query)
		if query.Month > 12 || query.Month < -1 || query.Month == 0 {
			c.AsciiJSON(http.StatusBadRequest, gin.H{"error": "Invalid Month specified."})
			return
		}
		if len(query.Keywords) > 0 {
			keywords := convertRequestKeywordsToDbKeywords(&query.Keywords)
			reservations := database.GetReservationsBySearchQuery(keywords, time.Month(query.Month), query.Year)
			c.AsciiJSON(http.StatusOK, reservations)
			return
		}
		if query.Month == -1 {
			reservations := database.GetReservationsByYear(query.Year)
			c.AsciiJSON(http.StatusOK, reservations)
			return
		}
		reservations := database.GetReservationsByMonth(query.Year, time.Month(query.Month))
		c.AsciiJSON(http.StatusOK, reservations)
	})

	router.POST("/reservations/add", func(c *gin.Context) {
		var reservation db.Reservation
		c.Bind(&reservation)
		err := database.CreateReservation(&reservation)
		if err != nil {
			c.AsciiJSON(http.StatusBadRequest, err.Error())
			return
		}
		c.Status(http.StatusOK)
	})

	router.POST("/reservations/update", func(c *gin.Context) {
		var reservation db.Reservation
		c.Bind(&reservation)
		status := database.UpdateReservation(&reservation)
		if status {
			c.Status(http.StatusOK)
		} else {
			c.Status(http.StatusNotModified)
		}
	})

	router.DELETE("/reservations/delete/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.AsciiJSON(http.StatusBadRequest, gin.H{"error": "Invalid id path parameter."})
			return
		}
		status := database.DeleteReservation(id)
		if status {
			c.Status(http.StatusOK)
		} else {
			c.Status(http.StatusNotModified)
		}
	})

	router.Run("localhost:8080")
}
