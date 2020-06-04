import { LitElement, html, css } from "lit-element";

import uncamelCase from '../lib/string-helper';

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
      selected: { type: Boolean, attribute: true, reflect: true },
      align: { type: String }
    }
  }

  // https://www.w3schools.com/howto/howto_css_custom_checkbox.asp
  static get styles() {
    return css`
      :host {
        display: block;
        clear: both;
        text-align: right;
      }
      :host([align="left"]) {
        text-align: left;
      }
      div {
        display: flex;
        flex-wrap: nowrap;
      }
      div:hover {
        cursor: pointer;
      }
      .label {
        flex-grow: 1;
        flex-basis: 96%;
        padding-right: 0.5em;
        line-height: 16pt;
        display: inline-block;
      }
      :host([align="left"]) .label {
        flex-grow: unset;
        order: 1;
        margin-left: 8px;
        padding-left: 4px;
      }
      .label.count {
        padding-left: 2px;
      }
      .label::before {
        display: block;
        content: attr(title);
        font-weight: bold;
        height: 0;
        overflow: hidden;
        visibility: hidden;
      }
      .checkbox-container {
        flex-grow: 0;
        flex-basis: 1em;
        display:inline-block;
        position: relative;
      }
      :host[align="left"] .checkbox-container {
        order: 0;
        padding: 8px;
      }
      .checkbox-container input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
      }
      .checkbox-custom {
        position: absolute;
        /* tried different numbers here */
        top: 4px;
        left: 0px;
        /* not sure this should be */
        height: 0.85em;
        width: 0.85em;
        background-color: white;
        border: 1pt solid #2F3D4F;
      }
      .checkbox-container:hover input ~ .checkbox-custom {
        background-color: #ccc;
      }
      .checkbox-container input:checked ~ .checkbox-custom {
        background-color: #2196F3;
      }
      .checkbox-custom:after {
        content: "";
        position: absolute;
        display: none;
      }
      .checkbox-container input:checked ~ .checkbox-custom:after {
        display: block;
      }      
      .checkbox-container .checkbox-custom:after {
        /* had to just find these numbers by trying different ones */
        left: 4px; 
        right: 4px;
        top: 0px;
        width: 2px;
        height: 0.50em;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
      }
      @media screen and (max-width: 1000px) {
        :host {
          text-align: left;
        }
        .label {
          flex-grow: unset;
          line-height: 22pt;
          order: 1;
        }
        .checkbox-container {
          order: 0;
          padding: 8px;
        }
      }
      
    `
  }

  constructor() {
    super();
    this.selected = false;
    this.opKey = "EQUALS"; // default or not?
    this.align = "right"; // css should already default (but not < 1000)
    this.handleFacetSelected = this.handleFacetSelected.bind(this);
  }

  handleFacetSelected(e) {
    // if span clicked - need parent (note had to add 'value' to multiple 'parents')
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
    //add space between certain facet results (ex: "FacultyMember")
    let newLabel = uncamelCase(this.label);
    // NOTE: there is an input tag (that is hidden) - and only used to render check
    // (not interactive like normal checkbox)
    return html`
          <div value=${this.value} 
            selected="${this.selected}"
            @click=${this.handleFacetSelected}
          >
            <span class="label" title="${this.label} (${this.count})">
              ${newLabel}&nbsp;(${this.count})
            </span>
            <!-- NOTE: adding value again so event can do parent.value -->
            <span class="checkbox-container" value=${this.value}>
              <input type="checkbox" ?checked=${this.selected}></input>
              <span class="checkbox-custom"></span>
            </span>
          </div>
        `
  }
}

customElements.define('vivo-search-facet', SearchFacet);




