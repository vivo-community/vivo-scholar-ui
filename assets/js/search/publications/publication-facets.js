import { LitElement, html, css } from "lit-element";

// NOTE: this is not making use of any server data right now
// TODO? use 'selected' attribute to process searchResultsObtained?
class PublicationFacets extends LitElement {

    static get properties() {
      return {
        data: { type: Object },
        selected: { type: Boolean, attribute: true, reflect: true },
        filters: { type: Array },
        search: { type: String, attribute: true } // match up to DOM id on page
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
      if (!(e.detail.category == 'documents')) {
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
      //console.log(`found search: ${JSON.stringify(search)}`);
      //console.log(`settings filters in pub-facets: ${JSON.stringify(this.filters)}`);
      search.setFilters(this.filters);
      //console.log("calling search from publication-facets");
      search.search();
    }

    addFilter(filter) {
      //console.log(`adding ${JSON.stringify(filter)}`);
      this.filters.push({"field": filter.field, "value": filter.value});
    }

    removeFilter(filter) {
      //console.log(`removing ${JSON.stringify(filter)}`);
      this.filters = _.reject(this.filters, function(o) { 
        return (o.field === filter.field && o.value == filter.value); 
      });
    }

    render() {
      // TODO: gather facets from search data   
      // NOTE: if search == 'documents' - then could use check for
      // match that way
      if (!this.data || !this.data.documents || !this.selected == true ) {
        return html``
      }       

      // 1. get all vivo-search-facet elements ...
      // (how to limit to publications?)
      //<vivo-search-facets key="documents" field="publisher"></vivo-search-facets>
      let facets = Array.from(this.querySelectorAll('vivo-search-facets[key="documents"]'));

      // data - group by field
      let grouped = _.groupBy(this.data.documents.facets, "field");

      // 2. for each vivo-search-facet element, get key and field
      // and assign data (+ filters)
      facets.map(facet => {
         let key = facet.key;
         let field = facet.field;
         //console.log(`trying to populate ${key}:${field}`);
         //console.log(`data = ${JSON.stringify(grouped[field])}`);
         if (key == "documents" && grouped[field]) {
           facet.setData(grouped[field]);
           facet.setFilters(this.filters);
         }
      });
  
      // grouping of facets per vivo-sidebar-item
      return html`
         <slot></slot>
      `
    }
  };
  
  customElements.define('vivo-search-publication-facets', PublicationFacets);
  