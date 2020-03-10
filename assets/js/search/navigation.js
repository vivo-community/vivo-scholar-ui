import { LitElement, html, css } from "lit-element";

/*
TODO: maybe make a tabbed-search component
that contains search-text and tabs/searches etc..
and have it take care of the search switching?

then make this *only* hangle navigation
(so search still works without it) like the tab-navigation
on profile
*/
class SearchNavigation extends LitElement {

    constructor() {
      super();
      this.browsingState = {};
      this.navFrom = this.navFrom.bind(this);
      this.navTo = this.navTo.bind(this);
      this.handleSearchSubmitted = this.handleSearchSubmitted.bind(this);
      this.handleTabSelected = this.handleTabSelected.bind(this);
      this.handlePageSelected = this.handlePageSelected.bind(this);
      this.handleSortSelected = this.handleSortSelected.bind(this);
    }
  
    firstUpdated() {
      document.addEventListener('DOMContentLoaded', this.navFrom);
      document.addEventListener('tabSelected', this.handleTabSelected);
      document.addEventListener('searchSubmitted', this.handleSearchSubmitted);
      // NOTE: these are search specific - should maybe be in searcher.js
      // code instead of here
      document.addEventListener('pageSelected', this.handlePageSelected);
      document.addEventListener('sortSelected', this.handleSortSelected);
      // wouldn't this select the first one?
      let defaultSearch = document.querySelector(`[implements="vivo-search"]`);
      //let defaultSearch = document.querySelector('vivo-person-search');
      // 1. then get id
      // 2. then hide all facets except with id
      this.browsingState.activeSearch = defaultSearch;
      defaultSearch.setActive(true);
      
      this.findCorrectFacetsToDisplay();
    }
  
    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener('DOMContentLoaded', this.navFrom);
      document.removeEventListener('tabSelected', this.handleTabSelected);
      document.removeEventListener('searchSubmitted', this.handleSearchSubmitted);
      document.removeEventListener('pageSelected', this.handlePageSelected);
      document.removeEventListener('sortSelected', this.handleSortSelected);
    }
  
    getNextSibling(elem, selector) {
      // Get the next sibling element
      var sibling = elem.nextElementSibling;
    
      // If there's no selector, return the first sibling
      if (!selector) return sibling;
    
      // If the sibling matches our selector, use it
      // If not, jump to the next sibling and continue the loop
      while (sibling) {
        if (sibling.matches(selector)) return sibling;
        sibling = sibling.nextElementSibling
      }
    };
    
    handleTabSelected(e) {
      const tab = e.detail;
      // FIXME: this seems to be called by clicking anywhere on tab panel
      // not sure it's really an error
      if (tab == null) {
        console.error("called handleTabSelected with wrong event");
        return;
      }
      this.browsingState.currentTab = tab.id

      // first de-activate ?
      this.browsingState.activeSearch.setActive(false);

      // search is either active or dormant
      // only one can be active at a time

      // TODO: all searches are in vivo-tab-panels
      // might be better to enable non-tabbed searching 
      let panel = this.getNextSibling(tab, 'vivo-tab-panel');
      let search = panel.querySelector(`[implements="vivo-search"]`);
      this.browsingState.activeSearch = search;

      // only one active search at a time? ...
      search.setActive(true);

      if (search) {
        // NOTE: not re-running 'counts' query so
        // facet count is preserved in tab
        search.search();  
        // add active-search to URL as /people, /publications etc... ?
      } else {
          console.error("could not find search");
      }

      this.findCorrectFacetsToDisplay();
    }
  
    handleSearchSubmitted(e) {
      const search = (e.detail != '') ? e.detail : "*";

      this.browsingState.currentQuery = search;
      let activeSearch = this.browsingState.activeSearch;
  
      // could get active search from route ? e.g.
      // /search/person?query=*
      // /search/publications?query=* etc...
      
      // set the query on all - so if we switch tabs it has
      // the new query to run
      let searches = document.querySelectorAll(`[implements="vivo-search"]`);
      searches.forEach(s => {
        s.setQuery(search);
        s.setPage(0);
      })

      // clear all the 'filters' 
      let facets = document.querySelectorAll('vivo-facet-group');
      facets.forEach(s => {
        s.setFilters([]);
      })

      activeSearch.doSearch(search);

      // FIXME: probably need to reset paging
      this.findCorrectFacetsToDisplay();
    }
  
    // TODO: this feels a little fragile - works/doesn't work
    // depending on precise arrangement on page
    findCorrectFacetsToDisplay() {
      let activeSearch = this.browsingState.activeSearch;
      let id = activeSearch.id;

      let facets = document.querySelectorAll('vivo-facet-group');
      // hiding all
      facets.forEach((t) => t.removeAttribute('selected'));
  
      let facetGroups = document.querySelectorAll(`[search="${id}"]`);
      facetGroups.forEach(group => {
        group.setAttribute('selected', 'selected');
      })
    }
    
    handlePageSelected(e) {
      const page = e.detail;
      this.browsingState.currentPage = page;
      let search = this.browsingState.activeSearch;
      search.setPage(page.value);
      search.search();
    }
  
    handleSortSelected(e) {
      let search = this.browsingState.activeSearch;
      let orders = [e.detail]
      search.setSort(orders);
      // TODO: reset page?
      search.setPage(0);
      search.search();
    }
  
    navTo() {
      const searchParams = new URLSearchParams(this.browsingState);
      window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
      window.location.href = this.browsingState.to;
    }
  
    navFrom() {
      const url = new URL(window.location.href);
      const incomingBrowsingState = {};
      for (let key of url.searchParams.keys()) {
        incomingBrowsingState[key] = url.searchParams.get(key);
      }
      const { currentTab } = incomingBrowsingState;
      if (currentTab) {
        const tabs = this.getTabs();
        if (tabs) {
          tabs.selectTabById(currentTab);
        }
      }
      // TODO: still lots to do to restore page and facet
      // (and facet page) etc... from URL params
    }
  
    getTabs() {
      return document.querySelector('vivo-tabs');
    }
  
  }
  
  customElements.define('vivo-search-navigation', SearchNavigation);
  