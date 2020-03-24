import { LitElement, html, css } from "lit-element";

// needed add, remove filter functions
import Faceter from './faceter.js'
import * as config from './config.js'

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
      this.pageNumber = 0;
      this.pageBy = config.FACET_PAGE_SIZE;
      this.pageGrouping = config.FACET_PAGE_GROUPING;
      this.open =false;
      this.filters = [];

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
    this.facets = Array.from(this.querySelectorAll('vivo-search-facet'));
  }

  handleKeydown(e) {
    // TODO: note only seems to work when header on popup has focus
    if (e.keyCode === 27) {
        this.closeDown();
    }
  }

  showHideFacet(index) {
    let start = (this.pageNumber * this.pageBy);
    let end = (this.pageNumber * this.pageBy) + this.pageBy;
    let inRange = (index >= start && index < end);
    return !inRange;
  }

  showHideFacets() {
    this.facets.forEach((facet, index) => {
      let hide = this.showHideFacet(index);
      if (hide) {
          facet.className = "hidden";
      } else {
          facet.className = "shown";
      }
    });
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

  closeDown() {
    this.open = false;
    // this should get parent vivo-facet-group
    let group = this.getRootNode().host.parentNode;
    let search = document.querySelector(`[id="${group.search}"]`);

    // need to set filters on group
    group.setFilters(this.filters);

    // then run search
    search.setPage(0);
    search.setFilters(this.filters);
    search.search();

  }

  togglePopup(){
    this.closeDown();
  }

  static get styles() {
    return css`
    
    :host {
      display: none;
    }
    :host([open]) {
      display: block;
      box-sizing: border-box;
      overflow: scroll;
      position: absolute;
      font-size: 1.5em;
      text-align: center;
      line-height: normal;
      height: 75%;
      width: 50%;
      transform: translate(0,-105%);
      border: 1px solid black;
      border-radius: 25px;
      background-color: white;
      padding: 1em;
      z-index: 99;
    }
    :host([open]) .fas {
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
    }
    ::slotted(vivo-search-facet.hidden) {
      display: none;
    }
    ::slotted(vivo-search-facet.shown) {
      display: block;
    }
    
    `;
  }

  render() {
    let pagination = html``;

    if (this.facets) {
      this.showHideFacets();
      pagination = html`<vivo-search-pagination 
            number="${this.pageNumber}"
            size="${this.pageBy}"
            totalElements="${this.facets.length}"
            totalPages="${this.facets.length/this.pageBy}"
            pageGrouping=${this.pageGrouping}
        />`
    }

    return html`
    <i class="fas fa-times" @click=${this.togglePopup}></i>
    <slot></slot>
    ${pagination}
    `;
  }
}

customElements.define("vivo-facet-popup-message", FacetPopupMessage);
