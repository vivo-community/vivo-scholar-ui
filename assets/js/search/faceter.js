
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
  
  // see facet-group, removing filters if not in results
  // need a way to map selected filters to search results
  getValuesFromContent(content) {
    let values = content.map(v => v.value);
    return values;
  }

  // TODO: when adding filter - if already one of that field
  // turn it into a list (then join(' OR '))?
  addFilter(filter) {
    // TODO: maybe not send tag if blank (and opKey too)
    this.filters.push(
      {
        "field": filter.field, 
        "value": filter.value, 
        "opKey": filter.opKey,
        "tag": filter.tag,
      }
    );
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
  