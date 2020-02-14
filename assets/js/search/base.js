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
        filters: { type: Array }
      }
    }
  
    constructor() {
      super();
      this.doSearch = this.doSearch.bind(this);
      // FIXME: need better place for counts query
      this.countQuery = gql`
              query($search: String!) {
                peopleCount: people(query: $search) { page { totalElements } }
                pubCount: documents(query: $search) { page { totalElements } }
              }
          `;
    }
  
    firstUpdated() {
      const parsed = this.parseQuery(window.location.search.substring(1));
      const defaultQuery = (parsed.search && parsed.search.trim().length > 0) ? parsed.search : "*";
      this.query = defaultQuery;
  
      // get these from query string too?
      this.page = 0; // e.g. parsed.page
      this.filters = []; // e.g.parsed.filters ?
      // when first loaded - run counts and query?
      this.counts();
      this.search();
  
      window.addEventListener('searchSubmitted', this.doSearch);
    }
  
    parseQuery(qryString) {
      return qs.parse(qryString);
    }
  
    handlePopState(e) {
      // NOTE: not actually doing anything now
      // var searchParams = new URLSearchParams(window.location.search);
    }
  
    disconnectedCallback() {
      super.disconnectedCallback();
      window.removeEventListener('searchSubmitted', this.doSearch);
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
      // TODO: send event?
      // this.dispatchEvent(new CustomEvent('searchSent', {
      // so UI can know search, page, filters etc... from event
      const fetchData = async () => {
        try {
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
  
    setFilters(filters = []) {
      this.filters = filters;
    }
  
    setPage(page = 0) {
      this.page = page;
    }
  
    setQuery(query = "*") {
      this.query = query;
    }

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
        .catch((e) => console.error(`Error running counts:${e}`));
    }
  
    search() {
      // should filters be part of this custom event?
      // so facets can know what to check?
      // add more to detail? like this.query?
      // e.g. detail: { data: this.data, query: this.query etc... }
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
  
    // TODO: maybe just <slot>
    // need better way to effect 'Searching': -> 
    render() {
      return html`        
            <p><strong>Searching</strong>:<em>${this.query}</em></p>
            <slot />
          `
    }
  }
  
  customElements.define('vivo-search', Search);
  