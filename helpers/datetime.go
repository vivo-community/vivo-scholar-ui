package helpers

import (
	"time"
)

func FormatGraphqlDate(dateTime string, resolution string) string {
	if len(dateTime) == 0 {
		return ""
	}
	graphqlDateTime, error := parseGraphqlDateTime(dateTime)
	if error != nil {
		return "datetime parse error"
	}
	return FormatDateTime(graphqlDateTime, resolution)
}

func FormatISODate(dateTime string, resolution string) string {
	if len(dateTime) == 0 {
		return ""
	}
	isoDateTime, error := parseISODateTime(dateTime)
	if error != nil {
		return "datetime parse error"
	}
	return FormatDateTime(isoDateTime, resolution)
}

func FormatDateTime(dateTime time.Time, resolution string) string {
	layout := "2006-01-02"
	switch resolution {
	case "year":
		layout = "2006"
	case "yearMonth":
		layout = "2006-01"
	case "yearMonthDay":
		layout = "2006-01-02"
	case "yearMonthFullName":
		layout = "January 2006"
	}
	return dateTime.Format(layout)
}

func parseISODateTime(dateTime string) (time.Time, error) {
	return time.Parse("2006-01-02T15:04:05", dateTime)
}

func parseGraphqlDateTime(dateTime string) (time.Time, error) {
	return time.Parse("Mon Jan 2 15:04:05 UTC 2006", dateTime)
}
