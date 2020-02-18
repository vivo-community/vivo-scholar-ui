import { LitElement, html, css } from "lit-element";

import Faceter from './faceter.js'
class FacetGroup extends Faceter(LitElement) {

    static get properties() {
      return {
        data: { type: Object },
        selected: { type: Boolean, attribute: true, reflect: true },
        filters: { type: Array },
        search: { type: String, attribute: true },
        implements: { type: String, attribute: true, reflect: true },
        key: { type: String }
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
      `
    }
    
    constructor() {
      super();
      this.selected = false;
      this.filters = [];
      this.implements = "vivo-facets";

      this.key = "documents"; // ?

      this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
      this.handleFacetSelected = this.handleFacetSelected.bind(this);
    }
  
    firstUpdated() {
      document.addEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      document.addEventListener('facetSelected', this.handleFacetSelected);
    }
  
    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      document.removeEventListener('facetSelected', this.handleFacetSelected);
    }
  
    handleSearchResultsObtained(e) {
      const data = e.detail;
      if (!data || !data.documents) {
        return;
      }

      this.data = data;
    }

    
    handleFacetSelected(e) {
      // FIXME: every facets implementation has to add this
      // line - and keep track of it's own filters etc...
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
      // search ->?person-search"
      let search = document.querySelector(`[id="${this.search}"]`);
      search.setFilters(this.filters);
      search.search();
    }

    render() {
      if (!this.data || !this.data[this.key] || !this.selected == true ) {
        return html``
      }       

      // 1. get all vivo-search-facet elements ...
      // or [implements=vivo-search-facets]
      let facets = Array.from(this.querySelectorAll(`vivo-search-facets[key="${this.key}"]`));

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
         } else if (key == this.key && !grouped[field]) {
          // NOTE: after a new search, if there are no
          // facets - need to blank out
          facet.setData(null);
          //facet.setFilters(this.filters);
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
  