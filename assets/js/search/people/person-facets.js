import { LitElement, html, css, TemplateResult } from "lit-element";

// usage: (search must match id of vivo-search on page)
// <vivo-search-person-facets search="person-search"></vivo-search-person-facets>
class PeopleFacets extends LitElement {

    // how to update data ...?
    static get properties() {
      return {
        data: { type: Object },
        selected: { type: Boolean, attribute: true, reflect: true },
        filters: { type: Array },
        search: { type: String, attribute: true }
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
      this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
      this.handleFacetSelected = this.handleFacetSelected.bind(this);
    }
  
    firstUpdated() {
      document.addEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      document.addEventListener('facetSelected', this.handleFacetSelected);
      // NOTE: would need to 'redraw' facets
      // (with 'filters' from search)   
    }
  
    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      document.removeEventListener('facetSelected', this.handleFacetSelected);
    }
  
    handleSearchResultsObtained(e) {
      const data = e.detail;
      this.data = data;
    }

    handleFacetSelected(e) {
      // NOTE: need to skip when not publication
      const facet = e.detail;
      if (facet.checked) {
        this.addFilter(facet);
      } else {
        this.removeFilter(facet);
      }
      //console.log(`looking for ${this.search}`)
      let search = document.querySelector(`[id="${this.search}"]`);
      //console.log(`found search: ${JSON.stringify(search)}`);

      // FIXME: should maybe go back to having navigation
      // send this down, instead of having to pass around
      // between components
      search.setFilters(this.filters);
      search.search();
    }

    addFilter(filter) {
      this.filters.push({"field": filter.field, "value": filter.value});
    }

    removeFilter(filter) {
      this.filters = _.reject(this.filters, function(o) { 
        return (o.field === filter.field && o.value == filter.value); 
      });
    }

    // add searchResultsObtained listener?
    // #person-facets(DOM) set-data --> data ??
    render() { 
      if (!this.data || !this.data.people || !this.selected == true ) {
        return html``
      }

      //console.log("should display some facets now");
      let facets = Array.from(this.querySelectorAll("vivo-search-facets"));

      // data - group by field
      let grouped = _.groupBy(this.data.people.facets, "field");
      facets.map(facet => {
         let key = facet.key;
         let field = facet.field;
         //console.log(`trying to populate ${key}:${field}`);
         //console.log(`data = ${JSON.stringify(grouped[field])}`);
         if (key == "people" && grouped[field]) {
           //console.log(`setting data - ${JSON.stringify(grouped[field])}`);
           facet.setData(grouped[field]);
           facet.setFilters(this.filters);
         }
      });
       
      return html`
          <slot></slot>
        `
    }
  };
  
  customElements.define('vivo-search-person-facets', PeopleFacets);
  