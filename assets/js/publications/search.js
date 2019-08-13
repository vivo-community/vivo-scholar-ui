import React, { useState, useEffect } from "react"
import axios from 'axios'
import _ from 'lodash'
import PagingPanel from './paging'

//import { createBrowserHistory } from 'history'
import { withRouter } from "react-router"

const PublicationSearch = (props) => {
  const [query, setQuery] = useState('*');
  const [search, setSearch] = useState('*');
  const [url, setUrl] = useState(
    `/search_api/publications?search=*&pageNumber=0`,
  );

  const [ publications, setPublications ] = useState([])
  const [ facets, setFacets ] = useState([])
  const [ page, setPage ] = useState({})
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isError, setIsError ] = useState(false)

  const [ filters, setFilters ] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        const res = await axios(url)
        setPublications(res.data.documentsFacetedSearch.content)
        setFacets(res.data.documentsFacetedSearch.facets)
        setPage(res.data.documentsFacetedSearch.page)

        setIsLoading(false)
      } catch (error) {
        setIsError(true);
      }
    };
    fetchData();
    

  }, [url]);

  // onClick={() =>
  //setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`)}
  const handleSubmit = (evt) => {
      // need to build uri better
      setUrl(`/search_api/publications?search=${query}&pageNumber=0`)
      props.history.push({
        pathname: '/search/publications',
        search: `?search=${query}&pageNumber=0`
      })
      evt.preventDefault()
  }

  const onFacet = (field, value, evt) => {
    if (evt.target.checked) {
      console.log(`ADD filter by ${field} and ${value}`)
    } else {
      console.log(`REMOVE filter by ${field} and ${value}`)
    }
    /*
    FIXME: not sure what to do here
    props.history.push({
      pathname: '/search/publications',
      search: `?search=${query}&pageNumber=${pageNumber}&filters=${filters}`
    })
    */
    setUrl(`/search_api/publications?search=${query}&pageNumber=0`)
  }

  let cb = (pageNumber) => {
    console.log(`page=${pageNumber}`)
    props.history.push({
      pathname: '/search/publications',
      search: `?search=${query}&pageNumber=${pageNumber}`
    })
    setUrl(`/search_api/publications?search=${query}&pageNumber=${pageNumber}`)
 }

  let facetsFragment = ""
  if (facets != undefined && facets.length > 0) {
    // go needs this now
    // filters[0][field]=keywords&filters[0][value]=management
    facetsFragment = (
    <div className="col-sm">
    {facets.map((facet, index) => (
        /* NOTE: needed a key here */
        <div key={`div-${facet.field}`}>
            <h3>{ facet.field }</h3>
            
            <ul className="list-group">
                {facet.entries.content.map((e, index2) => (
                                    
                 <li className="list-group-item" 
                   key={`lgi-${facet.field}+${e.value}`}>
                    <input
                      onChange={(evt) => onFacet(facet.field, e.value, evt)}
                      type="checkbox" 
                      name={`filters[${facet.field}]`}
                      value={e.value} />
                    {e.value} ({e.count})
                 </li>
                 
                ))}
            </ul>
        </div>
    ))}
    </div>
    )
  }

  let pagesFragment = ""
  if (page != undefined) {
    pagesFragment = (
      <div>
      <h3>page {page.number+1} of {page.totalPages} pages</h3>
      <PagingPanel page={page} callback={cb} />
      </div>
    )
  }
  const { match, location, history } = props
  console.log(`You are now at ${location.pathname}`)
  return (
      <div>
        <h2>Publication Search</h2>
        { pagesFragment }
        <form id="searchForm" onSubmit={handleSubmit}>
        
          <div>Query: </div>

          <div className="form-group">
            <label htmlFor="search">Search:</label>
            <input type="text" 
              value={query}
              onChange={event => setQuery(event.target.value)}
              className="form-control" key="search" 
              name="search" placeholder="search..." />
          </div>

          <button>Submit</button>

         {isError && <div>Something went wrong ...</div>}

         {isLoading ? (
           <div>Loading ...</div>
      ) : (
        <div>
       
        
        <div className="row" key={`form-search-row`}>

          <div className="col-sm"> 
            <ul className="list-group">
                     
            {publications.map(item => (
              <li className="list-group-item" key={item.id}>
                <a href={item.id}>{item.title}</a>
              </li>
            ))}
          
            </ul>
          </div>
          <div className="col-sm"> 
              { facetsFragment }
          </div>


        </div>
        </div>
      )}

        </form>

      </div>
  )
}
  
export default withRouter(PublicationSearch)