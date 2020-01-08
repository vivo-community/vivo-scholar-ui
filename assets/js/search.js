import { LitElement, html, css } from "lit-element";
import qs from "qs";
import _ from "lodash";
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import peopleQuery from "./people/query";
import client from "./lib/apollo";

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
    }

    firstUpdated() {
        document.addEventListener('DOMContentLoaded',this.navFrom);
        document.addEventListener('tabSelected',this.handleTabSelected);
        document.addEventListener('searchSubmitted',this.handleSearchSubmitted);
        document.addEventListener('facetSelected',this.handleFacetSelected);
        document.addEventListener('searchResultsObtained',this.handleSearchResultsObtained);
    
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
        activeSearch.search();
    }

    // run search again? send back down?
    handleFacetSelected(e) {
        const facet = e.detail;
        this.browsingState.currentFacet = facet;
        let search = this.browsingState.activeSearch;
        // send in new filters, then re-run active search?
        // search.setFilters(?);
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
        data: { type: Object }
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
  }

  firstUpdated() {
    document.addEventListener('searchResultsObtained',this.handleSearchResultsObtained);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('searchResultsObtained',this.handleSearchResultsObtained);
  }

  handleSearchResultsObtained(e) {
    this.data = e.detail;
    var personCount = this.data ? this.data.people.page.totalElements : 0;
    let tab = document.querySelector('#person-search-tab'); 
    tab.textContent = `People (${personCount})`;
  }

  // need this so we can pass through
  search() {
      let search = this.shadowRoot.querySelector('vivo-search');
      search.search();
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

      return html`
       <vivo-search graphql=${JSON.stringify(this.query)}>
       ${resultsDisplay}
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
    }

    firstUpdated() {
        const parsed = this.parseQuery(window.location.search.substring(1));
        const defaultSearch = (parsed.search && parsed.search.trim().length > 0) ? parsed.search : "*";
        this.query = defaultSearch;
        
        // get these from query string too?
        this.page = 0;
        this.filters = [];

        this.search();
    }

    parseQuery(qryString) {
        return qs.parse(qryString);
    }

    handlePopState(e) {
       // NOTE: not actually doing anything now
       // var searchParams = new URLSearchParams(window.location.search);
       // console.log(`searchParams=${searchParams.toString()}`);
    }
    
    // lit-element callback
    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('searchSubmitted', this.doSearch);
        window.addEventListener("popstate", this.handlePopState);
        // NOTE: doSearch might need to be called/initiated by other events
        // such as searchChooseFacet or searchTabSelected etc...
        // ??
        window.addEventListener('facetSelected', this.handleFacetSelected);
    }

    facetSelected(e) {
      // 1. set filters?
      //this.filters = e.details.
      // 2. re-run search?
      // this.doSearch();
    }

    // NOTE: just running 'peopleQuery' now - there will be
    // other queries (publications etc...)
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

    render() {
        return html`        
          <p><strong>Searching</strong>:<em>${this.query}</em></p>
          <slot />
        `
    }
}

customElements.define('vivo-search', Search);
