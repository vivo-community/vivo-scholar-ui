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
      this.handleSearchSubmitted = this.handleSearchSubmitted.bind(this);
    }
  
    firstUpdated() {
      document.addEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      document.addEventListener('facetSelected', this.handleFacetSelected);
      document.addEventListener('searchSubmitted', this.handleSearchSubmitted);
    }
  
    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      document.removeEventListener('facetSelected', this.handleFacetSelected);
      document.removeEventListener('searchSubmitted', this.handleSearchSubmitted);
    }
  
    handleSearchResultsObtained(e) {
      const data = e.detail;
      // FIXME: another thing to remember
      if (!data || !data.people) {
        return;
      }
      this.data = data;
    }

    handleSearchSubmitted(e) {
      // clear filters here?
      this.filters = [];
    }

    handleFacetSelected(e) {
      // FIXME: too much boilerplate per facet implementation
      // if facet selected for publication - don't want
      // to add filters, run search
      // in facet might want to empty filters
      if (!(e.detail.category == 'people')) {
        return;
      }
      const facet = e.detail;
      if (facet.checked) {
        this.addFilter(facet);
      } else {
        this.removeFilter(facet);
      }
      let search = document.querySelector(`[id="${this.search}"]`);

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
      let facets = Array.from(this.querySelectorAll('vivo-search-facets[key="people"]'));

      // data - group by field
      let grouped = _.groupBy(this.data.people.facets, "field");
      facets.map(facet => {
         let key = facet.key;
         let field = facet.field;
         if (key == "people" && grouped[field]) {
           facet.setData(grouped[field]);
           facet.setFilters(this.filters);
         } else if (key == "people" && !grouped[field]) {
           // NOTE: after a new search, if there are no
           // facets - need to blank out
           facet.setData(null);
           facet.setFilters(this.filters);
         }
      });
       
      return html`
          <slot></slot>
        `
    }
  };
  
  customElements.define('vivo-search-person-facets', PeopleFacets);
  