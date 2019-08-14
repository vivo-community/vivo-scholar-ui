import React, { useState, useEffect } from "react"
import axios from 'axios'
import _ from 'lodash'
import PagingPanel from './paging'
import qs from 'qs'

import { useQuery } from '@apollo/react-hooks';
import publicationQuery from './query'

//import { createBrowserHistory } from 'history'
//import { withRouter } from "react-router"
import { useRouter } from '../lib/react-router-hooks'

import client from '../lib/apollo'

const PublicationSearch = (props) => {
  const [query, setQuery] = useState('*')
  const [search, setSearch] = useState('*')
  
  const [pageNumber, setPageNumber] = useState(0)

  //$search: String!, $pageNumber: Int!

  // , fetchMore 
  //const { loading, error, data, fetchMore } = useQuery( publicationQuery, {
  // variables: { pageNumber: 0, search: "*" } 
  //}

  /*
  const { loading, error, data } = useQuery(GET_DOG_PHOTO, {
    variables: { breed },
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;
  */

  // NOTE: need to initialize from query params ---
  // queryString.parse(location.search)
  const [url, setUrl] = useState(
    `/search_api/publications?search=*&pageNumber=0`,
  );

  const [ publications, setPublications ] = useState([])
  const [ facets, setFacets ] = useState([])
  const [ page, setPage ] = useState()
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isError, setIsError ] = useState(false)

  const [ filters, setFilters ] = useState([])
  //const { match, location, history } = props
  const { match, location, history } = useRouter()

  console.log(`You are now at ${location.pathname}`)
  console.log(`search=${location.search}`)
  // FIXME: parsing as this: { "?search": "effect", pageNumber: "0" }
  // seems like a bug people would have noticed by now
  //use this instead? might need polyfill
  //const createQueryString = i => (new URLSearchParams(i)).toString()
  //const parseQueryString = i => Array.from(new URLSearchParams(i).entries()).reduce((c, p) => (c[p[0]] = p[1], c), {})
  const parsed = qs.parse(location.search.substring(1))
  console.log("starting with params: %0", parsed)

  // could set it here instead of above
  // maybe even just pass it through if they match exactly
  // as long as defaults happen
  //  let result = qs.stringify(parsed, {encode: false});
  //  //return result ? ('?' + result) : '';
  //const [url, setUrl] = useState(
  //  `/search_api/publications${location.search}`,
  //);

  useEffect(() => {
    /*
            onClick={async () => {
          const { data } = await client.query({
            query: GET_DOG_PHOTO,
            variables: { breed: 'bulldog' },
          });
          */
    /*
      fetchMore({
          variables: {
            offset: data.feed.length
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return Object.assign({}, prev, {
              feed: [...prev.feed, ...fetchMoreResult.feed]
            });
          }
        })
        */
    const fetchData = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // using url (pass through)
        // const res = await axios(url)
        //setPublications(res.data.documentsFacetedSearch.content)
        //setFacets(res.data.documentsFacetedSearch.facets)
        //setPage(res.data.documentsFacetedSearch.page)

        // not using url
        const { data } = await client.query({
          query: publicationQuery,
          variables: { 
            pageNumber: pageNumber,  
            search: query,
            filters: filters
          },
        });
        
        setPublications(data.documentsFacetedSearch.content)
        setFacets(data.documentsFacetedSearch.facets)
        setPage(data.documentsFacetedSearch.page)

        setIsLoading(false)
      } catch (error) {
        console.log(error)
        setIsError(true)
      }
    };
    fetchData();
  }, [url]);

  const handleSubmit = (evt) => {
      props.history.push({
        pathname: '/search/publications',
        search: `?search=${query}&pageNumber=0`
      })
      // need to build uri better
      // instead set props?
      setPageNumber(0)

      //setUrl(`/search_api/publications?search=${query}&pageNumber=0`)
      evt.preventDefault()
  }

  const onFacet = (field, value, evt) => {
    if (evt.target.checked) {
      console.log(`ADD filter by ${field} and ${value}`)
      filters.push({field: field, value: value})
    } else {
      filters = _.without(this.filters, _.find(this.filters, {
        field: field,
        value: value
      }));
      console.log(`REMOVE filter by ${field} and ${value}`)
    }
    /*
    FIXME: not sure what to do here

    maybe use qs -> and filters[] array
    props.history.push({
      pathname: '/search/publications',
      search: `?search=${query}&pageNumber=${pageNumber}&filters=${filters}`
    })

        const newQuery = {
             search: query,
             pageNumber: 0,
             filters: filters,
        }
        const result = qs.stringify(newQuery, {encode: false})
        const queryString = result ? ('?' + result) : ''\

        setUrl(`/search_api/publications${queryString}`)
    */
    setUrl(`/search_api/publications?search=${query}&pageNumber=0`)
  }

  let cb = (pageNumber) => {
    console.log(`page=${pageNumber}`)
    props.history.push({
      pathname: '/search/publications',
      search: `?search=${query}&pageNumber=${pageNumber}`
    })
    setPageNumber(pageNumber)
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
  
//export default withRouter(PublicationSearch)

export default PublicationSearch

/*
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import withData from '../lib/apollo'

const publicationSearch = gql`
query($search: String!, $pageNumber: Int!)  {
  documentsFacetedSearch(
    facets: [{field:"type"}, {field: "numberOfPages"}],
    filters: [],
    paging: { pageSize:100, pageNumber: $pageNumber,
        sort:{ 
          orders: [{direction: ASC, property:"title"}]
        }  
    },
    query: $search
  ) {
    content {
      id
      title
    }
    page {
      totalPages
      number
      size
      totalElements
    }
    facets {
      field
      entries {
        content { 
          value
          count 
        }
      }
    }
  }
}
`

export default withData(graphql(peopleSearch, {
    options: ({ url: { query: { search, pageNumber } }}) => ({ 
      variables: { 
        search,
        pageNumber
      } 
    })
})(PersonList))
*/