package main

import (
	"fmt"

	"github.com/Kr1s05/reservations/internal/dbdata"
)

func main() {
	db := dbdata.SetupPSQL()
	people := db.GetFilteredPeople(&dbdata.Person{Email: "mail"}, false)
	for _, p := range *people {
		fmt.Printf("%+v\n", p)
	}
}
