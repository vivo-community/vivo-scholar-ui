import { LitElement, html, css } from "lit-element";

// usage: (search must match id of vivo-search on page)
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
    }

    listFacets(field, entries) {
      console.log(field);
      let display = entries.content.map(facet => {
        return html`<vivo-search-facet 
          field="${field}"
          value="${facet.value}" 
          label="${facet.value}" 
          count="${facet.count}" />`
      });
      return display;
    };

    // add searchResultsObtained listener?
    // #person-facets(DOM) set-data --> data ??
    render() { 
      if (!this.data || !this.data.people || !this.selected == true ) {
        return html``
      }

      // TODO: generic or very specific (e.g. "researchAreas" etc...)
      let display = this.data.people.facets.map(facet => {
        return html`<h4>${facet.field}</h4>
          ${this.listFacets(facet.field, facet.entries)}
        `
      });

      let facets = html`
          ${display}      
      `;
       
      return html`
          <vivo-search-facets id="person-facets">
            <h3 slot="heading">Filter People</h3>
            <div slot="content">
            ${facets}
            </div>
          </vivo-search-facets>
          `
    }
  };
  
  customElements.define('vivo-search-person-facets', PeopleFacets);
  