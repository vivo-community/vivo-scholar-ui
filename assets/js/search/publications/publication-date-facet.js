import { LitElement, html, css } from "lit-element";

class PublicationDateFacet extends LitElement {

  static get properties() {
    return {
      category: { type: String },
      field: { type: String },
      label: { type: String },
      value: { type: String },
      count: { type: Number },
      opKey: { type: String },
      tag: { type: String },
      selected: { type: Boolean, attribute: true, reflect: true },
    }
  }
  
  // NOTE: not making this look like other facets - to demonstrate
  static get styles() {
    return css`
      :host {
          display: block;
          clear: both;
          text-align: right;
      }
      div:hover {
        cursor: pointer;
      }
      div:after {
        content:"◻";
      }          
      div[selected="true"]:after {
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
        opKey: this.opKey,
        tag: this.tag,
        value: e.target.getAttribute("value") 
      },
      bubbles: true,
      cancelable: false,
      composed: true
    }));
  }

  render() {
    let theDate = new Date(this.value);
    // FIXME: need to be able to send in localization
    let display = theDate.toLocaleDateString("en-US");
    return html`
          <div value=${this.value} 
            selected="${this.selected}"
            @click=${this.handleFacetSelected}
          >
            ${display}
          </div>
        `
  }
}

customElements.define('vivo-publication-date-facet', PublicationDateFacet);




