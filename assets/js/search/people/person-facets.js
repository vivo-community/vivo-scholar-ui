import { LitElement, html, css } from "lit-element";

class PeopleFacets extends LitElement {

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
      // AND group 
      // AND only show ones with key match 
      // etc...             
      let fakeFacets = html`
          <h4>Keywords</h4>
          <vivo-search-facet value="facet1" label="Facet 1" count="10">
          </vivo-search-facet>
          <vivo-search-facet value="facet2" label="Facet 2" count="2">
          </vivo-search-facet>
          <h4>Research Areas</h4>
          <vivo-search-facet value="facet1" label="Facet 1" count="15">
          </vivo-search-facet>
          <vivo-search-facet value="facet2" label="Facet 2" count="6">
          </vivo-search-facet>          
          `
       
      return html`
          <vivo-search-facets>
            <h3 slot="heading">Filter People</h3>
            <div slot="content">
            ${fakeFacets}
            </div>
          </vivo-search-facets>
          `
    }
  };
  
  customElements.define('vivo-search-person-facets', PeopleFacets);
  