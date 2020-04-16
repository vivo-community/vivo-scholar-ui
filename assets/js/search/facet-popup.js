import { LitElement, html, css } from "lit-element";

// needed add, remove filter functions
import Faceter from './faceter.js'

class FacetPopupMessage extends Faceter(LitElement) {

  static get properties() {
    return {
      open: {
        attribute: "open",
        type: Boolean,
        reflect: true
      }
    };
  }

  constructor() {
      super();
      this.handleKeydown = this.handleKeydown.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this.open = false;
      this.filters = [];

      this.additionalFilters = [];
      this.removeFilters = [];

      this.classes = { "modal": true, "show-modal": false }
      this.handleFacetSelected = this.handleFacetSelected.bind(this);
  }


  // just need *some* fields when building, otherwise would
  // send unrecognized parameters to GraphQL
  turnFacetToFilterParam(facet) {
    return {
      "field": facet.field, 
      "value": facet.value, 
      "opKey": facet.opKey,
      "tag": facet.tag,
    }
  }

  queueFilter(facet) {
    this.additionalFilters.push(this.turnFacetToFilterParam(facet));
  }

  dequeueFilter(facet) {
    let filter = this.turnFacetToFilterParam(facet);
    this.additionalFilters = _.reject(this.additionalFilters, function(o) { 
      return (o.field === filter.field && o.value == filter.value); 
    });
    // if it's not in additionalFilters - then it is a de-selected one
    // from original filters - need to mark for removal (if apply button)
    let exists = _.find(this.filters, function(x) { 
      return (x.field == filter.field && x.value == filter.value); 
    });
    // FIXME: kind of hate doing this much work to see if something is in list
    if (typeof exists !== 'undefined') {
      this.removeFilters.push(filter);
    } 
  }

  doesFilterExistsInList(ary, el) {
    let exists = _.find(ary, function(x) { 
      return (x.field == el.field && x.value == el.value); 
    });
    if (typeof exists !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  firstUpdated() {
    this._slot = this.shadowRoot.querySelector("slot");
    this._slot.addEventListener('slotchange', this._onSlotChange);
    this.addEventListener("keydown", this.handleKeydown);
    this.addEventListener('facetSelected', this.handleFacetSelected);

    this._searchBox = this.shadowRoot.querySelector("#filter-list");
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._slot.removeEventListener('slotchange', this._onSlotChange);
    this.removeEventListener("keydown", this.handleKeydown);
    this.removeEventListener('facetSelected', this.handleFacetSelected);
  }

  handleFacetSelected(e) {
    // NOTE: need to prevent default 'facet clicked' behavior
    e.preventDefault();
    e.stopPropagation();
    let selected = e.detail.checked;
    e.target.selected = selected;

    const facet = e.detail;
    if (facet.checked) {
      // keep track of *only* added
      this.queueFilter(facet);
    } else {
      this.dequeueFilter(facet);
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
      
      // adds
      this.filters = this.filters.concat(this.additionalFilters);
      // removes
      this.filters = this.filters.filter((el) => !this.doesFilterExistsInList(this.removeFilters, el));
      // need to set filters on group
      group.setFilters(this.filters);
      // then run search
      search.setPage(0);
      search.setFilters(this.filters);
      search.search();
    } else {
      // need to unselect all (newly added)
      this.facets.forEach((f) => {
        let newOne = _.find(this.additionalFilters, function(filter) { 
          return (filter.field == f.field && filter.value == f.value); 
        })
        if (typeof newOne !== 'undefined') {
          f.removeAttribute('selected')
        } 
        // do removals? need to be reselected?
        let oldOne = _.find(this.removeFilters, function(filter) { ;
          return (filter.field == f.field && filter.value == f.value); 
        })
        if (typeof oldOne !== 'undefined') {
          f.setAttribute('selected', true);
        } 
      });
    }
  
    // reset when closing
    this.additionalFilters = [];
    this.removeFilters = [];
  }

  static get styles() {
    return css`
    vivo-modal {
      --modal-width: 36rem;
    }
    .fas {
      display: inline-block;
      font-style: normal;
      font-variant: normal;
      text-rendering: auto;
      font-size: 1em;
      -webkit-font-smoothing: antialiased;
      flex-basis: 10%;
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
      padding-right: 1em;
      padding-left: 1em;
    }
    ::slotted(vivo-search-facet[hidden=true]) {
      display: none;
    }
    ::slotted([slot="heading"]) {
      flex-grow: 1;
      flex-basis: 20%;
      text-align: left;
      font-weight: bold;
    }
    ::slotted(input) {
      flex-basis: 70%;
      text-align: left;
    }
    .heading {
      background-color: var(--highlightBackgroundColor);
      margin-top: 0;
      display:flex;
      padding-right: 4px;
      padding-left: 1em;
      padding-top: 1em;
      padding-bottom: 1em;
    }
    .smaller-input {
      font-size: 0.85em;
      width: 75%;
    }
    .facet-container {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      max-height: 200px;
      min-width: 100px;
      max-width: 32rem;
      overflow: auto;
      overflow-y: hidden;
      scrollbar-base-color:#ffeaff;
      padding-left: 4px;
      margin: 1em;
    }
    #cancel {
      display: inline-block;
      background-color: var(--mediumNeutralColor);
      color: white;
      padding: 8px;
      font-size: 1em;
      font-weight: bold;
      border: none;
    }
    #apply {
      display: inline-block;
      background-color: var(--highlightColor);
      color: white;
      padding: 8px;
      font-size: 1em;
      font-weight: bold;
      border: none;
    }
    #cancel:hover {
      cursor: pointer;
    }
    #apply:hover {
      cursor: pointer;
    }
    .actions {
      text-align: center;
      padding: 8px;
    }
    `;
  }

  // https://remysharp.com/2010/07/21/throttling-function-calls
  debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  makeFacetsVisible(facetList) {
    facetList.forEach((f) => f.removeAttribute("hidden"));
  }

  makeFacetsHidden(facetList) {
    facetList.forEach((f) => f.setAttribute("hidden", true));
  }

  searchKeyUp(e) {
    let filterText = this._searchBox.value;
    if (filterText.length >= 2) {
      let matchList = [];
      let hiddenList = [];
      this.facets.forEach((f) => {
        if (f.value.toLowerCase().includes(filterText.toLowerCase()) || f.selected == true) {
           matchList.push(f);
        } else {
          hiddenList.push(f);
        }
      });
     
      this.makeFacetsVisible(matchList);
      this.makeFacetsHidden(hiddenList);

    } else if (filterText.length < 2) { 
      // make sure all are seen
      this.makeFacetsVisible(this.facets); 
    }
  }

  render() {

    return html`
    <vivo-modal ?shown="${this.open}">
        <div class="heading">
          <slot name="heading"></slot>
          <input class="smaller-input" type="text" id="filter-list"
            @keyup=${this.debounce(this.searchKeyUp,  250)}
            placeholder="Start typing to find a specific filter result">
          <i class="fas fa-times" @click=${this.cancel}></i>
        </div>
        <div class="facet-container">
          <slot></slot>
        </div>
        <div class="actions">
          <button id="cancel" @click=${this.cancel}>Cancel</button>
          <button id="apply" @click=${this.apply}>Apply</button>
        </div>
    </vivo-modal>
    `;
  }
}

customElements.define("vivo-facet-popup-message", FacetPopupMessage);
