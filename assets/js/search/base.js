import { LitElement, html, css } from "lit-element";
import qs from "qs";
import _ from "lodash";

import client from "../lib/apollo";
import gql from "graphql-tag";

class Search extends LitElement {

    // sorting, pageSize too?
    static get properties() {
      return {
        // NOTE: this is what determines different searches
        graphql: { type: Object, attribute: true },
        query: { type: String },
        data: { type: Object },
        countData: { type: Object },
        page: { type: Number },
        filters: { type: Array },
        active: { type: Boolean }
      }
    }
  
    constructor() {
      super();
      this.doSearch = this.doSearch.bind(this);
      //this.facetSelected = this.facetSelected.bind(this);
      this.handleFacetSelected = this.handleFacetSelected.bind(this);
      // TODO: specific implementation would need to add to this
      // probably a better way to do over constructor variable
      this.countQuery = gql`
              query($search: String!) {
                peopleCount: people(query: $search) { page { totalElements } }
                pubCount: documents(query: $search) { page { totalElements } }
              }
          `;
      // FIXME: active thing doesn't seem to be working as I planned
      this.active = true;
    }
  
    firstUpdated() {
      const parsed = this.parseQuery(window.location.search.substring(1));
      const defaultSearch = (parsed.search && parsed.search.trim().length > 0) ? parsed.search : "*";
      this.query = defaultSearch;
  
      // get these from query string too?
      this.page = 0; // e.g. parsed.page
      this.filters = []; // e.g.parsed.filters ?
  
      // when first loaded - run counts and query?
      this.counts();
      this.search();
  
      window.addEventListener('searchSubmitted', this.doSearch);
      window.addEventListener("popstate", this.handlePopState);
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
  

    handleFacetSelected(e) {    
      /*
      const facet = e.detail;
      if (facet.checked) {
        this.addFilter(facet);
      } else {
        this.removeFilter(facet);
      }
      console.log(this.filters);
      this.search();
      */
    }
    
    runCounts() {
      const fetchData = async () => {
        try {
          const { data } = await client.query({
            query: this.countQuery,
            variables: {
                search: this.query
              }
          });
          this.countData = data;
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

    setActive(b) {
      this.active = b;
    }
  
    addFilter(filter) {
      this.filters.push({"field": filter.field, "value": filter.value});
    }

    removeFilter(filter) {
      this.filters = _.reject(this.filters, function(o) { 
        return (o.field === filter.field && o.value == filter.value); 
      });
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
      this.runCounts()
        .then(() => {
          this.dispatchEvent(new CustomEvent('countResultsObtained', {
            detail: this.countData,
            bubbles: true,
            cancelable: false,
            composed: true
          }));
        })
        .catch((e) => console.error(`Error running search:${e}`));
    }
  
    search() {
      // should filters be part of custom event?
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
      //see https://javascriptplayground.com/url-search-params/
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
  