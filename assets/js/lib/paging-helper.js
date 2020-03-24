import _ from 'lodash'

/*
NOTE: this returns an object with three keys (previous, pageList, next) 
given a total number of pages, the current page, and the 'displaySize' 
(how many should be shown at a time)
  
'previous' is what to do with *before* the list of pages,
'next' is what to do with *after* the list of pages
 
**Example 1:

if we have 95 pages, and we are on page = 0 (displayed as 1) 
and the displaySize = 15:
 
slicePages(95, 0, 15) =>
{
  previous: { display: false },
  pageList: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
  next: { display: true, 16 }
}
 
** Example 2:

if we're on page 65 that falls within the 61-75 range
the *previous* would be 46
the *next would be 76

slicePages(95, 65, 15) =>
{
  previous: { display: true, start: 46 },
  pageList: [ 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75 ],
  next: { display: true, 76 }
}

**Example 3:

if we're on page 92 of 94
that falls with the 91-105 range (but we don't have 105 pages)
so *previous* would be 76
*next* would be no page
and [91...94] are the pages to show 

slicePages(94, 92, 15) =>
{
  previous: { display: true, start: 76 },
  pageList: [ 91, 92, 93, 94 ],
  next: { display: false }
}
 
*/

function slicePages(totalPages, currentPage, displaySize = 5) {
  let previous = { display: false };
  let next = { display: false };
  let pages = _.range(1, totalPages + 1); // default

  if (totalPages <= displaySize) {
    return {
      previous: previous,
      pageList: pages,
      next:  next
    }
  }
  // else ...
  let partitions = Math.floor(totalPages / displaySize);

  // which segment are we in ??
  let currentPartition = Math.floor(currentPage / displaySize)

  let start = (currentPartition * displaySize) + 1
  let end = (start + displaySize > totalPages) ? totalPages : (start + displaySize)
  pages = _.range(start, end)

  if (currentPartition >= partitions) {
    // no next
    previous = { display: true, start: (currentPartition - 1) * displaySize + 1 }
  } else if ((currentPartition < partitions) && (currentPartition > 1)) {
    previous = { display: true, start: (currentPartition - 1) * displaySize + 1 }
    next = { display: true, start: ((currentPartition + 1) * displaySize) + 1 }
  } else if (currentPartition == 1) {
    // previous is first page
    previous = { display: true, start: 1 }
    next = { display: true, start: ((currentPartition + 1) * displaySize) + 1 }
  } else if (currentPartition == 0) {
    // no previous
    next = { display: true, start: ((currentPartition + 1) * displaySize) + 1 }
  }

  return {
      previous: previous,
      pageList: pages,
      next:  next
  }
}

export default slicePages

