package helpers

import (
	"log"
	"time"
)

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
