package helpers

import (
	"math"
)
/*
 * NOTE: this returns an array of 3 arrays given a total number of pages
 * and the current page.  The first array is what to do with *before*,
 * the last array is what to do with *after*
 *
 * just made PAGE_BY a constant
 *
 * so, as an example:
 *
 * if we have 95 pages, and we 
 * are on page 1:
 *
 [ [ '-' ],
 [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
 [ '+', 16 ] ]
 - means no page to show for *before*
 [1...15] are the pages to show
 +, 16 means the *after* link goes to page 16
 if we're on page 65
 that falls within the 61-75 range
 the *before* would be 46
 the *next would be 76
 [ [ '+', 46 ],
  [ 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75 ],
  [ '+', 76 ] ]
 if we're on page 92 of 94
 that falls with the 91-105 range (but we don't have 105 pages)
 so *before* would be 76
 *next* would be no page
 and [91...94] are the pages to show
[ [ '+', 76 ], [ 91, 92, 93, 94 ], [ '-' ] ]
 *
 */

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

 func FigurePagingInfo(totalPages int, currentPage int) PagingInfo {
	// no first or last page
	if (totalPages <= PAGE_BY) {
		first := FirstPage{HasMore: false}
		last := LastPage{HasMore: false}
		pages := makeRange(1, totalPages + 1)
		return PagingInfo{First: first, PageList: pages, Last:last}
	}
	
	partitions := math.Floor(float64(totalPages / PAGE_BY)) 
	currentPartition := math.Floor(float64(currentPage / PAGE_BY))

	isEnd := (currentPage % PAGE_BY == 0)
	if (isEnd) {
	  // if it's exact, we don't need to switch to next range
	  currentPartition = currentPartition - 1
	}

	start := int(currentPartition * PAGE_BY) + 1
	end := int(start) + PAGE_BY

	if (int(start + PAGE_BY) > totalPages) {
		end = totalPages
	}
	pageRange := makeRange(start, end - 1)
 
	if (currentPartition >= partitions) {
		first := FirstPage{
			HasMore: true,
			Previous: int(currentPartition - 1) * PAGE_BY + 1,
		}
		last := LastPage{HasMore: false}
		return PagingInfo{First: first, PageList: pageRange, Last:last}
	  } else if ((currentPartition < partitions) && (currentPartition > 1)) {
		first := FirstPage{
			HasMore: true,
			Previous: (int(currentPartition - 1) * PAGE_BY) + 1,
		}
		last := LastPage{
			HasMore: true,
			Next: (int(currentPartition + 1) * PAGE_BY) + 1,
		}
		return PagingInfo{First: first, PageList: pageRange, Last:last}
	  } else if (currentPartition == 1) {
		first := FirstPage{
			HasMore: true,
			Previous: 1,
		}
		last := LastPage{
			HasMore: true,
			Next: (int(currentPartition + 1) * PAGE_BY) + 1,
		}
		return PagingInfo{First: first, PageList: pageRange, Last:last}
	  } else if (currentPartition == 0) {
		first := FirstPage{HasMore: false}
		last := LastPage{
			HasMore: true,
			Next: (int(currentPartition + 1) * PAGE_BY) + 1,
		}
		return PagingInfo{First: first, PageList: pageRange, Last:last}
	  }
   
	// if all else fails ...
    return PagingInfo{}
 }
 /*
 const PAGE_BY = 15

 function pageArrays(totalPages, currentPage) {
 
   let returnArray = []
 
   if (totalPages <= PAGE_BY) {
	 let pageArray = _.range(1, totalPages + 1)
	 returnArray.push(['-'])
	 returnArray.push(pageArray)
	 returnArray.push(['-'])
	 return returnArray
   }
   
   let partitions = Math.floor(totalPages/PAGE_BY) 
 
   // which segment are we in ??
   let currentPartition = Math.floor(currentPage/PAGE_BY)
   
   let isEnd =  currentPage % PAGE_BY == 0
   if (isEnd) {
	 // if it's exact, we don't need to switch to next range
	 currentPartition = currentPartition - 1
   }
 
   let start = (currentPartition * PAGE_BY) + 1
 
   let end = (start + PAGE_BY > totalPages) ? totalPages : (start + PAGE_BY)
 
   let pageRange = _.range(start, end)
 
   if (currentPartition >= partitions) {
	 returnArray.push(['+', (currentPartition - 1) * PAGE_BY + 1])
	 returnArray.push(pageRange)
	 returnArray.push(['-'])
   } else if ((currentPartition < partitions) && (currentPartition > 1)) {
	 returnArray.push(['+', (currentPartition - 1) * PAGE_BY + 1])
	 returnArray.push(pageRange)
	 returnArray.push(['+', ((currentPartition + 1) * PAGE_BY) + 1])
   } else if (currentPartition == 1) {
	 returnArray.push(['+', 1])
	 returnArray.push(pageRange)
	 returnArray.push(['+', ((currentPartition + 1) * PAGE_BY) + 1])
   } else if (currentPartition == 0) {
	 returnArray.push(['-'])
	 returnArray.push(pageRange)
	 returnArray.push(['+', ((currentPartition + 1) * PAGE_BY) + 1])
   }
 
   return returnArray
 
 }
 
 
 export default { pageArrays }
 */