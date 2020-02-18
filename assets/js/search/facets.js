import { LitElement, html, css } from "lit-element";

import Faceter from './faceter.js'

// 
class SearchFacets extends Faceter(LitElement) {

  static get properties() {
    return {
        field: { type: String }, // e.g. researchAreas
        key: { type: String }, // e.g. people
        //filters: { type: Array },
        //data: { type: Object } //
    }
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

  render() {
    if (!this.data) {
      return html``
    }
    // NOTE: it's an array - but only want first
    let content = this.data[0].entries.content;
    
    let facetList = content.map(facet => {
      let selected = this.inFilters(this.field, facet);   
      return html`<vivo-search-facet
        category="${this.key}"
        field="${this.field}"
        ?selected=${selected}
        value="${facet.value}" 
        label="${facet.value}" 
        count="${facet.count}">
        </vivo-search-facet>`
      });
      
      return html`
        <slot></slot>
        ${facetList}
      `
    }

}
  
customElements.define('vivo-search-facets', SearchFacets);
/*
  looks like this now:

          <vivo-search-publication-facets slot="content" search="publication-search">
              <vivo-search-facets key="documents" field="publicationDate">
                <h4>Date</h4>
              </vivo-search-facets>
          </vivo-search-publication-facets>

maybe look like this?
<vivo-facets slot="content"
             key="documents" 
             field="publicationDate" 
             search="publication-search">
  
<vivo-publication-date-facets 
    slot="content"
    key="documents" 
    field="publicationDate" 
    search="publication-search"
    implements="vivo-facets">

       <vivo-publication-date-facets field="publicationDate" implements="vivo-facets"> 
      <h4>Date</h4>
      <!-- then publication-date-facets then could have this 
      or just whatever 
      ... -->
      <vivo-date-slider interface="vivo-facet"/>
    </vivo-facets>
          */
  