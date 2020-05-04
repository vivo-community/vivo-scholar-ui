import { LitElement, html, css } from "lit-element";

class SearchSortOption extends LitElement {

    static get properties() {
        return {
          field: { type: String },
          direction: { type: String },
          label: { type: String },
          selected: { type: Boolean }
        }
    }

    /*
    isSelected(option) {
        // options look like this: 
        // {label: 'Name (asc)', field: 'name', 'direction': "ASC"},
        // TODO: not crazy about having to make this parseable version
        let flag = (this.selected === `${option.field}-${option.direction}`);
        return flag;
    }
    */

    render() {
        return html`
            <option 
              ?selected=${this.selected}
              value="${this.field}-${this.direction}">
              ${this.label}
            </option>`
    }
}

customElements.define('vivo-search-sort-option', SearchSortOption);