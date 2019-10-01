package helpers

import (
	"log"
	"strconv"
)

func FloatToInt(value float64) int {
	result := int(value)
	return result
}

func StringToInt(value string) int {
	result, err := strconv.Atoi(value)
	if err != nil {
		log.Print(err)
		result = 0 // default to 0?
	}
	return result
}
