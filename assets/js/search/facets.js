import { LitElement, html, css } from "lit-element";

class SearchFacets extends LitElement {

  static get properties() {
    return {
        field: { type: String }, // e.g. researchAreas
        key: { type: String }, // e.g. people
        filters: { type: Array },
        data: { type: Object } //
    }
  }

  constructor() {
    super();
  }

  setData(data) {
    this.data = data;
  }

  setFilters(filters) {
    // FIXME: this gets set over and over again in different components
    this.filters = filters;
  }

  static get styles() {
    return css`
      :host {
          display: block;
      }
      vivo-search-facet[selected=""] {
        font-weight: bold;
      }
    `
  }
  
  inFilters(field, facet) {
    let exists = _.find(this.filters, function(f) { 
      return (f.field == field && f.value == facet.value); 
    });
    if (typeof exists !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  render() {
    if (!this.data) {
      return html``
    }
    // NOTE: it's an array - but only want first
    let content = this.data[0].entries.content;
    
    let facetList = content.map(facet => {
      let selected = this.inFilters(this.field, facet);   
      return html`<vivo-search-facet
        category="${this.key}"
        field="${this.field}"
        ?selected=${selected}
        value="${facet.value}" 
        label="${facet.value}" 
        count="${facet.count}">
        </vivo-search-facet>`
      });
      
      return html`
        <slot></slot>
        ${facetList}
      `
    }
  }
  
  customElements.define('vivo-search-facets', SearchFacets);
  