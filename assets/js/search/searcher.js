import qs from "qs";
import _ from "lodash";

import client from "../lib/apollo";
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

    deriveQueryFromParameters() {      
      // FIXME: should a mixin use 'window' at all? seems wrong
      const parsed = this.parseQuery(window.location.search.substring(1));
      const defaultQuery = (parsed.search && parsed.search.trim().length > 0) ? parsed.search : "*";
      return defaultQuery;
    }

    setUp() {
      this.query = this.deriveQueryFromParameters();
      this.page = 0;
      this.filters = [];

      this.counts();
      this.search();
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
      console.log(`trying to run search with filters: ${JSON.stringify(this.filters)}`);
      // TODO: shuld this also send an event?
      // e.g. this.dispatchEvent(new CustomEvent('searchStarted', {
      // so UI can know - might be useful for 'waiting' watcher
      // or to know state of filters etc...
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
  
    pushHistory() {
      //see https://javascriptplayground.com/url-search-params/
      var searchParams = new URLSearchParams(window.location.search);
      searchParams.set("search", this.query);
      var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      history.pushState(null, '', newRelativePathQuery);
    }

    doSearch(e) {
      this.query = e.detail;
      // FIXME: should mixin be adding to history?
      this.pushHistory();
      this.counts();
      this.search();
    }  

  }
  
export default Searcher;