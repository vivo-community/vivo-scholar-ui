import { LitElement, html, css } from "lit-element";

class SearchFacets extends LitElement {

    static get properties() {
      return {
        // which search 'attached' to
        search: { type: String },
        data: { type: Object }
      }
    }
  
    static get styles() {
      return css`
        :host {
            display: block;
        }
        
      `
    }
  
    constructor() {
      super();
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
    
    // for filter in filters -> <vivo-search-facet />
    render() {
      // grouping of facets per vivo-sidebar-item
      // TODO: not crazy about pass-through slots with same exact name
      return html`
          <vivo-sidebar-item>
            <div slot="heading">
              <slot name="heading"/>
            </div>
            <div slot="content">
              <slot name="content"/>
            </div>
          </vivo-sidebar-item>
          `
    }
  }
  
  customElements.define('vivo-search-facets', SearchFacets);
  