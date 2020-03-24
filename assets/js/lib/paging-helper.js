import _ from 'lodash'

/*
NOTE: this returns an object with three keys (previous, pageList, next) 
given these three parameters:

totalPages=total number of pages in collection 
currentPage=the current page looking at (likely in URL) 
displaySize=how many pages to show at a time (partitioning cut off)

returns object like this:
{
 previous: what is *before* the list of pages,
 pageList: what pages to list (0 based)
 next: what is *after* the list of pages
}

**Example 1:

if we have 95 pages, and we are on page = 0 (UI displayed as 1) 
and the displaySize = 15:
 
slicePages(95, 0, 15) =>
{
  previous: { display: false },
  pageList: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ],
  next: { display: true, 15 }
}
 
** Example 2:

if we're on page 65 that falls within the 60-74 range
the *previous* would be 45
the *next would be 75

slicePages(95, 65, 15) =>
{
  previous: { display: true, start: 45 },
  pageList: [ 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74 ],
  next: { display: true, 75 }
}

**Example 3:

if we're on page 92 of 94
that falls with the 90-105 range (but we don't have 105 pages)
so *previous* would be 75
*next* would be no page
and [90...94] are the pages to show 

slicePages(94, 92, 15) =>
{
  previous: { display: true, start: 75 },
  pageList: [ 90, 91, 92, 93, 94 ],
  next: { display: false }
}

*/
function slicePages(totalPages, currentPage, displaySize = 5) {
  let previous = { display: false };
  let next = { display: false };
  let pages = _.range(0, totalPages);

  if (totalPages <= displaySize) {
    return {
      previous: previous,
      pageList: pages,
      next:  next
    }
  }
  // else ...
  let partitions = Math.floor(totalPages / displaySize);

  // which segment (partition) are we in ??
  let currentPartition = Math.floor(currentPage / displaySize)

  let start = (currentPartition * displaySize)
  let end = (start + displaySize >= totalPages) ? totalPages : (start + displaySize)
  pages = _.range(start, end)

  if (currentPartition >= partitions) {
    // no next
    previous = { display: true, start: ((currentPartition - 1) * displaySize) }
  } else if ((currentPartition < partitions) && (currentPartition > 1)) {
    previous = { display: true, start: ((currentPartition - 1) * displaySize) }
    next = { display: true, start: ((currentPartition + 1) * displaySize) }
  } else if (currentPartition == 1) {
    // previous is just very first page (0-based)
    previous = { display: true, start: 0 }
    next = { display: true, start: ((currentPartition + 1) * displaySize) }
  } else if (currentPartition == 0) {
    // no previous
    next = { display: true, start: ((currentPartition + 1) * displaySize) }
  }

  return {
      previous: previous,
      pageList: pages,
      next:  next
  }
}

export default slicePages

