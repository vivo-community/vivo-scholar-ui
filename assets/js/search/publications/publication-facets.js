import { LitElement, html, css } from "lit-element";

class PublicationFacets extends LitElement {

    static get properties() {
      return {
        data: { type: Object }
      }
    }
    
    static get styles() {
      return css`
      :host { 
        display: none;
      }
      :host([selected]) {
        display: block;
      }
      `
    }
    
    render() {
      // TODO: gather facets from search data 
      // only show ones with key match etc...             
      let fakeFacets = html`
          <vivo-search-facet value="facet1" label="Facet 1">
          </vivo-search-facet>
          <vivo-search-facet value="facet2" label="Facet 2">
          </vivo-search-facet>`
  
      // grouping of facets per vivo-sidebar-item
      return html`
          <vivo-search-facets class="hidden">
            <h3 slot="heading">Publication Facets</h3>
            <div slot="content">
            ${fakeFacets}
            </div>
          </vivo-search-facets>
          `
    }
  };
  
  customElements.define('vivo-search-publication-facets', PublicationFacets);
  