import { LitElement, html, css } from "lit-element";

import Faceter from './faceter.js'

class SearchFacets extends Faceter(LitElement) {

  static get properties() {
    return {
        field: { type: String }, // e.g. researchAreas
        key: { type: String }, // e.g. people
        tag: { type: String, attribute: true }, // e.g. SOLR "tag"
        opKey: { type: String, attribute: true } // EQUALS, RAW etc...
    }
  }

  constructor() {
    super();
    this.tag = ""; // default no tagging
    this.opKey = "EQUALS"; // default to EQUALS compare
    this.popupThreshold = 8; // eventually 15
    this.togglePopup = this.togglePopup.bind(this);
  }

  static get styles() {
    return css`
      :host {
          display: block;
      }
      vivo-search-facet[selected=""] {
        font-weight: bold;
      }
      :host p {
        opacity: 50%;
        font-size: 1em;
        font-weight: normal;
      }
    `
  }

  togglePopup() {
    let popup = this.shadowRoot.querySelector("#popup-facets");

    if (popup.getAttribute("open")) {
      popup.removeAttribute("open");
    } else {
      popup.setAttribute("open", true);
    }

    // this does focus to header - so when popup is first
    // opened it's possible to close with ESC key
    let header = this.shadowRoot.querySelector("#popup-header");
    header.focus();
  }

  generateFacetToggle(showList) {
    var results = html`<vivo-search-facet-toggle>
      ${this.generateFacetList(showList)}
    </vivo-search-facet-toggle>`
    return results;
  }

  // might be good to get title of facet in here
  // but it's not necessarily in the data
  generateFacetPopup(showList) {
    // just added tabindex to try and be able to focus
    var results = html`
    <p id="toggle-facet" @click=${this.togglePopup}>Show More</p>
    <vivo-facet-popup-message id="popup-facets">
      <h4 id="popup-header" tabindex="-1">Filters</h4>
      ${this.generateFacetList(showList)}
    </vivo-facet-popup-message>`;
    return results;
  }

 generateHiddenFacetList(content, hideList) {
  if (content.length > this.popupThreshold) { 
    // make selected drift to top?
    // the pop-up needs all options
    return this.generateFacetPopup(content)
  } else  {
    return this.generateFacetToggle(hideList);
  }
 }

  generateFacetList(content) {
    let facetList = content.map(facet => {
      let selected = this.inFilters(this.field, facet);   
      return html`<vivo-search-facet
        category="${this.key}"
        tag="${this.tag}"
        opKey="${this.opKey}"
        field="${this.field}"
        ?selected=${selected}
        value="${facet.value}" 
        label="${facet.value}" 
        count="${facet.count}">
        </vivo-search-facet>`
      });
    return facetList;
  }

  render() {
    if (!this.data) {
      return html``
    }
    // NOTE: it's an array - but only want first
    let content = this.data[0].entries.content;

    var showList = content.slice(0,5);
    var hideList = content.slice(5);

    let extras = hideList.filter(facet => 
       this.inFilters(this.field, facet)
    );
    // sort?
    showList = _.concat(showList, extras);
    
    let showHtml  = this.generateFacetList(showList);
    let hideHtml = (hideList.length > 0) ? this.generateHiddenFacetList(content, hideList): html``;
    
    return html`
        <slot></slot>
        ${showHtml}
        ${hideHtml}
      `
    }

}
  
customElements.define('vivo-search-facets', SearchFacets);
  