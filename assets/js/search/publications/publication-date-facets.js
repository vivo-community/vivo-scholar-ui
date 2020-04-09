import { LitElement, html, css } from "lit-element";

import Faceter from '../faceter.js'

// TODO: might end up better to extend SearchFacets
class PublicationDateFacets extends Faceter(LitElement) {

  static get properties() {
    return {
        field: { type: String }, // e.g. researchAreas
        key: { type: String }, // e.g. people
        tag: { type: String, attribute: true }, // e.g. SOLR "tag"
        opKey: { type: String, attribute: true },
        implements: { type: String, attribute: true, reflect: true }
    }
  }

  static get styles() {
    return css`
      :host {
          display: block;
      }
      vivo-publication-date-facet[selected=""] {
        font-weight: bold;
      }
      ::slotted(h4) {
        text-align: right;
      }
    `
  }

  constructor() {
    super();
    this.implements = "vivo-search-facets";
    //this.opKey = "EQUALS";
    this.opKey = "BETWEEN";
  }

  // NOTE: this has to be an over-ride because trying to match
  // incoming search results to applied filters
  getValuesFromContent(content) {
    console.log("trying to do something different here");
    let values = content.map(v => {
      let dateValue = new Date(v.value);
      let today = new Date();
      let end = new Date(today.getFullYear() + 1, 12, 31);
      let range = `[${v.value} TO ${end.toISOString()}]`;
      return range;
    });
    return values;
  }

  render() {
    if (!this.data) {
      return html``
    }
    // NOTE: it's an array - but only want first
    let content = this.data[0].entries.content;
    
    let facetList = content.map(facet => {
      let dateValue = new Date(facet.value);
      let today = new Date();
      let end = new Date(today.getFullYear() + 1, 12, 31);

      let range = `[${facet.value} TO ${end.toISOString()}]`;
      let fakeFacet = {"value": ""+range+"", "count": facet.count, "__typename": "FacetEntry"};
      
      let selected = this.inFilters(this.field, fakeFacet); 
      return html`<vivo-publication-date-facet
        category="${this.key}"
        tag="${this.tag}"
        opKey="${this.opKey}"
        field="${this.field}"
        ?selected=${selected}
        value="${range}" 
        label="${dateValue.getFullYear()}" 
        count="${facet.count}">
        </vivo-publication-date-facet>`
      });
      
      return html`
        <slot></slot>
        ${facetList}
      `
    }

}
  
customElements.define('vivo-publication-date-facets', PublicationDateFacets);
  