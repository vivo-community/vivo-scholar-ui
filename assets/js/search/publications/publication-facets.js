import { LitElement, html, css } from "lit-element";

// NOTE: this is not making use of any server data right now
// TODO? use 'selected' attribute to process searchResultsObtained?
class PublicationFacets extends LitElement {

    static get properties() {
      return {
        data: { type: Object },
        selected: { type: Boolean, attribute: true, reflect: true },
        filters: { type: Array }
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
      this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
      this.handleFacetSelected = this.handleFacetSelected.bind(this);

    }
  
    firstUpdated() {
      document.addEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      document.addEventListener('facetSelected', this.handleFacetSelected);

      // NOTE: would need to 'redraw' facets
      // (with 'filters' from search)   
      // could listen for 'searchSubmitted'?
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
      const facet = e.detail;
      if (facet.checked) {
        this.addFilter(facet);
      } else {
        this.removeFilter(facet);
      }
    }

    addFilter(filter) {
      this.filters.push({"field": filter.field, "value": filter.value});
    }

    removeFilter(filter) {
      this.filters = _.reject(this.filters, function(o) { 
        return (o.field === filter.field && o.value == filter.value); 
      });
    }

    inFilters(field, facet) {
      //console.log(`checking if ${JSON.stringify(facet)} should be checked:${field}`)
      let exists = _.find(this.filters, function(f) { 
        //console.log(`${f.field} == ${field} && ${f.value} == ${facet.value}`);
        //console.log(f.field == field && f.value == facet.value);
        return (f.field == field && f.value == facet.value); 
      });
      if (typeof exists !== 'undefined') {
        return true;
      } else {
        return false;
      }
    }

    listFacets(field, entries) {
      let display = entries.content.map(facet => {
        let selected = this.inFilters(field, facet);
        return html`<vivo-search-facet 
          field="${field}"
          ?selected="${selected}"
          value="${facet.value}" 
          label="${facet.value}" 
          count="${facet.count}" />`
      });
      return display;
    };

    render() {
      // TODO: gather facets from search data   
      // NOTE: if search == 'documents' - then could use check for
      // match that way
      if (!this.data || !this.data.documents || !this.selected == true ) {
        return html``
      }       

      // TODO: generic or very specific (e.g. "researchAreas" etc...)
      let display = this.data.documents.facets.map(facet => {
        return html`<h4>${facet.field}</h4>
          ${this.listFacets(facet.field, facet.entries)}
        `
      });
      
      let facets = html`
          ${display}      
      `;
  
      // grouping of facets per vivo-sidebar-item
      return html`
          <vivo-search-facets>
            <h3 slot="heading">Filter Publications</h3>
            <div slot="content">
            ${facets}
            </div>
          </vivo-search-facets>
          `
    }
  };
  
  customElements.define('vivo-search-publication-facets', PublicationFacets);
  