import { LitElement, html, css } from "lit-element";
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
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
        line-height: 16pt;
        display: inline-block;
      }
      .label::before {
        display: block;
        content: attr(title);
        font-weight: bold;
        height: 0;
        overflow: hidden;
        visibility: hidden;
      }
      .checkbox {
        background-color: white;
        border: 1pt solid #2F3D4F;
        border: none;
        height: 1em;
        line-height: 16pt;
        font-size: 14pt;
        /* padding-bottom: 2px; */
        text-align: center;
        justify-content: center;
        background: transparent;
      }
      .checkbox {
        flex-grow: 1;
        flex-basis: 10%;
      }
      .checkbox:after {
        /* content:"◻"; */
      }  
      div[selected="true"] .checkbox {
        /*
        background-color: #26A8DF;
        color: white;
        */
        border: 1pt solid #2F3D4F; 
        border: none;     
      }        
      div[selected="true"] .checkbox:after {
        text-align: center;
        /* content:"✓"; */
      }  
      div[selected="true"] .label {
        /* already bolded by facets.js */
        /* font-weight: bold */
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

  // ballot-box: &#x2610;
  // ballot-box-with-check: &#9745;
  // NOTE: had to do div/span/fake-checkbox instead of real input[type=checkbox]
  // https://stackoverflow.com/questions/55962214/litelement-not-updating-checkbox-in-list
  // https://github.com/Polymer/lit-html/issues/732  
  render() {
    //let textCheck = this.selected ? '&check;' : '';
    let textCheck = this.selected ? '&#9745;' : '&#x2610;';
    return html`
          <div value=${this.value} 
            selected="${this.selected}"
            @click=${this.handleFacetSelected}
          >
            <span class="label" title="${this.label} (${this.count}))">
              ${this.label} (${this.count})
            </span>
            <span class="checkbox">${unsafeHTML(textCheck)}</span>
          </div>
        `
  }
}

customElements.define('vivo-search-facet', SearchFacet);




