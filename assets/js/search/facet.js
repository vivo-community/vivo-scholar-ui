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
    this.selected = false;
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
  // https://stackoverflow.com/questions/55962214/litelement-not-updating-checkbox-in-list
  // https://github.com/Polymer/lit-html/issues/732  
  render() {
    console.log(`${this.label} - selected:${this.selected}`);
    return html`
          <label for="${this.field}_${this.value}">
            ${this.label} (${this.count})
          </label>
          <input 
            id="${this.field}_${this.value}"
            type="checkbox"  
            ?checked="${this.selected}"
            name=${this.field}
            value=${this.value} 
            @click=${this.handleFacetSelected}>
          </input>
          
        `
  }
}

customElements.define('vivo-search-facet', SearchFacet);




