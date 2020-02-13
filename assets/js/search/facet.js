import { LitElement, html, css } from "lit-element";

class SearchFacet extends LitElement {

  static get properties() {
    return {
      category: { type: String },
      field: { type: String },
      label: { type: String },
      value: { type: String },
      count: { type: Number },
      selected: { type: Boolean, attribute: true, reflect: true }
    }
  }

  static get styles() {
    return css`
      :host {
          display: block;
          clear: both;
      }
      div:hover {
        cursor: pointer;
      }
      div:before {
        content:"◻";
      }          
      div[selected="true"]:before {
        content:"✓";
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
        category: this.category,
        field: this.field,
        checked: !this.selected,
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
    return html`
          <div value=${this.value} 
            selected="${this.selected}"
            @click=${this.handleFacetSelected}
          >
            ${this.label} (${this.count})
          </div>
        `
  }
}

customElements.define('vivo-search-facet', SearchFacet);




