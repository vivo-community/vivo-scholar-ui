import { LitElement, html, css } from "lit-element";

class SearchFacet extends LitElement {

  static get properties() {
    return {
      field: { type: String },
      label: { type: String },
      value: { type: String },
      count: { type: Number }
    }
  }

  static get styles() {
    return css`
      :host {
          display: block;
          clear: both;
      }
      
    `
  }

  constructor() {
    super();
    this.handleFacetSelected = this.handleFacetSelected.bind(this);
  }

  handleFacetSelected(e) {
    this.dispatchEvent(new CustomEvent('facetSelected', {
      detail: { 
        field: this.field,
        checked: e.target.checked, 
        value: e.target.getAttribute("value") 
      },
      bubbles: true,
      cancelable: false,
      composed: true
    }));
  }

  render() {
    return html`
          <label>
            <input 
              type="checkbox"  
              value="${this.value}" 
              @click=${this.handleFacetSelected}>
            ${this.label} (${this.count})
          </label>
        `
  }
}

customElements.define('vivo-search-facet', SearchFacet);




