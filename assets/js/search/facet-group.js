import { LitElement, html, css } from "lit-element";

// needed add, remove Filter functions
import Faceter from './faceter.js'

class FacetGroup extends Faceter(LitElement) {

    static get properties() {
      return {
        search: { type: String, attribute: true },
        key: { type: String },
        waiting: { type: Boolean }
      }
    }
    
    static get styles() {
      return css`
      :host { 
        display: none;
      }
      :host([selected]) {
        display: block;
      }
      ::slotted(h3) {
        text-align: right;
        font-size: 1.2em;
      }
      ::slotted(vivo-search-facets) {
        text-align: right;
      }
      `
    }
    
    constructor() {
      super();
      this.selected = false;
      // way to get this from URL?
      this.filters = [];
      this.waiting = false;

      this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
      this.handleFacetSelected = this.handleFacetSelected.bind(this);
      this.handleSearchStarted = this.handleSearchStarted.bind(this);
    }
  
    firstUpdated() {
      document.addEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      document.addEventListener('facetSelected', this.handleFacetSelected);
      document.addEventListener('searchStarted', this.handleSearchStarted);
    }
  
    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      document.removeEventListener('facetSelected', this.handleFacetSelected);
      document.removeEventListener('searchStarted', this.handleSearchStarted);
    }
  
    handleSearchStarted(e) {
      this.waiting = true;
    }

    removeNotApplicable() {
      let grouped = _.groupBy(this.data[this.key].facets, "field");

      // little wasteful
      let allFacets = document.querySelectorAll(`vivo-search-facets, [implements="vivo-search-facets"]`);
      let groupedFacets = _.groupBy(allFacets, "key");
      let groupedFacets2 = _.groupBy(groupedFacets[this.key], "field");
      //let searches = document.querySelectorAll(`[implements="vivo-search"]`);

      // 2. find each vivo-facet (or implements vivo-facet) by this field
      // 3. run it's "removeFiltersNoLongerApplicable .... method"
      // 4. which would default to just same as below

      // NOTE: this removes filters from constructed
      // search if they are no longer in search results
      //
      // This would happen if another facet has been applied and
      // narrowed the overall results
      this.filters.map(filter => {
        let facet = groupedFacets2[filter.field][0];
        // first check if we even have any matches (avoid error)
        if (grouped[filter.field]) {
          let entries = grouped[filter.field][0].entries;
          let content = entries.content;
          let values = facet.getValuesFromContent(content);
          //let values = this.getValuesFromContent(content);
          // remove cause no longer in search results
          if (!_.includes(values, filter.value)) {
            // FIXME: this assumes data from facet query is same
            // if facet.type = 'date-compare' ->
            // else
            // 
            /*
            Array(7) [ 
                "2017-01-01T00:00:00Z", "2019-01-01T00:00:00Z", "2018-01-01T00:00:00Z", 
                "2016-01-01T00:00:00Z", "2015-01-01T00:00:00Z", "2014-01-01T00:00:00Z", 
                "2005-01-01T00:00:00Z" ]
            // value [2016 TO 2021] not in array
            removing {"field":"publicationDate","value":"[2016 TO 2021]",
            "opKey":"BETWEEN","tag":"publicationDate"}
            */
            this.removeFilter(filter);
          }
        }
      });

    }

    handleSearchResultsObtained(e) {
      this.waiting = false;
      const data = e.detail;
      if (!data || !data[this.key]) {
        return;
      }
      this.data = data;
      this.removeNotApplicable();
    }
    /*
    handleSearchResultsObtained(e) {
      this.waiting = false;
      const data = e.detail;
      if (!data || !data[this.key]) {
        return;
      }
      this.data = data;
      let grouped = _.groupBy(this.data[this.key].facets, "field");

      // NOTE: this removes filters from constructed
      // search if they are no longer in search results
      //
      // This would happen if another facet has been applied and
      // narrowed the overall results
      this.filters.map(filter => {
        // first check if we even have any matches (avoid error)
        if (grouped[filter.field]) {
          let entries = grouped[filter.field][0].entries;
          let content = entries.content;
          let values = content.map(v => v.value);
          // remove cause no longer in search results
          if (!_.includes(values, filter.value)) {
            this.removeFilter(filter);
          }
        }
      });
    }
    */

    handleFacetSelected(e) {
      // ?? how to remove filters
      if (!(e.detail.category == this.key)) {
        return;
      }
      if (!this.selected == true ) {
        return;
      } 
      const facet = e.detail;
      if (facet.checked) {
        this.addFilter(facet);
      } else {

        this.removeFilter(facet);
      }
      let search = document.querySelector(`[id="${this.search}"]`);

      search.setPage(0);
      // TODO: should it also remove filters no longer relevant?
      search.setFilters(this.filters);
      search.search();
    }

    render() {
      if (this.waiting == true) {
        return html``
      }
      if (!this.data || !this.data[this.key] || !this.selected == true ) {
        return html``
      }       

      // 1. get all vivo-search-facet elements or [implements=vivo-search-facets]
      let cssQuery = `vivo-search-facets[key="${this.key}"],[implements="vivo-search-facets"]`
      let facets = Array.from(this.querySelectorAll(cssQuery));

      // data - group by field
      let grouped = _.groupBy(this.data[this.key].facets, "field");

      // 2. for each vivo-search-facet element, get key and field
      // and assign data (+ filters)
      facets.map(facet => {
         let key = facet.key;
         let field = facet.field;
         if (key == this.key && grouped[field]) {
           facet.setData(grouped[field]);
           facet.setFilters(this.filters);
           // facet.setKey(this.key); do this? not sure
         } else if (key == this.key && !grouped[field]) {
          // NOTE: after a new search, if there are no
          // facets - need to blank out
          facet.setData(null);
          //facet.setSelected(false);
          // TODO: nothing seems to be emptying out filters
          // when tab changes
          facet.setFilters([]);
        }
      });
  
      // grouping of facets per vivo-sidebar-item
      return html`
         <slot></slot>
      `
    }
  };
  
  
customElements.define('vivo-facet-group', FacetGroup);
  