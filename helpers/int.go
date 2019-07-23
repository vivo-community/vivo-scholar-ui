package helpers

import (
	"log"
	"strconv"
)

func FloatToInt(value float64) int {
	result:= int(value)
	return result
}

func StringToInt(value string) int {
	result, err:= strconv.Atoi(value)
	if err != nil {
		log.Fatal(err)
	}
	return result
}