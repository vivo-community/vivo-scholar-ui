import { LitElement, html, css } from "lit-element";

class SearchNavigation extends LitElement {

    constructor() {
      super();
      this.browsingState = {};
      this.navFrom = this.navFrom.bind(this);
      this.navTo = this.navTo.bind(this);
      this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
      this.handleSearchSubmitted = this.handleSearchSubmitted.bind(this);
      this.handleFacetSelected = this.handleFacetSelected.bind(this);
      this.handlePageSelected = this.handlePageSelected.bind(this);
      this.handleTabSelected = this.handleTabSelected.bind(this);
    }
  
    firstUpdated() {
      document.addEventListener('DOMContentLoaded', this.navFrom);
      document.addEventListener('tabSelected', this.handleTabSelected);
      document.addEventListener('searchSubmitted', this.handleSearchSubmitted);
      document.addEventListener('facetSelected', this.handleFacetSelected);
      document.addEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      document.addEventListener('pageSelected', this.handlePageSelected);
      // wouldn't this select the first one?
      let defaultSearch = document.querySelector('vivo-person-search');
      // 1. then get id
      // 2. then hide all facets except with id
      this.browsingState.activeSearch = defaultSearch;
  
      this.findCorrectFacetsToDisplay();
    }
  
    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener('DOMContentLoaded', this.navFrom);
      document.removeEventListener('tabSelected', this.handleTabSelected);
      document.removeEventListener('searchSubmitted', this.handleSearchSubmitted);
      document.removeEventListener('facetSelected', this.handleFacetSelected);
      document.removeEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      document.removeEventListener('pageSelected', this.handlePageSelected);
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
      
      this.browsingState.currentTab = tab.id

      // first de-activate ?
      this.browsingState.activeSearch.setActive(false);

      // TODO: maybe a way to get tab -and the find nearest search
      //let selectedTab = document.querySelector(`#${tab.id}`);
      //let panel = this.getNextSibling(selectedTab, 'vivo-tab-panel');
      
      // NOTE: another fragile setup - by name
      //publication-search-tab to publication-search
      let searchId = tab.id.replace("-tab", "");
      let search = document.querySelector(`#${searchId}`);

      // 1. then get id
      // 2. then hide all facets except with id
      this.browsingState.activeSearch = search;
      // TODO: needs to change the activeSearch ....
      // would be cool to select by type <vivo-search >
      //let activeSearch = this.browsingState.activeSearch;

      // only one active search at a time? ...
      search.setActive(true);

      if (search) {
        search.counts();
        console.log("calling search from navigation->handleTabSelected");
        search.search();  
      } else {
          console.error("could not find search");
      }

      this.findCorrectFacetsToDisplay();
    }
  
    handleSearchSubmitted(e) {
      const search = e.detail;
  
      this.browsingState.currentQuery = search;
      let activeSearch = this.browsingState.activeSearch;
  
      activeSearch.counts();
      console.log("calling search from navigation->handleSearchSubmitted");
      activeSearch.search();
  
      this.findCorrectFacetsToDisplay();
    }
  
    // TODO: this feels a little fragile - works/doesn't work
    // depending on precise arrangement on page
    findCorrectFacetsToDisplay() {
      let activeSearch = this.browsingState.activeSearch;
      // why would this be null?
      let id = activeSearch.id;
      // need to set the remove
      let sidebar = document.querySelector('vivo-sidebar');
      // TODO: should select only with a 'search' attribute
      // let facets = sidebar.querySelectorAll("[search='*']");
      
      // NOTE: vivo-sidebar-item(s) are included, so it's
      // setting too many things now
      //vivo-search-facets
      let facets = sidebar.querySelectorAll("*");
      // how to hide all ()
      facets.forEach((t) => t.removeAttribute('selected'));
  
      // TODO: right now there are multiple matches - would probably
      // just want one group to toggle on/off
      let facetGroups = document.querySelectorAll(`[search="${id}"]`);
      facetGroups.forEach(group => {
        group.setAttribute('selected', 'selected');
      })
    }
  
    // run search again? send back down?
    handleFacetSelected(e) {
      //const facet = e.detail;
      // probably not the thing to to here
      // maybe more like browsingState.add/remove(facet)?
      //this.browsingState.currentFacet = facet;
      //let search = this.browsingState.activeSearch;

      // FIXME: redundant
      //let activeSearch = this.browsingState.activeSearch;
      //let id = activeSearch.id;
      //let search = document.querySelector(`[search="${id}"]`);
      //facet.addFilter(facet);

      /*
      if (facet.checked) {
        search.addFilter(facet);
      } else {
        search.removeFilter(facet);
      }
      */
      // do counts need to be redone?
      //search.counts();
      // let facetGroup = this.browsingState.currentFacetGroup;
      // facetGroup.filters = search.filters;
      //search.search();
    }
  
    handlePageSelected(e) {
      const page = e.detail;
      //console.log(`SearchNavigation:handlePageSelected;page=${page.value}`);
      this.browsingState.currentPage = page;
      let search = this.browsingState.activeSearch;
      // send in new filters, then re-run active search?
      // search.setFilters( -- page --);
      search.setPage(page.value);
      console.log("calling search from navigation->pageSelected");
      search.search();
      // or throw event searchSubmitted?
    }
  
    handleSearchResultsObtained(e) {
      //const data = e.detail;
      //this.browsingState.currentData = data;
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
  
      // if currentFacet ... 
      // if currentResults ...
    }
  
    getTabs() {
      return document.querySelector('vivo-tabs');
    }
  
    // might not make sense to emulate hows tabs work,
    // since facets are a result of search - however they may
    // need to be (re)selected by queryString when returning
    // from link
    getFacets() {
      return document.querySelector('vivo-search-facets');
    }
  
  }
  
  customElements.define('vivo-search-navigation', SearchNavigation);
  