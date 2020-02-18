//import { LitElement, html, css } from "lit-element";

let Faceter = (superclass) => class extends superclass {

    /*
    static get properties() {
        return {
            field: { type: String }, // e.g. researchAreas
            key: { type: String }, // e.g. people
            filters: { type: Array },
            data: { type: Object } //
        }
      }
      */

  setData(data) {
    this.data = data;
  }

  setFilters(filters) {
    this.filters = filters;
  }
  
  addFilter(filter) {
    this.filters.push({"field": filter.field, "value": filter.value});
  }

  removeFilter(filter) {
    this.filters = _.reject(this.filters, function(o) { 
      return (o.field === filter.field && o.value == filter.value); 
    });
  }

  inFilters(field, facet) {
    let exists = _.find(this.filters, function(f) { 
      return (f.field == field && f.value == facet.value); 
    });
    if (typeof exists !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }
}
  
export default Faceter;
  /*
  looks like this now:

            <vivo-search-publication-facets slot="content" search="publication-search">
            <vivo-search-facets key="documents" field="publicationDate">
              <h4>Date</h4>
            </vivo-search-facets>
          </vivo-search-person-facets>

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
  