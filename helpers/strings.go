package helpers

import (
	"strings"
)

func RemoveLanguageTag(value string) string {
	//TODO: probably better to use regexp
	result := strings.Replace(value, "@en-US", "", -1)
	result = strings.Replace(result, "@en-GB", "", -1)
	result = strings.Replace(result, "@de-DE", "", -1)
	result = strings.Replace(result, "@en", "", -1)
	return result
}
