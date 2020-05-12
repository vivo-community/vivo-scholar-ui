import { LitElement, html, css } from "lit-element";
import qs from "qs";
import _ from "lodash";

class SearchCoordinator extends LitElement {

  constructor() {
    super();
    this.browsingState = {}; // maybe rename to searchStructure
    this.handleSearchSubmitted = this.handleSearchSubmitted.bind(this);
    this.handleTabSelected = this.handleTabSelected.bind(this);
    this.handlePageSelected = this.handlePageSelected.bind(this);
    this.handleSortSelected = this.handleSortSelected.bind(this);
    this.handleRemoveFilters = this.handleRemoveFilters.bind(this);
    this.handleSearchSearchStarted = this.handleSearchStarted.bind(this);
    this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
    this.handleSearchPopState = this.handleSearchPopState.bind(this);

    this.handleToggleFilters = this.handleToggleFilters.bind(this);

    this.i18n = {};
  }

  firstUpdated() {
    this.addEventListener('tabSelected', this.handleTabSelected);
    this.addEventListener('searchSubmitted', this.handleSearchSubmitted);
    this.addEventListener('pageSelected', this.handlePageSelected);
    this.addEventListener('sortSelected', this.handleSortSelected);
    this.addEventListener('removeFilters', this.handleRemoveFilters);
    this.addEventListener('searchStarted', this.handleSearchStarted);
    this.addEventListener('searchResultsObtained', this.handleSearchResultsObtained);
    this.addEventListener('toggleFilters', this.handleToggleFilters);

    window.addEventListener('popstate', this.handleSearchPopState);

    // make search-box show text of search sent in (from home page)
    // NOTE: this is *not* a child element of this tag
    let searchBox = document.querySelector(`vivo-site-search-box`);
    // parse all other params here?
    const params = qs.parse(window.location.search.substring(1));
    let search = params.search;
    const defaultQuery = search ? search : "*";

    searchBox.query = defaultQuery;

    let searchTab = params["search-tab"];
    let matchedSearch = this.querySelector(`#${searchTab}`);
    if (matchedSearch) {
      matchedSearch.setActive(true);
      this.browsingState.activeSearch = matchedSearch;
      const tabs = this.getMainTabs();
      if (tabs) {
        // NOTE: naming convention is a little fragile - could find
        // parent parent, sibling etc... 
        tabs.selectTabById(`${searchTab}-tab`);
      }
    } else {
      let defaultSearch = this.querySelector(`[implements="vivo-search"]`);
      defaultSearch.setActive(true);
      this.browsingState.activeSearch = defaultSearch;
    }
    // NOTE: which facets to display depends on active search  
    this.findCorrectFacetsToDisplay(params.filters);

    this.setInternationalization();
  }

  getMainTabs() {
    return this.querySelector('vivo-tabs');
  }

  setInternationalization() {
    let values = Array.from(this.querySelectorAll('vivo-i18n-label'));
    values.forEach(opt => {
        const key = opt.getAttribute("key");
        const label = opt.getAttribute("label");
        this.i18n[key] = label;
    });
  }

  getLabel(key) {
    // TODO: what if no match?
    return this.i18n[key] || '**i18n key not found**';
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('tabSelected', this.handleTabSelected);
    this.removeEventListener('searchSubmitted', this.handleSearchSubmitted);
    this.removeEventListener('pageSelected', this.handlePageSelected);
    this.removeEventListener('sortSelected', this.handleSortSelected);
    this.removeEventListener('removeFilters', this.handleRemoveFilters);
    this.removeEventListener('searchStarted', this.handleSearchStarted);
    this.removeEventListener('searchResultsObtained', this.handleSearchResultsObtained);

    this.removeEventListener('toggleFilters', this.handleToggleFilters);
    window.removeEventListener('popstate', this.handleSearchPopState);
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

  handleRemoveFilters(e) {
    let search = this.browsingState.activeSearch;
    let id = search.id;
    // 1. remove from active search
    search.setFilters([]);
    // 2. remove from facet group
    let facets = this.querySelectorAll(`[search="${id}"]`);
    facets.forEach(facet => {
      facet.setFilters([]);
    })
    // 3. run search again
    search.search();
  }

  handleTabSelected(e) {
    const tab = e.detail;
    // NOTE: event called by clicking anywhere on tab panel
    // so ignoring (not error)
    if (tab == null) {
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

    // TODO: may need to clear out filters and orders from URL when switching tabs
    if (search) {
      search.search();
      // TODO: add active-search to URL as /people, /publications etc... ?
    } else {
      console.error("could not find search");
    }

    // TODO: not sure how to reset 'orders' when switching tab
    // (in URL)
    this.findCorrectFacetsToDisplay();
  }

  handleSearchSubmitted(e) {
    const search = (e.detail != '') ? e.detail : "*";

    this.browsingState.currentQuery = search;
    // set the query on all - so if we switch tabs it has the new query to run
    let searches = this.querySelectorAll(`[implements="vivo-search"]`);

    searches.forEach(s => {
      s.setQuery(search);
      s.setPage(0);
      s.resetSort();
      // just run each search to get the counts
      // (this includes 'active' search)
      s.search();
    })

    // clear all the 'filters' 
    let facets = this.querySelectorAll('vivo-facet-group');
    facets.forEach(s => {
      s.setFilters([]);
    })

    this.findCorrectFacetsToDisplay();
  }

  handleSearchStarted(e) {
    let modal = this.querySelector('#search-waiting');
    modal.shown = true;
  }

  handleSearchResultsObtained(e) {
    let modal = this.querySelector('#search-waiting');
    modal.shown = false;
  }

  findCorrectFacetsToDisplay(filters = null) {
    let activeSearch = this.browsingState.activeSearch;
    let id = activeSearch.id;

    let facets = this.querySelectorAll('vivo-facet-group');
    // hiding all
    facets.forEach((t) => t.removeAttribute('selected'));

    // should this really be multiple?
    let facetGroups = this.querySelectorAll(`[search="${id}"]`);
    facetGroups.forEach(group => {
      group.setAttribute('selected', 'selected');
      if (filters && filters.length > 0) {
        group.setFilters(filters);
      } else if (filters && filters.length == 0) {
        group.setFilters([]);
      } else {
        // no filters sent in
      }
    })
  }

  // only for smaller/mobile version
  handleToggleFilters(e) {
    // e.detail = {show: (true|false)};
    let show = e.detail.show;
    // note: choosing tab should mark as 'selected' 
    let facetGroups = this.querySelectorAll('vivo-facet-group[selected]');

    let searchTabs = this.getMainTabs();

    // TODO: try to hide header and sub-header ?
    // also, maybe use attribute/properties over inline style
    facetGroups.forEach(group => {
      if (show) {
        searchTabs.style.display = 'none';
        group.style.display = 'block';
      } else {
        searchTabs.style.display = 'block';
        group.style.display = 'none';
      }
    });
  }

  // maybe move this and sort to be handled by individual search
  // (maybe in searcher.js file)
  handlePageSelected(e) {
    let search = this.browsingState.activeSearch;
    const page = e.detail;
    this.browsingState.currentPage = page;
    search.setPage(page.value);
    search.search();
  }

  handleSortSelected(e) {
    let search = this.browsingState.activeSearch;
    let orders = [e.detail]
    search.setSort(orders);
    search.setPage(0);
    search.search();
  }

  handleSearchPopState(e) {
    const params = qs.parse(window.location.search.substring(1));

    let searchTab = params["search-tab"];
    let matchedSearch = this.querySelector(`#${searchTab}`);
    if (matchedSearch) {
      this.browsingState.activeSearch = matchedSearch;
    } else {
      // first one??
      let defaultSearch = this.querySelector(`[implements="vivo-search"]`);
      this.browsingState.activeSearch = defaultSearch;
    }
    let search = this.browsingState.activeSearch;
    search.setActive(true);

    search.restoreFromParams(params);
    // NOTE: which facets to display depends on active search 
    // seems to be correct filters 
    let filters = params.filters ? params.filters : [];
    this.findCorrectFacetsToDisplay(filters);

    const tabs = this.getMainTabs();
    if (searchTab) {
      tabs.selectTabById(`${searchTab}-tab`, false);
    } else {
      // FIXME: best way to restore first search? e.g. search/?search=*
      tabs.selectTabById(`${search.id}-tab`, false);
    }
  }


  render() {
    return html`<slot></slot>`
  }

}

customElements.define('vivo-search-coordinator', SearchCoordinator);
