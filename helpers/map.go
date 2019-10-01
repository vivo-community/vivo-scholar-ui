package helpers

func HasKey(dict map[string]bool, key string) bool {
	if _, ok := dict[key]; ok {
		//do something here
		return ok
	} else {
		return false
	}
}
