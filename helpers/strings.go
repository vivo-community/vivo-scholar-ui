package helpers

import (
	"encoding/json"
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

func MakeJSONString(obj interface{}) string {
	out, _ := json.Marshal(&obj)
	//fmt.Printf("out=%s\n", out)
	result := string(out)
	//fmt.Printf("string=%s\n", result)
	return result
}
