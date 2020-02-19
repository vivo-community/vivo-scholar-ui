import { LitElement, html, css } from "lit-element";

import Faceter from '../faceter.js'

class PublicationDateFacets extends Faceter(LitElement) {

  static get properties() {
    return {
        field: { type: String }, // e.g. researchAreas
        key: { type: String }, // e.g. people
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
    `
  }

  constructor() {
    super();
    this.implements = "vivo-search-facets";
  }
  
  render() {
    if (!this.data) {
      return html``
    }
    // NOTE: it's an array - but only want first
    let content = this.data[0].entries.content;
    
    let facetList = content.map(facet => {
      let selected = this.inFilters(this.field, facet);   
      return html`<vivo-publication-date-facet
        category="${this.key}"
        field="${this.field}"
        ?selected=${selected}
        value="${facet.value}" 
        label="${facet.value}" 
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
  