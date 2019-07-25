package helpers

import (
	"testing"
	"reflect"
)


// were on page 1 of 95
/*
[ [ '-' ],
[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
[ '+', 16 ] ]
*/
func Test_Paging_95_1_First(t *testing.T) {
	paging := FigurePagingInfo(95, 1)

	if (paging.First.HasMore != false) {
		t.Errorf("pages=95, page=1 %t\n", paging.First.HasMore)
	}
}

func Test_Paging_95_1_Last(t *testing.T) {
	paging := FigurePagingInfo(95, 1)

	if (paging.Last.HasMore != true && paging.Last.Next != 16) {
		t.Errorf("pages=95, page=1 %t:%v\n", paging.Last.HasMore, paging.Last.Next)
	}
}

func Test_Paging_95_1_List(t *testing.T) {
	paging := FigurePagingInfo(95, 1)

	list := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}
	if (reflect.DeepEqual(paging.PageList, list) != true) {
		t.Errorf("pages=95, page=1 %v\n", paging.PageList)
	}
}

// were on page 65 of 95
/*
[ [ '+', 46 ],
[ 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75 ],
[ '+', 76 ] ]
*/
func Test_Paging_95_65_First(t *testing.T) {
	paging := FigurePagingInfo(95, 65)

	if (paging.First.HasMore != true && paging.First.Previous != 46) {
		t.Errorf("pages=95, page=65 %t:%v\n", paging.First.HasMore, paging.First.Previous)
	}
}

func Test_Paging_95_65_Last(t *testing.T) {
	paging := FigurePagingInfo(95, 65)

	if (paging.Last.HasMore != true && paging.Last.Next != 76) {
		t.Errorf("pages=95, page=65 %t:%v\n", paging.Last.HasMore, paging.Last.Next)
	}
}

func Test_Paging_95_65_List(t *testing.T) {
	paging := FigurePagingInfo(95, 65)

	list := []int{61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75}
	if (reflect.DeepEqual(paging.PageList, list) != true) {
		t.Errorf("pages=95, page=65 %v\n", paging.PageList)
	}
}
//if we're on page 92 of 94
//[ [ '+', 76 ], [ 91, 92, 93, 94 ], [ '-' ] ]
func Test_Paging_94_92_First(t *testing.T) {
	paging := FigurePagingInfo(94, 92)

	if (paging.First.HasMore != true && paging.First.Previous != 76) {
		t.Errorf("pages=94, page=92 %t:%v\n", paging.First.HasMore, paging.First.Previous)
	}
}

func Test_Paging_94_92_Last(t *testing.T) {
	paging := FigurePagingInfo(94, 92)

	if (paging.Last.HasMore != false) {
		t.Errorf("pages=94, page=92 %t:%v\n", paging.Last.HasMore, paging.Last.Next)
	}
}

func Test_Paging_94_92_List(t *testing.T) {
	paging := FigurePagingInfo(94, 92)

	// this one is wrong
	list := []int{91, 92, 93, 94}
	if (reflect.DeepEqual(paging.PageList, list) != true) {
		t.Errorf("pages=94, page=92 %v\n", paging.PageList)
	}
}

