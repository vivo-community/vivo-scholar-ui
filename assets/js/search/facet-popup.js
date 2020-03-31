import { LitElement, html, css } from "lit-element";

// needed add, remove filter functions
import Faceter from './faceter.js'
import * as config from './config.js'
import { classMap } from 'lit-html/directives/class-map';

class FacetPopupMessage extends Faceter(LitElement) {

  static get properties() {
    return {
      open: {
        attribute: "open",
        type: Boolean,
        reflect: true
      },
      pageNumber: {
        type: Number
      }
    };
  }

  constructor() {
      super();
      this.handleKeydown = this.handleKeydown.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this.open = false;
      this.filters = [];

      this.classes = { "modal": true, "show-modal": false }

      this.handleFacetSelected = this.handleFacetSelected.bind(this);
  }


  firstUpdated() {
    this._slot = this.shadowRoot.querySelector("slot");
    this._slot.addEventListener('slotchange', this._onSlotChange);
    this.addEventListener("keydown", this.handleKeydown);
    this.addEventListener("pageSelected", this.handleFacetPageSelected);
    this.addEventListener('facetSelected', this.handleFacetSelected);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._slot.removeEventListener('slotchange', this._onSlotChange);
    this.removeEventListener("keydown", this.handleKeydown);
    this.removeEventListener("pageSelected", this.handleFacetPageSelected);
    this.removeEventListener('facetSelected', this.handleFacetSelected);
  }

  handleFacetSelected(e) {
    // NOTE: need to prevent default 'facet clicked' behavior
    e.preventDefault();
    e.stopPropagation();
    let selected = e.detail.checked;
    e.target.selected = selected;
    
    // still need it to be bolded (as if selected)
    const facet = e.detail;
    if (facet.checked) {
      this.addFilter(facet);
    } else {
      this.removeFilter(facet);
    }
  }

  _onSlotChange() {
    // divide into columns?
    this.facets = Array.from(this.querySelectorAll('vivo-search-facet'));
  }

  handleKeydown(e) {
    // TODO: note only seems to work when header on popup has focus
    if (e.keyCode === 27) {
        this.closeDown();
    }
  }

  handleFacetPageSelected(e) {
    // NOTE: need to stop bubbling up to 'navigation' component
    // (only paging facets, not search results)
    e.preventDefault();
    e.stopPropagation();
    let page = e.detail.value;
    this.pageNumber = page;
  }

  openUp() {
    this.open = true;
  }

  apply() {
    this.closeDown(true);
  }

  cancel() {
    this.closeDown(false);
  }

  closeDown(applyFilters=true) {
    this.open = false;

    if (applyFilters) {
      // this should get parent vivo-facet-group
      let group = this.getRootNode().host.parentNode;
      let search = document.querySelector(`[id="${group.search}"]`);
      // need to set filters on group
      group.setFilters(this.filters);
      // then run search
      search.setPage(0);
      search.setFilters(this.filters);
      search.search();
    } else {
      // need to unselect all
      this.facets.forEach((f) => f.removeAttribute('selected'));
      this.setFilters([]);
    }
  
  }

  static get styles() {
    return css`
    vivo-modal([shown]) .fas {
      display: inline-block;
      font-style: normal;
      font-variant: normal;
      text-rendering: auto;
      font-size: 2em;
      display: flex;
      flex-direction: row-reverse;
      -webkit-font-smoothing: antialiased;
    }
    :host([open]) .fa-times::before {
      font-family: 'Font Awesome 5 Free';
      font-weight: 900;
      content: "\\f00d";
    }    
    ::slotted(a) {
      text-decoration: none;
      color: black;
      font-weight: bold;
    }
    ::slotted(vivo-search-facet) {
      display: block;
      width: 200px;
    }
    h4 {
      background-color: var(--highlightBackgroundColor);
      margin-top: 0;
      padding: 0;
      padding-right: 4px;
      text-align: right;
    }
    .facet-container {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      max-height: 200px;
      min-width: 100px;
      max-width: 400px;
      overflow: auto;
      overflow-y: hidden;
      scrollbar-base-color:#ffeaff
    }
    #cancel {
      display: inline-block;
      background-color: var(--mediumNeutralColor);
      color: white;
      padding: 4px;
      font-size: 1.2em;
    }
    #apply {
      display: inline-block;
      background-color: var(--linkColor);
      color: white;
      padding: 4px;
      font-size: 1.2em;
    }
    #cancel:hover {
      cursor: pointer;
    }
    #apply:hover {
      cursor: pointer;
    }
    .actions {
      text-align: center;
    }
    `;
  }

  render() {

    return html`
    <vivo-modal ?shown="${this.open}">
        <h4><i class="fas fa-times" @click=${this.cancel}></i></h4>
        <div class="facet-container">
          <slot></slot>
        </div>
        <div class="actions">
          <a id="cancel" @click=${this.cancel}>Cancel</a>
          <a id="apply" @click=${this.apply}>Apply</a>
        </div>
    </vivo-modal>
    `;
  }
}

customElements.define("vivo-facet-popup-message", FacetPopupMessage);
