import _ from "lodash";

import qs from "qs";
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

    deriveSearchFromParameters() {   
      const parsed = qs.parse(window.location.search.substring(1));
      let search = parsed.search;
      let page = parsed.page;
      let filters = parsed.filters;
      let orders = parsed.orders;
      let tab = parsed.tab;

      const defaultQuery = search ? search : "*";
      const defaultPage = page ? page : 0;
      const defaultFilters = (filters && filters.length > 0) ? filters : [];
      // NOTE: each search must have defaultSort defined
      const defaultOrders = (orders && orders.length > 0) ? orders : this.defaultSort;

      return { 
        query: defaultQuery, 
        page: defaultPage,
        filters: defaultFilters,
        orders: defaultOrders,
      };
    }

    setUp() {
      const { query, page, filters, orders } = this.deriveSearchFromParameters();
      this.query = query;
      this.page = page;
      this.filters = filters;
      this.orders = orders;

      this.pushHistory();
      this.counts();
      this.search();
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
      this.dispatchEvent(new CustomEvent('searchStarted', {
        detail: { time: Date(Date.now()) },
        bubbles: true,
        cancelable: false,
        composed: true
      }));
      // so UI can know - might be useful for 'waiting' watcher
      // or to know state of filters etc...
      const fetchData = async () => {
        try {

          const { data } = await client.query({
            query: this.graphql,
            variables: {
              pageNumber: this.page,
              search: this.query,
              filters: this.filters,
              orders: this.orders
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

    setSort(orders = []) {
      this.orders = orders
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
      this.pushHistory();
      // TODO: maybe add time.now to detail?
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
  
    pushHistory() {;      
      // NOTE: couldn't get this to work - defaulted back to qs
      //see https://javascriptplayground.com/url-search-params/
      let compound = {
        search: this.query,
        page: this.page
      }
      // since there is default search, always a search
      if (this.orders && this.orders.length > 0) {
        compound["orders"] = this.orders;
      }
      // not always filters though
      if (this.filters && this.filters.length > 0) {
        compound["filters"] = this.filters;
      }

      // e.g. "person-search"
      if (this.id) {
        compound["search-tab"] = this.id;
      }

      var newRelativePathQuery = window.location.pathname + '?' + qs.stringify(compound);
      history.pushState(null, '', newRelativePathQuery);
    }

    // NOTE: only called by handleSearchSubmitted in navigation.js
    doSearch(query) {
      // assumes not blank string (checked already)
      this.query = query;
      this.counts();
      this.search();
    }  

  }
  
export default Searcher;