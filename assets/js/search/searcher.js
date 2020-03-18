import _ from "lodash";

import qs from "qs";
import client from "../lib/apollo";

// NOTE: one way to do this, not the only way
// http://exploringjs.com/es6/ch_classes.html
// http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
let Searcher = (superclass) => class extends superclass {

   static get properties() {
     return {
        data: { type: Object },
        countData: { type: Object },
        active: { type: Boolean },
        waiting: { type: Boolean },
        simulateDelay: { type: Boolean }
      }
    }


    // NOTE: if search is restored from URL - and then
    // the tab is selected the sort parameter carries over
    // (but does not match any sort) - so needs to go to default
    // on the other hand, if a sort *is* selected on the tab
    // then it should persist whilst switching tabs
    // this little bit is trying to mitigate that 
    figureOrders(orders) {
      let order = orders[0];
      if (this.sortOptions) { 
        let obj =  _.find(this.sortOptions, { field: order.property, direction: order.direction });
        if (!obj) {
           return this.defaultSort;
        } else {
          return orders;
        }
      }
    }

    deriveSearchFromParameters() {   
      const parsed = qs.parse(window.location.search.substring(1));
      let search = parsed.search;
      let page = parsed.page;
      let filters = parsed.filters;
      let orders = parsed.orders;

      const defaultQuery = search ? search : "*";
      const defaultPage = page ? page : 0;
      const defaultFilters = (filters && filters.length > 0) ? filters : [];
      // NOTE: each search must have defaultSort defined
      const defaultOrders = (orders && orders.length > 0) ? this.figureOrders(orders) : this.defaultSort;

      // NOTE: playing whack-a-mole a bit trying to set this property
      // and others (either in navigation.js, searcher.js or person-search.js)
      let searchTab = parsed["search-tab"];
      if (searchTab === this.id) {
        this.active = true;
      }
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
      this.orders = orders;

      if (this.active) {
        this.page = page;
        this.filters = filters;
      } else {
        this.page = 0;
        this.filters = [];
      }

      // NOTE: can change this to true to see 'waiting' modal box
      this.simulateDelay = false;
      this.search();
    }
    
    timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    delay(sec, msg) {
      const milliseconds = 1000 * sec; 
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(msg);
        }, milliseconds);
      });
    }

    async wait(sec) {
      var x = await this.delay(sec, "done waiting");
    }

    runSearch() {
      // FIXME: this is just a hack to avoid error
      // don't know why the error is happening in first place
      //
      // Basic problem is sometimes it's calling GraphQL
      // with no 'query' set (and it's a required parameter)
      // so far cannot trace why it's being called, or
      // why the 'query' would ever be null
      if (!this.query) {
        const noOp = async () => {
          await this.timeout(1000);
        }
        return noOp();
      }
      
      // so UI can know - might be useful for 'waiting' watcher
      // or to know state of filters etc...
      this.dispatchEvent(new CustomEvent('searchStarted', {
        // not crazy about this 'context'
        detail: { time: Date(Date.now()) },
        bubbles: true,
        cancelable: false,
        composed: true
      }));

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
      // NOTE: to simulate delay change to this
      if (this.simulateDelay) {
        return this.wait(2).then(fetchData());
      } else {
        return fetchData();
      }
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
  
    search() {
      if (this.active) {
        this.pushHistory();
      }
            
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
  
    // should only be called if it's the 'active' search
    pushHistory() {   
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

  }
  
export default Searcher;