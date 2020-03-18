import { LitElement, html, css } from "lit-element";

class SearchFacet extends LitElement {

  // NOTE: these are properties for display (like count, value)
  static get properties() {
    return {
      category: { type: String },
      field: { type: String },
      label: { type: String },
      value: { type: String },
      count: { type: Number },
      opKey: { type: String },
      tag: { type: String },
      selected: { type: Boolean, attribute: true, reflect: true }
    }
  }

  static get styles() {
    return css`
      :host {
          display: block;
          clear: both;
          text-align: right;
      }
      div {
        display: flex;
        flex-wrap: nowrap;
      }
      div:hover {
        cursor: pointer;
      }
      .label {
        flex-grow: 2;
        flex-basis: 90%;
        padding-right: 0.5em;
      }
      .checkbox {
        flex-grow: 1;
        flex-basis: 10%;
      }
      .checkbox:after {
        content:"◻";
      }          
      div[selected="true"] .checkbox:after {
        content:"✓";
      }  
      div[selected="true"] .label {
        font-weight: bold;
      } 
    `
  }

  constructor() {
    super();
    this.selected = false;
    this.opKey = "EQUALS"; // default or not?
    this.handleFacetSelected = this.handleFacetSelected.bind(this);
  }

  handleFacetSelected(e) {
    // if span clicked - need parent
    let parent = e.target.parentNode;
    this.dispatchEvent(new CustomEvent('facetSelected', {
      detail: { 
        category: this.category,
        field: this.field,
        checked: !this.selected,
        opKey: this.opKey,
        tag: this.tag,
        value: parent.getAttribute("value") 
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }));
  }

  // NOTE: had to do div/span/fake-checkbox instead of real input[type=checkbox]
  // https://stackoverflow.com/questions/55962214/litelement-not-updating-checkbox-in-list
  // https://github.com/Polymer/lit-html/issues/732  
  render() {
    return html`
          <div value=${this.value} 
            selected="${this.selected}"
            @click=${this.handleFacetSelected}
          >
            <span class="label">
              ${this.label} (${this.count})
            </span>
            <span class="checkbox"></span>
          </div>
        `
  }
}

customElements.define('vivo-search-facet', SearchFacet);




