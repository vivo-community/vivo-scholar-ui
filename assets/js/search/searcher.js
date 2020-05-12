import _ from "lodash";

import qs from "qs";
import client from "../lib/apollo";

import * as config from './config.js';

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
    figureDefaultSort(searchStr) {
      if (searchStr === "*") { 
        return this.defaultSort 
      } else { 
        return [{ property: "score", direction: "ASC" }]
      }
    }

    figureOrders(orders, searchStr) {
      // first checking if anything in query parameters
      if (!orders || !orders.length > 0) {
        return this.figureDefaultSort(searchStr);
      }      
      let order = orders[0];
      if (this.sortOptions) { 
        // NOTE: this means all searches need sortOptions defined
        let obj =  _.find(this.sortOptions, { field: order.property, direction: order.direction });
        if (!obj) {
          return this.figureDefaultSort(searchStr);
        } else {
          return orders;
        }
      }
    }

    deriveSearchFromParameters(parsed) {   
      let search = parsed.search;
      let page = parsed.page;
      let filters = parsed.filters;
      let orders = parsed.orders;

      const defaultQuery = search ? search : "*";
      const defaultPage = page ? page : 0;
      const defaultFilters = (filters && filters.length > 0) ? filters : [];
      // NOTE: each search must have defaultSort defined
      const defaultOrders = this.figureOrders(orders, defaultQuery);

      // NOTE: not necessarily 'default' - could be from URL
      this.markSortOptionSelected(defaultOrders[0]);
      const defaultBoosts = this.defaultBoosts;

      let searchTab = parsed["search-tab"];
      if (searchTab === this.id) {
        this.active = true;
      }
      return { 
        query: defaultQuery, 
        page: defaultPage,
        filters: defaultFilters,
        orders: defaultOrders,
        boosts: defaultBoosts
      };
    }

    restoreFromParams(params) {
      const { query, page, filters, orders, boosts } = this.deriveSearchFromParameters(params);
      this.query = query;
      this.orders = orders;
      this.boosts = boosts;

      this.page = page;
      if (typeof filters == 'undefined') {
        this.setFilters([]);
      } else {
        this.setFilters(filters);
      }

      // skip adding to history - would like named parameter here
      // e.g. search(skip_history = true)
      this.search(true);
    }

    // NOTE: these next two functions assume a DOM of some sort (unlike others)
    markSortOptionSelected(selected) {
      let options = this.querySelector('vivo-search-sort-options');
      // NOTE: needs in exact format to match
      options.selected = `${selected.property}-${selected.direction}`;
    }

    findSortOptions() {
      let searchOptions = Array.from(this.querySelectorAll('vivo-search-sort-option'));
      this.sortOptions = searchOptions.map(opt => {
          const field = opt.getAttribute("field");
          const direction = opt.getAttribute("direction");
          return {property: field, direction: direction }
      });
      // then figure defaults...
      let defaults =  searchOptions.filter((opt) => { return opt.default == true; });
      this.defaultSort = defaults.map(opt => {
          const field = opt.getAttribute("field");
          const direction = opt.getAttribute("direction");
          return {property: field, direction: direction }
      });
    }
  
    // TODO: move this out, use i18n-labels somehow?
    setInternationalization() {
      let values = Array.from(this.querySelectorAll('vivo-i18n-label'));
      values.forEach(opt => {
          const key = opt.getAttribute("key");
          const label = opt.getAttribute("label");
          this.i18n[key] = label;
      });
    }

    // allow each search override this way?
    setUp(pageSize = config.PAGE_SIZE) {
      const parsed = qs.parse(window.location.search.substring(1));
      
      // note this has to happen *before* trying to read search parameters
      // so the sort select box can be marked from parameters
      this.sortOptions = [];
      this.findSortOptions();

      // NOTE: this needs to be called in setUp - so #render has values
      this.i18n = {};
      this.setInternationalization();

      const { query, page, filters, orders, boosts } = this.deriveSearchFromParameters(parsed);
      
      this.query = query;
      this.orders = orders;
      this.boosts = boosts;

      if (this.active) {
        this.page = page;
        this.setFilters(filters);
      } else {
        this.page = 0;
        this.setFilters([]);
      }

      // each search *must* define, or default? 
      this.pageSize = pageSize;
      // NOTE: can change this to true to see 'waiting' modal box
      this.simulateDelay = false;
      this.search();
    }
    
    timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    delay(sec, msg) {
      const milliseconds = 2000 * sec; 
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
        console.error(`skipping blank search`);
        const noOp = async () => {
          await this.timeout(1000);
        }
        return noOp();
      }
      
      // need to know when search has started, but before results
      this.dispatchEvent(new CustomEvent('searchStarted', {
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
              orders: this.orders,
              boosts: this.boosts,
              pageSize: this.pageSize
            }
          });
          this.data = data;
        } catch (error) {
          console.error(error);
          throw error;
        }
      };
      // TODO: probably should remove this at some point
      if (this.simulateDelay) {
        return this.wait(2).then(fetchData());
      } else {
        return fetchData();
      }
    }
  
    setFilters(filters = []) {
      // NOTE: if there is a defaultFilters value, must *always* apply
      if (this.defaultFilters) {
        // make filters include default - but leave off if already in list
        this.filters = _.union(filters, this.defaultFilters);
      }
      else {
        this.filters = filters;
      }
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
      // NOTE: if a sort AND a boost are sent, the sort is ignored
      if ((orders.length) > 0 && (orders[0].property != 'score')) {
        this.boosts = [];
      } else {
        this.boosts = this.defaultBoosts;
      }
      this.orders = orders
    }

    resetSort() {
      if (this.query === "*") { 
        this.orders = this.defaultSort 
      } else { 
        this.orders = [{ property: "score", direction: "ASC" }]
      }
    }
  
    search(skip_history=false) {
      // override necessary for 'back' button
      if (this.active && !skip_history) {
        this.pushHistory();
      }
            
      // TODO: maybe add time.now to detail? (to time searches?)
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
      // since there is default sort, always a sort (orders)
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