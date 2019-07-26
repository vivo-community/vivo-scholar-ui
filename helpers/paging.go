package helpers

import (
	"math"
	//"fmt"
)

// NOTE: should probably make this configurable
const PAGE_BY = 15

type FirstPage struct {
   HasMore bool
   Previous int
}

type LastPage struct {
   HasMore bool
   Next int
}

type PagingInfo struct {
    First FirstPage
	PageList []int
	Last LastPage
 }

 func makeRange(min, max int) []int {
    a := make([]int, max-min+1)
    for i := range a {
        a[i] = min + i
    }
    return a
}

// NOTE: assuming 0 based index - this is kind of ugly I know
func FigurePagingInfo(currentPage int, totalPages int) PagingInfo {
	// If total pages = 12 (for example)
	if (totalPages <= PAGE_BY) {
		first := FirstPage{HasMore: false}
		last := LastPage{HasMore: false}
		// 0 based index
		pages := makeRange(0, totalPages - 1)
		return PagingInfo{First: first, PageList: pages, Last:last}
	}
	
	// NOTE: total pages is NOT 0 based - cause it's a count
	partitions := math.Floor(float64(totalPages / PAGE_BY)) 
	// since it's zero based need to add 1 
	// 66 / 15 = 4.? -> 4
	currentPartition := math.Floor(float64((currentPage + 1)/PAGE_BY))

	// if current page = 15 or 30 or 45
	isEnd := (currentPage + 1 % PAGE_BY == 0)
	if (isEnd) {
	  // if it's exact, we don't need to switch to next range
	  currentPartition = currentPartition - 1
	}

	// 0 * 15 = 0
	// 1 * 15 = 15 
	start := int(currentPartition * PAGE_BY) - 1

	// 0 + 15 - 1 = 14
	// 14 + 15 - 1 = 28
	// 29 + 15  - 1 = 43
	end := (int(start) + PAGE_BY) - 1

	// starting after total number of pages
	if (int(start + PAGE_BY) > totalPages) {
		end = totalPages - 1
	}

	// e.g 0=15 (don't include last in range)
	// it goes as PageList in PageInfo
	// don't include -1 in range
	if start < 0 {
		start = 0
	}
	pageRange := makeRange(start, end)
 
	switch {
	//last e.g. page 92 of 100
	case currentPartition >= partitions:
		prev := (int(currentPartition - 1) * PAGE_BY) - 1

		first := FirstPage{
			HasMore: true,
			Previous: prev,
		}
		last := LastPage{HasMore: false}
		return PagingInfo{First: first, PageList: pageRange, Last:last}
	// 'between' e.g. page 47 of 100 	
	case currentPartition < partitions && currentPartition > 1:
		prev := (int(currentPartition - 1) * PAGE_BY) - 1
		first := FirstPage{
			HasMore: true,
			Previous: prev,
		}
		next := (int(currentPartition + 1) * PAGE_BY) - 1
		last := LastPage{
			HasMore: true,
			Next: next,
		}
		return PagingInfo{First: first, PageList: pageRange, Last:last}
	// at 'second' page e.g. page 16 of 100	
	case currentPartition == 1:
		prev := 0
		first := FirstPage{
			HasMore: true,
			Previous: prev,
		}
		next := (int(currentPartition + 1) * PAGE_BY) - 1

		last := LastPage{
			HasMore: true,
			Next: next,
		}
		return PagingInfo{First: first, PageList: pageRange, Last:last}
	// at very start e.g. page 0 of 100	
	case currentPartition == 0:
		first := FirstPage{HasMore: false}
		
		next := int(currentPartition + 1) * PAGE_BY
		last := LastPage{
			HasMore: true,
			Next: next,
		}
		return PagingInfo{First: first, PageList: pageRange, Last:last}
	}


    /*

	// case 1) e.g. page 92 of 100
	if (currentPartition >= partitions) {
		prev := (int(currentPartition - 1) * PAGE_BY)

		first := FirstPage{
			HasMore: true,
			Previous: prev,
		}
		last := LastPage{HasMore: false}
		return PagingInfo{First: first, PageList: pageRange, Last:last}
		// case 2) between e.g. page 47 of 100 
	  } else if ((currentPartition < partitions) && (currentPartition > 1)) {
		prev := int(currentPartition - 1) * PAGE_BY
		first := FirstPage{
			HasMore: true,
			Previous: prev,
		}
		next := int(currentPartition + 1) * PAGE_BY
		last := LastPage{
			HasMore: true,
			Next: next,
		}
		return PagingInfo{First: first, PageList: pageRange, Last:last}
		// case 3) at start e.g. page 16 of 100
	  } else if (currentPartition == 1) {
		first := FirstPage{
			HasMore: true,
			Previous: 1,
		}
		next := (int(currentPartition + 1) * PAGE_BY)

		last := LastPage{
			HasMore: true,
			Next: next,
		}
		return PagingInfo{First: first, PageList: pageRange, Last:last}
		// case 4) at very start e.g. page 0 of 100
	  } else if (currentPartition == 0) {
		
		first := FirstPage{HasMore: false}
		
		next := int(currentPartition + 1) * PAGE_BY
		last := LastPage{
			HasMore: true,
			Next: next,
		}
		return PagingInfo{First: first, PageList: pageRange, Last:last}
	  }
    */
	// if all else fails ...
	return PagingInfo{}
}
