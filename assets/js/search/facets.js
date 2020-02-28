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
  }

  static get styles() {
    return css`
      :host {
          display: block;
      }
      vivo-search-facet[selected=""] {
        font-weight: bold;
      }
    `
  }

  generateHiddenFacetList(showList) {
    return html`<vivo-search-facet-toggle>
      ${this.generateFacetList(showList)}
    </vivo-search-facet-toggle>
    `
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

    let showHtml  = this.generateFacetList(showList);
    let hideHtml = (hideList.length > 0) ? this.generateHiddenFacetList(hideList): html``;
    
    return html`
        <slot></slot>
        ${showHtml}
        ${hideHtml}
      `
    }

}
  
customElements.define('vivo-search-facets', SearchFacets);
  