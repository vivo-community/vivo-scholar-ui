package helpers

import (
	"encoding/json"
	"strings"
	"regexp"
)

func RemoveLanguageTag(value string) string {
	//TODO: probably better to use regexp
	result := strings.Replace(value, "@en-US", "", -1)
	result = strings.Replace(result, "@en-GB", "", -1)
	result = strings.Replace(result, "@de-DE", "", -1)
	result = strings.Replace(result, "@en", "", -1)
	return result
}

func MakeJSONString(obj interface{}) string {
	out, _ := json.Marshal(&obj)
	result := string(out)
	return result
}

func Trim(value string) string {
	result := strings.TrimSpace(value)
	return result
}

func SplitCamelCase(value string) string {
  re := regexp.MustCompile(`([A-Z]+)`)
  result := re.ReplaceAllString(value, ` $1`)
  result = strings.Trim(result, " ")
  return (result)
}
