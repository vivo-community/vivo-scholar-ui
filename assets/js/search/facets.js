import { LitElement, html, css } from "lit-element";

import Faceter from './faceter.js'

import * as config from './config.js'
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
    this.popupThreshold = config.FACET_POPUP_THRESHOLD;
    this.showCount = config.FACETS_SHOW;
    this.togglePopup = this.togglePopup.bind(this);
  }

  static get styles() {
    return css`
      :host {
        display: block;
        line-height: 1.6em;
        padding-bottom: 1em;
      }
      vivo-search-facet[selected=""] {
        font-weight: bold;
      }
      :host p {
        opacity: 50%;
        font-size: 1em;
        font-weight: normal;
        margin: 0;
      }
      ::slotted(h4) {
        padding: 0;
        margin: 0;
      }
    `
  }

  togglePopup() {
    let popup = this.shadowRoot.querySelector("#popup-facets");

    if (popup.getAttribute("open")) {
      popup.closeDown();
    } else {
      popup.openUp();
      // when open popup - need to 'reset' filters
      popup.setFilters(this.filters);
    }
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

    var showList = content.slice(0,this.showCount);
    var hideList = content.slice(this.showCount);

    let selected = hideList.filter(facet => 
       this.inFilters(this.field, facet)
    );

    let isPopup = (content.length > this.popupThreshold) ? true : false; 
    showList = _.concat(showList, selected);

    // if it's NOT a popup - then make a selected facet
    // show up on sidebar - no matter if show more/less is chosen
    if (!isPopup) {
      hideList = _.difference(hideList, selected);
    } else {
      // otherwise, put selected on top
      showList = _.concat(selected, showList);
      // and then fall back to only showing 5
      showList = showList.slice(0,this.showCount)
    }
    
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
  