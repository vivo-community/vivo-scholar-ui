import { LitElement, html, css } from "lit-element";

// NOTE: this is not making use of any server data right now
// usage:
// <vivo-search-person-facets search="person-search"></vivo-search-person-facets>
class PeopleFacets extends LitElement {

    // how to update data ...?
    static get properties() {
      return {
        data: { type: Object },
        selected: { type: Boolean, reflect: true },
        search: { type: String }
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
      this.selected = true;
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
      // check for 'selected'?
    }

    // add searchResultsObtained listener?
    // #person-facets(DOM) set-data --> data ??
    render() { 
      if (!this.data || !this.data.people || !this.selected == true ) {
        return html``
      }
      // TODO: gather facets from search data 
      // AND group 
      // AND only show ones with key match 
      // etc...             
      let fakeFacets = html`
          <h4>Keywords</h4>
          <vivo-search-facet value="facet1" label="Facet 1" count="10">
          </vivo-search-facet>
          <vivo-search-facet value="facet2" label="Facet 2" count="2">
          </vivo-search-facet>
          <h4>Research Areas</h4>
          <vivo-search-facet value="facet1" label="Facet 1" count="15">
          </vivo-search-facet>
          <vivo-search-facet value="facet2" label="Facet 2" count="6">
          </vivo-search-facet>          
          `
       
      return html`
          <vivo-search-facets id="person-facets">
            <h3 slot="heading">Filter People</h3>
            <div slot="content">
            ${fakeFacets}
            </div>
          </vivo-search-facets>
          `
    }
  };
  
  customElements.define('vivo-search-person-facets', PeopleFacets);
  