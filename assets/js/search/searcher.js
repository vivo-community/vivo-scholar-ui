//import { LitElement, html, css } from "lit-element";
import qs from "qs";
import _ from "lodash";

import client from "../lib/apollo";
//import gql from "graphql-tag";
import countQuery from "./count-query";

// NOTE: one way to do this, not the only way
// http://exploringjs.com/es6/ch_classes.html
// http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
let Searcher = (superclass) => class extends superclass {

   static get properties() {
     return {
        data: { type: Object },
        countData: { type: Object },
        active: { type: Boolean }
      }
    }

    setUp() {
      // TODO: maybe not mix up url parsing into this mixin
      const parsed = this.parseQuery(window.location.search.substring(1));
      const defaultQuery = (parsed.search && parsed.search.trim().length > 0) ? parsed.search : "*";
      this.query = defaultQuery;
  
      // get these from query string too?
      this.page = 0; // e.g. parsed.page
      this.filters = []; // e.g.parsed.filters ?
      // when first loaded - run counts and query?
      this.counts();
      this.search();
  
      // TODO: maybe mixin should not listen for events
      //window.addEventListener('searchSubmitted', this.doSearch);
      
    }
  
    parseQuery(qryString) {
      return qs.parse(qryString);
    }
    
    runCounts() {
      const fetchData = async () => {
        try {
          const { data } = await client.query({
            query: countQuery,
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

    setActive(b = false) {
      this.active = b;
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
      // ?check if active (since called from all searches now?)
      this.query = e.detail;
      //see https://javascriptplayground.com/url-search-params/
      var searchParams = new URLSearchParams(window.location.search);
      searchParams.set("search", e.detail);
      var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      history.pushState(null, '', newRelativePathQuery);
  
      // doesn't seem to know what this. is
      this.counts();
      this.search();
    }  

  }
  
export default Searcher;