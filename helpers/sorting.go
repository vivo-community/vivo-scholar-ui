package helpers

import (
	"reflect"
	"sort"
)

func SortByStringField(c []interface{}, f string) {
	sortfunc := func(i, j int) bool {
		iVal, jVal := getValues(c, f, i, j)
		return iVal.(string) < jVal.(string)
	}
	sort.SliceStable(c, sortfunc)
}

func SortByStringFieldDesc(c []interface{}, f string) {
	sortfunc := func(i, j int) bool {
		iVal, jVal := getValues(c, f, i, j)
		return jVal.(string) < iVal.(string)
	}
	sort.SliceStable(c, sortfunc)
}

func SortByISODateField(c []interface{}, f string) {
	sortfunc := func(i, j int) bool {
		iVal, jVal := getValues(c, f, i, j)
		iTime, error := parseISODateTime(iVal.(string))
		if error != nil {
			return false
		}
		jTime, error := parseISODateTime(jVal.(string))
		if error != nil {
			return false
		}
		return iTime.Before(jTime)
	}
	sort.SliceStable(c, sortfunc)
}

func SortByISODateFieldDesc(c []interface{}, f string) {
	sortfunc := func(i, j int) bool {
		iVal, jVal := getValues(c, f, i, j)
		iTime, error := parseISODateTime(iVal.(string))
		if error != nil {
			return false
		}
		jTime, error := parseISODateTime(jVal.(string))
		if error != nil {
			return false
		}
		return jTime.Before(iTime)
	}
	sort.SliceStable(c, sortfunc)
}

func SortByGraphqlDateField(c []interface{}, f string) {
	sortfunc := func(i, j int) bool {
		iVal, jVal := getValues(c, f, i, j)
		iTime, error := parseISODateTime(iVal.(string))
		if error != nil {
			return false
		}
		jTime, error := parseISODateTime(jVal.(string))
		if error != nil {
			return false
		}
		return iTime.Before(jTime)
	}
	sort.SliceStable(c, sortfunc)
}

func SortByGraphqlDateFieldDesc(c []interface{}, f string) {
	sortfunc := func(i, j int) bool {
		iVal, jVal := getValues(c, f, i, j)
		iTime, error := parseISODateTime(iVal.(string))
		if error != nil {
			return false
		}
		jTime, error := parseISODateTime(jVal.(string))
		if error != nil {
			return false
		}
		return jTime.Before(iTime)
	}
	sort.SliceStable(c, sortfunc)
}

func getValues(c []interface{}, f string, i int, j int) (interface{}, interface{}) {
	iVal := reflect.ValueOf(c[i]).MapIndex(reflect.ValueOf(f))
	jVal := reflect.ValueOf(c[j]).MapIndex(reflect.ValueOf(f))
	return iVal.Interface(), jVal.Interface()
}
