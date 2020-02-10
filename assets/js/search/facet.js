import { LitElement, html, css } from "lit-element";

class SearchFacet extends LitElement {

  static get properties() {
    return {
      field: { type: String },
      label: { type: String },
      value: { type: String },
      count: { type: Number },
      selected: { type: Boolean }
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

  // TODO: need a way to mark if 'checked' or not
  render() {
    return html`
          <label>
            ${this.label} (${this.count})
            <input 
            type="checkbox"  
            ?checked=${this.selected}
            value=${this.value} 
            @click=${this.handleFacetSelected}>
          </label>
        `
  }
}

customElements.define('vivo-search-facet', SearchFacet);




