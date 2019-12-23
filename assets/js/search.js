import { LitElement, html, css } from "lit-element";
import qs from "qs";
import _ from "lodash";
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import peopleQuery from "./people/query";
import client from "./lib/apollo";

// use history instead of routing?
//https://medium.com/@george.norberg/history-api-getting-started-36bfc82ddefc

function parseQuery(qryString) {
    return qs.parse(qryString);
}

class SearchFacet extends LitElement {
    
    render() {
        return html`
          <label><input type="checkbox">Facet 1</label>
          <slot />
        `
    }
}

customElements.define('vivo-search-facet', SearchFacet);

class SearchFacets extends LitElement {
 
    selectFacetById(facetId) {
        this.selectFacet(this.querySelector(`vivo-facet#${facetId}`));
    }
    
    selectFacet(facet) {
        if (facet) {
          let facets = this.querySelectorAll('vivo-facet');
          facets.forEach((t) => t.removeAttribute('selected'));
          facets.setAttribute('selected', 'selected');
          this.dispatchEvent(new CustomEvent('facetSelected', {
            detail: facet,
            bubbles: true,
            cancelable: false,
            composed: true
          }));
        }
      }

    render() {
        return html`
          <slot />
        `
    }
}

customElements.define('vivo-search-facets', SearchFacets);

// class PeopleFacets extends LitElement {
// NOTE: these would be populated from query results
// var facets ="
//       <vivo-search-facet>
//         <label><input type="checkbox">Facet 1</label>
//       </vivo-search-facet>
//       <vivo-search-facet>
//         <label><input type="checkbox">Facet 2</label>
//      </vivo-search-facet>"
//  render() {
//  return html`
//    <vivo-search-facets>
//    ${facets}
//    </vivo-search-facets>
//  `    
// }
//}

// global sort of object
class SearchNavigation extends LitElement {
    constructor() {
        super();
        this.browsingState = {};
        this.navFrom = this.navFrom.bind(this);
        this.navTo = this.navTo.bind(this);
        this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
        this.handleSearchSubmitted = this.handleSearchSubmitted.bind(this);
    }

    firstUpdated() {
        document.addEventListener('DOMContentLoaded',this.navFrom);
        document.addEventListener('tabSelected',this.handleTabSelected);
        document.addEventListener('searchSubmitted',this.handleSearchSubmitted);
        // 
        document.addEventListener('facetSelected',this.handleFacetSelected);
        document.addEventListener('searchResultsObtained',this.handleSearchResultsObtained);

    }
    
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('DOMContentLoaded',this.navFrom);
        document.removeEventListener('tabSelected',this.handleTabSelected);
        document.removeEventListener('searchSubmitted',this.handleSearchSubmitted);
        document.removeEventListener('facetSelected',this.handleFacetSelected);
        document.removeEventListener('searchResultsObtained',this.handleSearchResultsObtained);
    }

    // handleNewSearch(e) {
    //    updateFacets ... (e.g. setFacets(search.results.facets))
    //    tabs?  update counts?
    //    reset paging ... (e.g. setPaging(search.results.paging))
    //  
    //}

    // ??
    // handlePagination(e) { }
    handleTabSelected(e) {
        const tab = e.detail;
        this.browsingState.currentTab = tab.id
        // switch facets here?
        // run different query?
        //searchResults.selectTabById(currentTab);
        //searchFacets.selectTabById(currentTab);
    }

    handleSearchSubmitted(e) {
        const search = e.detail;
        
        this.browsingState.currentSearch = search;
        
        const { currentTab } = this.browsingState;
        if (currentTab) {
            const facets = this.getFacets();
            if (facets) {
              // have tab and facetids match?
              // send in search - or how to pass 'data' from
              // executed search?
              facets.selectFacetById(currentTab, search);
              //
            }
        }

        // depending on 'tab'
        // 1. update facets
        // 2. update results
        // 3. update pagination
        // switch facets here?
        // run different query?
        //searchResults.selectTabById(currentTab);
        //searchFacets.selectTabById(currentTab);
    }

    handleFacetSelected(e) {
        const facet = e.detail;
        console.log(`facet selected: ${facet}`);
        this.browsingState.currentFacet = facet;
    }

    handleSearchResultsObtained(e) {
        const data = e.detail;
        //console.log(`received search: ${JSON.stringify(data)}`);
        console.log("received search results:");
        console.log(data);
        this.browsingState.currentData = data;

        // update facets ...
        // update pagingation ...
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

// TODO?: make a PeopleSearch, PublicationSearch etc... (each tab)

class Search extends LitElement {

    static get properties() {
        return {
            query: { type: String },
            location: { type: Object },
            data: { type: Object }
        }
    }

    constructor() {
        super();
        const parsed = parseQuery(location.search.substring(1));
        const defaultSearch = (parsed.search && parsed.search.trim().length > 0) ? parsed.search : "*";
        this.query = defaultSearch;

        // should this throw 'searchSubmitted' event?
        this.peopleSearch()
        
        this.doSearch = this.doSearch.bind(this);
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
    }

    // NOTE: just running 'peopleQuery' now - there will be
    // other queries (publications etc...)
    runSearch() {
        const fetchData = async () => {
            try {
                // supposed to be adding facets, filters here (from sidebar)
                // also paging ...
                const { data } = await client.query({
                    query: peopleQuery,
                    variables: {
                        pageNumber: 0,
                        search: this.query,
                        filters: []
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

    // just a method to combine all UI side-effects of search ...
    peopleSearch() {
        this.runSearch()
          .then(() => {
            // TODO: should delegate up and then back down to tabs
            var personCount = this.data ? this.data.personsFacetedSearch.page.totalElements : 0;
            let tab = document.querySelector('#person-search-tab'); 
            tab.textContent = `People (${personCount})`;

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

        // TODO: switch search here based on tab?
        this.peopleSearch()
        // 
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

    render() {
        var results = [];
        if (this.data && this.data.personsFacetedSearch.content) {
            let content = this.data.personsFacetedSearch.content;
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
          <p><strong>Searching</strong>:<em>${this.query}</em></p>
          ${resultsDisplay}
        `
    }
}

customElements.define('vivo-search', Search);
