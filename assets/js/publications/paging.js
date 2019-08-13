import _ from 'lodash'
import React from "react"

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

const PagingPanel = ({page: {totalPages, number, size, totalElements}, callback}) => {       
    if (totalPages == 0) {
      return ( <div></div> )
    }

    // trying to make a way for parent components to 
    // generate the link (with possibly more parameters - particularly search)
    const logPage = (page) => console.debug(page)
    let cb = callback || logPage
    // changing 0 based to 1 based
    const currentPage = number + 1
 
    const page = (pageNumber, active) => {
      let key = `pageLinkTo_${pageNumber}`

      //cb(pageNumber)

      if(active) {
        return (
         <li key={key} className="page-item active">
           <a className="page-link">{pageNumber}</a>
         </li>
        )
      } else {
         return (
          <li key={key} className="page-item">
            <span>
            { /* needs to not be actual link */ }
            { /* href={"?pageNumber="+(pageNumber -1)} */ }
              <a className="page-link" onClick={() => cb(pageNumber-1)}>{pageNumber}</a>
            </span>
          </li>
        )
      }
    }

    let pageMap = pageArrays(totalPages - 1, currentPage)
    // pageMap is an array set of arrays
    // more/less links are returned as ['+', 16] or ['-'] (means no number)
    //
    // so example might be [['+', 1][16...30]['+', 31]]
 
    let [previous, current, next] = pageMap
    console.log(pageMap)
    
    let flip = (dir, direction) => {
      
      if(dir != undefined && dir[0] == '+') {
        let pageNumber = dir[1]

        let desc = (
           <a className="page-link" href={"?pageNumber="+(pageNumber -1)}>
              <span aria-hidden="true">&laquo;</span> Previous
            </a>)
        if (direction == 'forward') {
          desc = (
            <a className="page-link" onClick={() => cb(pageNumber-1)}>Next <span aria-hidden="true">&raquo;</span></a>)
        }
        let key = `pageLinkTo_${pageNumber}`
        return (<li key={key}><span>{desc}</span></li>) 
      } else {
        return (<div></div>)
      }
      
      //
    }

    let pages = _.map(current, (x) => {
       let active = (x == currentPage) ? true : false
       return page(x, active)
    })

    let backward = flip(previous, 'backward') 
    let forward = flip(next, 'forward') 

    const paging = () => {
      
      return (
          <ul className="pagination">
            {backward}
            {pages}
            {forward}
          </ul>
      )
    } 
    const pageList = paging()   
    return (
        pageList
    )
  
}

export default PagingPanel
