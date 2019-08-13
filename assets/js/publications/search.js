import React, { useState, useEffect } from "react"
import axios from 'axios'
import _ from 'lodash'

const PublicationSearch = (props) => {
  const [query, setQuery] = useState('*');
  const [search, setSearch] = useState('*');
  const [url, setUrl] = useState(
    `/search_api/publications?search=*&pageNumber=0`,
  );
  //const [query, setQuery] = useState('redux');

  const [ publications, setPublications ] = useState([])
  const [ facets, setFacets ] = useState([])
  const [ page, setPage ] = useState({})
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isError, setIsError ] = useState(false)

  useEffect(() => {
    // TODO: need to build up form query parameters
    /*
    axios
    .get(
      `${url}`
    )
    .then(({ data }) => {
      console.log("setting publications")
      console.log(data)
      setPublications(data.documentsFacetedSearch.content)
      setFacets(data.documentsFacetedSearch.facets)
      setPage(data.documentsFacetedSearch.page)

      console.log(publications)
    });

    */
    const fetchData = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        const res = await axios(url)
        //const res = await axios(
        //  `/search_api/publications`
        // );
        console.log("setting publications")
        console.log(res.data)
        setPublications(res.data.documentsFacetedSearch.content)
        setFacets(res.data.documentsFacetedSearch.facets)
        setPage(res.data.documentsFacetedSearch.page)

        console.log(publications)
        console.log(facets)
        console.log(page)

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
      evt.preventDefault()
  }

  let facetsFragment = ""
  if (facets != undefined && facets.length > 0) {
    // go needs this now
    // filters[0][field]=keywords&filters[0][value]=management
    facetsFragment = (
    <div className="col-sm" key={`form-search-col2`}>
    {facets.map((facet, index) => (
        /* NOTE: needed a key here */
        <div key={`div-${facet.field}`}>
            <h3>{ facet.field }</h3>
            
            <ul className="list-group">
                {facet.entries.content.map((e, index2) => (
                                    
                 <li className="list-group-item" 
                   key={`lgi-${facet.field}+${e.value}`}>
                    <input
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
     <h3>{page}</h3>

    )
  }
  return (
      <div>
        <h2>Publication Search</h2>

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

          <div className="col-sm" key={`form-search-col1`}> 
            <ul className="list-group">
                     
            {publications.map(item => (
              <li className="list-group-item" key={item.id}>
                <a href={item.id}>{item.title}</a>
              </li>
            ))}
          
            </ul>
          </div>
          <div className="col-sm" key={`form-search-col1`}> 
              { facetsFragment }
          </div>


        </div>
        </div>
      )}

        </form>

      </div>
  )
}
  
export default PublicationSearch