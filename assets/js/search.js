import { LitElement, html, css } from "lit-element";
import qs from "qs";
import _ from "lodash";
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import peopleQuery from "./people/query";
import client from "./lib/apollo";
import gql from "graphql-tag";

import pageArrays from './lib/paging-helper';

class SearchPagination extends LitElement {

  static get properties() {
    return {
        totalElements: { type : Number },
        totalPages: { type: Number },
        number: { type: Number },
        size: { type: Number }
    }
  } 

  static get styles() {
    // TODO: should make link color etc...
    return css`
      a:hover {
          cursor: pointer;
      }
      a {
          text-decoration: underline;
      }
      :host {
        display: block;
      }
      div {
        clear: both;
      }
    `
  }  
  constructor() {
    super();
    this.handlePageSelected = this.handlePageSelected.bind(this);
  }

  handlePageSelected(e) {
    var page = e.target.getAttribute("value");

    this.dispatchEvent(new CustomEvent('pageSelected', {
      detail: { value: page },
      bubbles: true,
      cancelable: false,
      composed: true
    }));
  }  
  // TODO: need some kind of event for paging - which
  // then sends page to search to re-filter
  render() {
    let paging = pageArrays(this.totalPages, this.number, this.size);
    /* might look like this (for example):
    [ 
      [ '-' ],
      [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
      [ '+', 16 ] 
    ]
    */
    let previous = paging[0];
    let next = paging[2];
    let pageList = paging[1];

    let callback = this.handlePageSelected;
    var pages = html`<div>
      ${_.map(pageList, function (i) {
        return html`<li>
            <a value="${i - 1}" @click=${callback}>
              ${i}
            </a>
          </li>`
        })
      }
    </div>`
  

    var previousLink = function() {
       if (previous[0] != '-') {
           return html `<li>
             <a value="${previous[1] - 1}" @click=${callback}>
               ${previous[1]}
             </a>
           </li>`
       }
    };

    var nextLink = function() {
        if (next[0] != '-') {
            return html `<li>
              <a value="${next[1] - 1}" @click=${callback}>
                ${previous[1]}
              </a>
            </li>`
        }
     };

    return html`
      <ul>
        ${previousLink()}
        ${pages}
        ${nextLink()}
      </ul>
    `
  }
}

customElements.define('vivo-search-pagination', SearchPagination);

class SearchFacet extends LitElement {
    
    static get properties() {
        return {
            label: { type : String },
            value: { type: String }
        }
    }

    constructor() {
        super();
        this.handleFacetSelected = this.handleFacetSelected.bind(this);
    }

    handleFacetSelected(e) {
      // if checked == true + add
      // if checked == false - remove
      // getAttribute("value") is returning facet1
      // needs to add/remove filter and re-run search ...
      this.dispatchEvent(new CustomEvent('facetSelected', {
        detail: { checked: e.target.checked, value: e.target.getAttribute("value") },
        bubbles: true,
        cancelable: false,
        composed: true
      }));
    }

    render() {
        return html`
          <label>
            <input type="checkbox" value="${this.value}" @click=${this.handleFacetSelected}>
            ${this.label}
          </label>
        `
    }
}

customElements.define('vivo-search-facet', SearchFacet);

// listen for 'searchResultsObtained'?
class SearchFacets extends LitElement {
 
    static get properties() {
        return {
            data: { type: Object }
        }
    }

    constructor() {
        super();
        this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
    }

    firstUpdated() {
      document.addEventListener('searchResultsObtained',this.handleSearchResultsObtained);
      // NOTE: would need to 'redraw' facets
      // (with 'filters' from search)   
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener('searchResultsObtained',this.handleSearchResultsObtained);
    }

    handleSearchResultsObtained(e) {
      const data = e.detail;
      this.data = data;
      // redraw? facets here
      // facets = data.facets;
    }
    // for filter in filters -> <vivo-search-facet />
    render() {
        // TODO: gather facets from search data              
        let fakeFacet = html`
        <vivo-search-facet value="facet1" label="Facet 1">
        </vivo-search-facet>`

        // grouping of facets per vivo-sidebar-item
        return html`
        <vivo-sidebar-item>
          <h3 slot="heading">Some Facets</h3>
          <div slot="content">
           ${fakeFacet}
          </div>
        </vivo-sidebar-item>
        `
    }
}

customElements.define('vivo-search-facets', SearchFacets);

// global sort of object
class SearchNavigation extends LitElement {
    constructor() {
        super();
        this.browsingState = {};
        this.navFrom = this.navFrom.bind(this);
        this.navTo = this.navTo.bind(this);
        this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
        this.handleSearchSubmitted = this.handleSearchSubmitted.bind(this);
        this.handleFacetSelected = this.handleFacetSelected.bind(this);
        this.handlePageSelected = this.handlePageSelected.bind(this);
    }

    firstUpdated() {
        document.addEventListener('DOMContentLoaded',this.navFrom);
        document.addEventListener('tabSelected',this.handleTabSelected);
        document.addEventListener('searchSubmitted',this.handleSearchSubmitted);
        document.addEventListener('facetSelected',this.handleFacetSelected);
        document.addEventListener('searchResultsObtained',this.handleSearchResultsObtained);
        document.addEventListener('pageSelected',this.handlePageSelected);
        // wouldn't this select the first one?
        let defaultSearch = document.querySelector('vivo-person-search');
        this.browsingState.activeSearch = defaultSearch;
    }
    
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('DOMContentLoaded',this.navFrom);
        document.removeEventListener('tabSelected',this.handleTabSelected);
        document.removeEventListener('searchSubmitted',this.handleSearchSubmitted);
        document.removeEventListener('facetSelected',this.handleFacetSelected);
        document.removeEventListener('searchResultsObtained',this.handleSearchResultsObtained);
        document.removeEventListener('pageSelected',this.handlePageSelected);
    }

    // ??
    // handlePagination(e) { }
    handleTabSelected(e) {
        const tab = e.detail;
        this.browsingState.currentTab = tab.id
        
        let selectedTab = document.querySelector(`#${tab.id}`);
        // should just find the first child of selected tab
        // NOTE: it's just first child
        this.browsingState.activeSearch = selectedTab.querySelector(':first-child');
    }

    handleSearchSubmitted(e) {
        const search = e.detail;
        
        //this.browsingState.currentSearch = search;
        this.browsingState.currentQuery = search;
        let activeSearch = this.browsingState.activeSearch;

        activeSearch.counts();
        activeSearch.search();
    }

    // run search again? send back down?
    handleFacetSelected(e) {
        const facet = e.detail;
        this.browsingState.currentFacet = facet;
        let search = this.browsingState.activeSearch;
        // send in new filters, then re-run active search?
        // search.setFilters( -- facet --);
        search.search();
        // or throw event searchSubmitted?
        console.log(`SearchNavigation:handleFacetSelected;page=${facet.value}:${facet.checked}`);
    }

    handlePageSelected(e) {
      const page = e.detail;
      //console.log(`SearchNavigation:handlePageSelected;page=${page.value}`);
      this.browsingState.currentPage = page;
      let search = this.browsingState.activeSearch;
      // send in new filters, then re-run active search?
      // search.setFilters( -- page --);
      search.setPage(page.value);
      search.search();
      // or throw event searchSubmitted?
    }

    handleSearchResultsObtained(e) {
        const data = e.detail;
        this.browsingState.currentData = data;

        // TODO: instead of having <vivo-person-search />
        // listen for 'searchResultsObtained' - add an updateResults(data)
        // method (to each 'activeSearch')?
        //
        // also send to search results to other data display components?
        // update facets ...
        // update pagination ...
    }

    navTo() {
        const searchParams = new URLSearchParams(this.browsingState);
        window.history.replaceState({},'', `${window.location.pathname}?${searchParams.toString()}`);
        window.location.href = this.browsingState.to;
    }

    navFrom() {
        const url = new URL(window.location.href);
        const incomingBrowsingState = {};
        for(let key of url.searchParams.keys()) {
          incomingBrowsingState[key] = url.searchParams.get(key);
        }
        const { currentTab } = incomingBrowsingState;
        if (currentTab) {
          const tabs = this.getTabs();
          if (tabs) {
            tabs.selectTabById(currentTab);
          }
        }

        // if currentFacet ... 
        // if currentResults ...
    }

    getTabs() {
        return document.querySelector('vivo-tabs');
    } 
    
    // might not make sense to emulate hows tabs work,
    // since facets are a result of search - however they may
    // need to be (re)selected by queryString when returning
    // from link
    getFacets() {
        return document.querySelector('vivo-search-facets');
    } 

}

customElements.define('vivo-search-navigation', SearchNavigation);

class PersonImage extends LitElement {
    static get properties() {
        return {
            thumbnail: { type: String }
        }
    }

    render() {
        // TODO: how to get 'assetPath' in here?
        var url = `${defaultProfileImage}`;

        // baseImageUrl
        if (this.thumbnail != "null") {
            url = `${baseImageUrl}${this.thumbnail}`;
        }
        return html`
        <img className="img-thumbnail" width="90" src="${url}" />
        `
    }
}
customElements.define('vivo-search-person-image', PersonImage);

class PersonCard extends LitElement {

    constructor() {
        super();
    }

    render() {
        return html`
        <h2>          
          <slot name="name" />
        </h2>
        <h3>
          <slot name="title" />
        </h3>
        <slot />
        `
    }
}

customElements.define('vivo-search-person', PersonCard);

// check current tab? or if visible do something else?
class PersonSearch extends LitElement {

  // NOTE: this 'query' is the graphql statement
  // not crazy about JSON.stringify below
  static get properties() {
    return {
        query: { type: Object },
        data: { type: Object },
        countData: { type: Object }
    }
  }

  static get styles() {
    return css`
      vivo-search-person-image {
          float:left;
          width: 10%;
      }
      vivo-search-person {
          float: left;
          width: 90%;
      }
      :host {
          display: block;
          clear: both;
      }
      
    `
  }

  constructor() {
    super();
    this.query = peopleQuery;
    this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
    this.handleCountResultsObtained = this.handleCountResultsObtained.bind(this);
  }

  firstUpdated() {
    document.addEventListener('searchResultsObtained',this.handleSearchResultsObtained);
    document.addEventListener('countResultsObtained',this.handleCountResultsObtained);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('searchResultsObtained',this.handleSearchResultsObtained);
    document.addEventListener('countResultsObtained',this.handleCountResultsObtained);
  }

  handleSearchResultsObtained(e) {
    this.data = e.detail;
  }

  handleCountResultsObtained(e) {
    this.countData = e.detail;
    // NOTE: alias of 'peopleCount' doesn't seem to work
    var personCount = this.countData ? this.countData.people.page.totalElements : 0;
    let tab = document.querySelector('#person-search-tab'); 
    tab.textContent = `People (${personCount})`;
  }

  // need this so we can pass through
  search() {
      let search = this.shadowRoot.querySelector('vivo-search');
      search.search();
  }

  // TODO: not sure it's good to have to remember to call search AND counts
  counts() {
    let search = this.shadowRoot.querySelector('vivo-search');
    search.counts();
  }

  setPage(num) {
    let search = this.shadowRoot.querySelector('vivo-search');
    search.setPage(num);
  }

  render() {
    var results = [];
    if (this.data && this.data.people.content) {
        let content = this.data.people.content;
        _.each(content, function (item) {
            results.push(item);
        });
    }


    var resultsDisplay = html`<div>
      ${_.map(results, function (i) {
        let title = i.preferredTitle || i.id;

        // NOTE: the custom elements here might be better named with 'results'
        // e.g. vivo-search-person-results, or maybe just search-person-results?
        return html`<vivo-search-person-image thumbnail="${i.thumbnail}"></vivo-search-person-image>
              <vivo-search-person>
                <div slot="title">${title}</div>
                <a slot="name" href="/entities/person/${i.id}">
                  ${i.name}
                </a>
                ${i.overview ?
                html`<vivo-truncated-text>${unsafeHTML(i.overview)}</vivo-truncated-text>` :
                html``
            } 
              </vivo-search-person>
            `
        })
      }
    </div>`

    let pagination = html``;

    if (this.data) { 
        pagination = html`<vivo-search-pagination 
            number="${this.data.people.page.number}"
            size="${this.data.people.page.size}"
            totalElements="${this.data.people.page.totalElements}"
            totalPages="${this.data.people.page.totalPages}"
        />`
    }

    return html`
       <vivo-search graphql=${JSON.stringify(this.query)}>
       ${resultsDisplay}
       ${pagination}
       </vivo-search>`  
  }

}

// NOTE: don't like name 'vivo-person-search' with also 'vivo-search-person'
// (they are different)
customElements.define('vivo-person-search', PersonSearch);
// what varies per tab?
// a) the graphql query 
// b) the results 'card'
// c) the facets (but that's just the data anyway)
// d) pagination (also data too)

// should this have blank render() method and delegate down to tab or something?
// e.g. another 'utility' component - the thing that runs queries
// NOTE: a page would have multiple of these (in shadow dom)...
// so *all* would listening to window.searchSubmitted (the way it is now)
class Search extends LitElement {

    // sorting, pageSize too?
    static get properties() {
        return {
            // NOTE: this is what determines different searches
            graphql: { type: Object, attribute: true },
            query: { type: String },
            data: { type: Object },
            page: { type: Number },
            filters: { type: Array }
        }
    }

    constructor() {
        super();
        this.doSearch = this.doSearch.bind(this);
        this.facetSelected = this.facetSelected.bind(this);

        // TODO: specific implementation would need to add to this
        // probably a better way to do over constructor variable
        this.countQuery = gql`
            query($search: String!) {
              peopleCount: people(query: $search) { page { totalElements } }
            }
        `;
    }

    firstUpdated() {
        const parsed = this.parseQuery(window.location.search.substring(1));
        const defaultSearch = (parsed.search && parsed.search.trim().length > 0) ? parsed.search : "*";
        this.query = defaultSearch;
        
        // get these from query string too?
        this.page = 0; // e.g. parsed.page
        this.filters = []; // e.g.parsed.filters ?

        this.counts();
        this.search();

        window.addEventListener('searchSubmitted', this.doSearch);
        window.addEventListener("popstate", this.handlePopState);
        // NOTE: doSearch might need to be called/initiated by other events
        // such as searchChooseFacet or searchTabSelected etc...
        // ??
        window.addEventListener('facetSelected', this.handleFacetSelected);
    }

    parseQuery(qryString) {
        return qs.parse(qryString);
    }

    handlePopState(e) {
       // NOTE: not actually doing anything now
       // var searchParams = new URLSearchParams(window.location.search);
       // console.log(`searchParams=${searchParams.toString()}`);
    }
    
    disconnectedCallback() {
      super.disconnectedCallback();
      window.removeEventListener('searchSubmitted', this.doSearch);
      window.removeEventListener("popstate", this.handlePopState);
      window.removeEventListener('facetSelected', this.handleFacetSelected);
    }

    facetSelected(e) {
      // 1. set filters?
      //this.filters = e.details.
      // 2. re-run search?
      // this.doSearch();
    }

    runCounts() {
        const fetchData = async () => {
            try {
                const { data } = await client.query({
                    query: this.countQuery
                });
                this.data = data;
            } catch (error) {
                console.error(error);
                throw error;
            }
        };
        return fetchData();
    }

    runSearch() {
        const fetchData = async () => {
            try {
                // supposed to be adding facets, filters here (from sidebar)
                // also paging ...
                const { data } = await client.query({
                    query: this.graphql,
                    variables: {
                        pageNumber: this.page,
                        search: this.query,
                        filters: this.filters
                    }
                });
                this.data = data;
            } catch (error) {
                console.error(error);
                throw error;
            }
        };
        return fetchData();
    }

    // something like this? or 
    setFilters(filters = []) {
        this.filters = filters;
    }

    setPage(page = 0) {
        this.page = page;
    }

    setQuery(query = "*") {
        this.query = query;
    }

    /*
    setSearchParameters(parameters) {
        let { filter, page, query } = parameters;
        this.filter = filter;
        this.page = page;
        this.query = query;
    }
    */
    // just a method to combine all UI side-effects of search ...
    // NOTE: assumes parameters have been set
    // setSearchParameters({filter: [], page:0, query: "*"}) --?

    counts() {
        this.runSearch()
          .then(() => {
            this.dispatchEvent(new CustomEvent('countResultsObtained', {
                detail: this.data,
                bubbles: true,
                cancelable: false,
                composed: true
              }));
          })
          .catch((e) => console.error(`Error running search:${e}`));
    }

    search() {
        this.runSearch()
          .then(() => {
            this.dispatchEvent(new CustomEvent('searchResultsObtained', {
                detail: this.data,
                bubbles: true,
                cancelable: false,
                composed: true
              }));
          })
          .catch((e) => console.error(`Error running search:${e}`));
    }
    
    doSearch(e) {
        this.query = e.detail;
        /*
        https://javascriptplayground.com/url-search-params/
        */
        var searchParams = new URLSearchParams(window.location.search);
        searchParams.set("search", e.detail);
        var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
        history.pushState(null, '', newRelativePathQuery);

        this.counts();
        this.search();
    }

    static get styles() {
        return css`
          :host {
              display: block;
              clear: both;
          }
        `
    }

    // pagination element here?
    render() {
        return html`        
          <p><strong>Searching</strong>:<em>${this.query}</em></p>
          <slot />
        `
    }
}

customElements.define('vivo-search', Search);
