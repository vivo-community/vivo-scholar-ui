import { LitElement, html, css } from "lit-element";

class SearchSortOptions extends LitElement {

    // NOT multi-select
    static get properties() {
        return {
            options: { type: Array },
            selected: { type: String }
        };
    }

    constructor() {
        super();
        //this.options = [];
        this.handleSortSelected = this.handleSortSelected.bind(this);
        let search = this.parentNode;
        this.search = search;

        // go ahead and parse out every <vivo-search-option>
        this.findOptions();
        
        this.search.sortOptions = this.orders;
        this.search.defaultSort = this.defaults;
    }

    findOptions() {
        this.searchOptions = Array.from(this.querySelectorAll('vivo-search-sort-option'));
        // gather in different ways - once for display
        this.options = this.searchOptions.map(opt => {
            const label = opt.getAttribute("label");
            const field = opt.getAttribute("field");
            const direction = opt.getAttribute("direction");
            return {label: label, field: field, direction: direction }
        });
        // ... and once as parameters
        this.orders = this.searchOptions.map(opt => {
            const field = opt.getAttribute("field");
            const direction = opt.getAttribute("direction");
            return {property: field, direction: direction }
        });

        // then dfigure defaults...
        let defaults =  this.searchOptions.filter((opt) => { return opt.default == true; });
        this.defaults = defaults.map(opt => {
            const field = opt.getAttribute("field");
            const direction = opt.getAttribute("direction");
            return {property: field, direction: direction }
        });
    }

    handleSortSelected(e) {
        let value = e.target.value;
        if (!value) {
            console.error('no value for sorter');
            return;
        }

        this.selected = value;
        const [field, direction] = value.split("-", 2);
        // also, reset paging?  
        this.dispatchEvent(new CustomEvent('sortSelected', {
            detail: { property: field, direction: direction },
            bubbles: true,
            cancelable: false,
            composed: true
        }));
    }

    static get styles() {
        return css`
          :host {
            display: block;
          }
        `
    }

    isSelected(option) {
        // options look like this: 
        // {label: 'Name (asc)', field: 'name', 'direction': "ASC"},
        // TODO: not crazy about having to make this parseable version
        let flag = (this.selected === `${option.field}-${option.direction}`);
        return flag;
    }
    
    render() {
        // okay to call here?
        this.findOptions();
        let defaults =  this.options.filter((opt) => { return opt.default = true; });
        this.search.setAttribute("sortOptions", this.options);
        this.search.defaultSort = defaults;
         
        if (typeof this.selected == 'undefined') {
            if (typeof this.search.orders == 'undefined') {

            } else {
                this.selected = `${this.search.orders[0].property}-${this.search.orders[0].direction}`;

            }
        }
        
        return html`
        <select @change="${this.handleSortSelected}">  
           ${this.options.map(option => 
            html`
            <option 
              ?selected=${this.isSelected(option)}
              value="${option.field}-${option.direction}">
              ${option.label}
            </option>
          `)}
        </select>`
    }
}

customElements.define('vivo-search-sort-options', SearchSortOptions);