import { LitElement, html, css } from "lit-element";

class SearchFacets extends LitElement {

  static get properties() {
    return {
        field: { type: String }, // e.g. researchAreas
        key: { type: String }, // e.g. people
        filters: { type: Array },
        data: { type: Object } //
    }
  }

  constructor() {
    super();
  }

  setData(data) {
    //console.log(`Setting data of search-facets: ${JSON.stringify(data)}`)
    this.data = data;
  }

  setFilters(filters) {
    console.log(`settings filters in facets: ${JSON.stringify(filters)}`);
    // FIXME: this gets set over and over again in different components
    this.filters = filters;
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
  
  inFilters(field, facet) {
    //console.log(`checking if ${JSON.stringify(facet)} should be checked:${field}`)
    let exists = _.find(this.filters, function(f) { 
      //console.log(`${f.field} == ${field} && ${f.value} == ${facet.value}`);
      //console.log(f.field == field && f.value == facet.value);
      return (f.field == field && f.value == facet.value); 
    });
    if (typeof exists !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  render() {
    if (!this.data) {
      return html``
    }
    //console.log(`data=${JSON.stringify(this.data)}`);
    // NOTE: it's an array - but only want first?
    let content = this.data[0].entries.content;
    //console.log(`content=${JSON.stringify(content)}`);
    
    let facetList = content.map(facet => {
      //console.log(`facets:render():${this.field}: ${JSON.stringify(facet)}`);
      let selected = this.inFilters(this.field, facet);  
      //console.log(`result: ${this.field}:${facet.value}: ${selected}`);  
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
  