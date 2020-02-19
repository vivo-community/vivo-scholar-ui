//import { LitElement, html, css } from "lit-element";

let Faceter = (superclass) => class extends superclass {

    // not sure why this is necessary here
    static get properties() {
        return {
          data: { type: Object },
          selected: { type: Boolean, attribute: true, reflect: true },
          filters: { type: Array },
        }
      }
    
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
  