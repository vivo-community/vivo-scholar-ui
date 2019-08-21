package helpers

import (
	"fmt"
	"log"
	"time"
)

func FormatGraphqlDateForSitemap(dateTime string) string {
	// Mon Apr 18 21:46:34 UTC 2016
	// Mon Jan 2 15:04:05 MST 2006
	fmt.Printf("trying to parse: %v\n", dateTime)
	isoDateTime, error := time.Parse("Mon Jan 2 15:04:05 MST 2006", dateTime)
	if error != nil {
		log.Fatal(error)
	}
	layout := "2006-01-02"
	result := isoDateTime.Format(layout)
	fmt.Printf("trying to return :%v\n", result)
	return result
}
func FormatDateTime(dateTime map[string]interface{}) string {
	isoDateTime, error := time.Parse("2006-01-02T15:04:05", dateTime["dateTime"].(string))
	if error != nil {
		log.Fatal(error)
	}
	resolution := dateTime["resolution"]
	layout := "2006-01-02"
	switch resolution {
	case "year":
		layout = "2006"
	case "yearMonth":
		layout = "2006-01"
	case "yearMonthDay":
		layout = "2006-01-02"
	}
	return isoDateTime.Format(layout)
}
