package helpers

import (
	"strings"
)

func RemoveLanguageTag(value string) string {
	result:= strings.Replace(value, "@en-US", "", -1)
	return result
}