import { LitElement, html, css } from "lit-element";

// NOTE: this is not making use of any server data right now
// TODO? use 'selected' attribute to process searchResultsObtained?
class PublicationFacets extends LitElement {

    static get properties() {
      return {
        data: { type: Object },
        selected: { type: Boolean, attribute: true, reflect: true }
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
    }
  
    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener('searchResultsObtained', this.handleSearchResultsObtained);
    }
  
    handleSearchResultsObtained(e) {
      const data = e.detail;
      this.data = data;
    }

    render() {
      // TODO: gather facets from search data   
      // NOTE: if search == 'documents' - then could use check for
      // match that way
      if (!this.data || !this.data.documents || !this.selected == true ) {
        return html``
      }       
      let fakeFacets = html`
          <h4>Research Areas</h4>
          <vivo-search-facet value="facet1" label="Facet 1" count="10">
          </vivo-search-facet>
          <vivo-search-facet value="facet2" label="Facet 2" count="2">
          </vivo-search-facet>`
  
      // grouping of facets per vivo-sidebar-item
      return html`
          <vivo-search-facets>
            <h3 slot="heading">Filter Publications</h3>
            <div slot="content">
            ${fakeFacets}
            </div>
          </vivo-search-facets>
          `
    }
  };
  
  customElements.define('vivo-search-publication-facets', PublicationFacets);
  