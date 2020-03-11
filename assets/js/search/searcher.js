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

    deriveSearchFromParameters() {     
      let params = new URLSearchParams(window.location.search); 
      
      let search = params.get("search"); 
      const defaultQuery = search ? search : "*";
      
      let page = params.get("page");
      const defaultPage = page ? page : 0;

      // TODO: not sure what to do about list things
      let filters = params.getAll("filters");
      const defaultFilters = (filters.length > 0) ? filters : [];
      // order trickier since it can be overriden by search code
      let orders = params.getAll("orders");
      // NOTE: must have defaultSort defined
      const defaultOrders = (orders.length > 0) ? orders : this.defaultSort;
      return { 
        query: defaultQuery, 
        page: defaultPage,
        filters: defaultFilters,
        orders: defaultOrders
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
      //see https://javascriptplayground.com/url-search-params/
      var searchParams = new URLSearchParams(window.location.search);
      searchParams.set("search", this.query);
      // TODO: set other ones?
      searchParams.set("page", this.page);
      //searchParams.set("filters", this.filters); // how to deal with blank?
      searchParams.delete("orders");

      console.log(this.orders);
      
      if (this.orders.length > 0) {
        for (let order in this.orders) {
          //console.log(JSON.stringify(order));
          console.log(order.property); // undefined
          console.log(order.direction); // undefined
          //searchParams.append("orders", {property: property, direction: direction});
        }
      }
      

      //searchParams.set("orders", this.orders); /// how to deal with [object+Object]
      var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
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