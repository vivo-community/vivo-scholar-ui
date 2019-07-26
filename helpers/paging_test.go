package helpers

import (
	"testing"
	"reflect"
)

// were on page 0 of 1
/*
[ '-' ],
[ 0 ],
[ '-' ]
*/
func Test_Paging_Few_First(t *testing.T) {
	paging := FigurePagingInfo(0, 1)

	if (paging.First.HasMore != false) {
		t.Errorf("page=0, pages=1 %t\n", paging.First.HasMore)
	}
}

func Test_Paging_Few_Last(t *testing.T) {
	paging := FigurePagingInfo(0, 1)

	if (paging.Last.HasMore != false) {
		t.Errorf("page=0, pages=1 %t\n", paging.Last.HasMore)
	}
}

func Test_Paging_Few_List(t *testing.T) {
	paging := FigurePagingInfo(0, 1)

	list := []int{0}
	if (reflect.DeepEqual(paging.PageList, list) != true) {
		t.Errorf("page=0, pages=1 %v\n", paging.PageList)
	}
}
// were on page 0 of 95
/*
[ '-' ],
[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ],
[ '+', 14 ]
*/
func Test_Paging_95_0_First(t *testing.T) {
	paging := FigurePagingInfo(0, 95)

	if (paging.First.HasMore != false) {
		t.Errorf("page=0, pages=95 %t\n", paging.First.HasMore)
	}
}

func Test_Paging_95_0_Last(t *testing.T) {
	paging := FigurePagingInfo(0, 95)

	if (paging.Last.HasMore != true && paging.Last.Next != 14) {
		t.Errorf("page=0, pages=95 %t:%v\n", paging.Last.HasMore, paging.Last.Next)
	}
}

func Test_Paging_95_0_List(t *testing.T) {
	paging := FigurePagingInfo(0, 95)

	list := []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13}
	if (reflect.DeepEqual(paging.PageList, list) != true) {
		t.Errorf("page=0, pages=95 %v\n", paging.PageList)
	}
}

// were on page 65 of 95
/*
[ '+', 44 ],
[ 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73 ],
[ '+', 74 ]
*/
func Test_Paging_95_65_First(t *testing.T) {
	paging := FigurePagingInfo(65, 95)

	if (paging.First.HasMore != true && paging.First.Previous != 44) {
		t.Errorf("page=65, pages=95 %t:%v\n", paging.First.HasMore, paging.First.Previous)
	}
}

func Test_Paging_95_65_Last(t *testing.T) {
	paging := FigurePagingInfo(65, 95)

	if (paging.Last.HasMore != true && paging.Last.Next != 74) {
		t.Errorf("page=65, pages=95 %t:%v\n", paging.Last.HasMore, paging.Last.Next)
	}
}

func Test_Paging_95_65_List(t *testing.T) {
	paging := FigurePagingInfo(65, 95)

	list := []int{59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73}
	if (reflect.DeepEqual(paging.PageList, list) != true) {
		t.Errorf("page=65, pages=95 %v\n", paging.PageList)
	}
}

//if we're on page 92 of 95
//[ '+', 74 ], 
//[ 90, 91, 92, 93, 94, 95 ], 
//[ '-' ]
func Test_Paging_95_92_First(t *testing.T) {
	paging := FigurePagingInfo(92, 95)

	if (paging.First.HasMore != true && paging.First.Previous != 74) {
		t.Errorf("pages=95, page=92 %t:%v\n", paging.First.HasMore, paging.First.Previous)
	}
}

func Test_Paging_95_92_Last(t *testing.T) {
	paging := FigurePagingInfo(92, 95)

	if (paging.Last.HasMore != false) {
		t.Errorf("pages=95, page=92 %t:%v\n", paging.Last.HasMore, paging.Last.Next)
	}
}

func Test_Paging_95_92_List(t *testing.T) {
	paging := FigurePagingInfo(92, 95)

	list := []int{89, 90, 91, 92, 93, 94}
	if (reflect.DeepEqual(paging.PageList, list) != true) {
		t.Errorf("pages=95, page=92 %v\n", paging.PageList)
	}
}

