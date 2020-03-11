import { LitElement, html, css } from "lit-element";

class FacetPopupMessage extends LitElement{

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
      //this.handleKeyup = this.handleKeyup.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this.pageNumber = 0;
      this.pageBy = 5;
  }

  firstUpdated() {
    //this.addEventListener("click", this.togglePopup);
    this._slot = this.shadowRoot.querySelector("slot");
    this._slot.addEventListener('slotchange', this._onSlotChange);
    //this.addEventListener("keyup", this.handleKeyup);

    this.addEventListener("facetPageSelected", this.handleFacetPageSelected);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    //this.removeEventListener('click', this.togglePopup);
    this._slot.removeEventListener('slotchange', this._onSlotChange);
  }


  _onSlotChange() {
    this.facets = Array.from(this.querySelectorAll('vivo-search-facet'));
    console.log(`popup has ${this.facets.length} facets`);
    // TODO: might need to divide up by pageBy in some manner
  }

  /*
  NOT working
  handleKeyup(e) {
    console.log("keyup");
    if (e.keyCode === 27) {
        this.open = false;
    }
  }
  */

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
    // TODO: sending this for now: detail: { value: page }
    let page = e.detail.value;
    this.pageNumber = page;
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
      /* position: fixed; */
      position: absolute;
      font-size: 1.5em;
      text-align: center;
      line-height: normal;
      height: 75%;
      width: 50%;
      transform: translate(0,-105%);
      border: 1px solid black;
      border-radius: 25px;
      background-color: var(--highlightBackgroundColor);
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

  togglePopup(){
    this.open = !this.open;
    // TODO: focus if open - so ESC key can be caught?
  }

  render() {
    let pagination = html``;

    if (this.facets) {
      this.showHideFacets();
      pagination = html`<vivo-facet-pagination 
            number="${this.pageNumber}"
            size="${this.pageBy}"
            totalElements="${this.facets.length}"
            totalPages="${this.facets.length/this.pageBy}"
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
