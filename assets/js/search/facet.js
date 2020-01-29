import { LitElement, html, css } from "lit-element";

class SearchFacet extends LitElement {

  static get properties() {
    return {
      label: { type: String },
      value: { type: String }
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
    // if checked == true + add
    // if checked == false - remove
    // getAttribute("value") is returning facet1
    // needs to add/remove filter and re-run search ...
    this.dispatchEvent(new CustomEvent('facetSelected', {
      detail: { checked: e.target.checked, value: e.target.getAttribute("value") },
      bubbles: true,
      cancelable: false,
      composed: true
    }));
  }

  render() {
    return html`
          <label>
            <input type="checkbox" value="${this.value}" @click=${this.handleFacetSelected}>
            ${this.label}
          </label>
        `
  }
}

customElements.define('vivo-search-facet', SearchFacet);




