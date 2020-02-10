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
    }
  
    firstUpdated() {
      document.addEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      // NOTE: would need to 'redraw' facets
      // (with 'filters' from search)   
      // could listen for 'searchSubmitted'?
    }
  
    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener('searchResultsObtained', this.handleSearchResultsObtained);
    }
  
    handleSearchResultsObtained(e) {
      const data = e.detail;
      this.data = data;
    }

    // not to be confused with facet group (people) being selected
    isFacetChecked(facet) { 
      // need list of filters - then to check whether in list
      return false;
    }

    listFacets(field, entries) {
      let display = entries.content.map(facet => {
        return html`<vivo-search-facet 
          field="${field}"
          ?selected="${this.isFacetChecked(facet)}"
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
  