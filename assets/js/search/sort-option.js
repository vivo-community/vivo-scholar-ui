import { LitElement, html, css } from "lit-element";

class SearchSortOption extends LitElement {

    static get properties() {
        return {
          field: { type: String },
          direction: { type: String },
          label: { type: String },
          selected: { type: Boolean },
          default: { type: Boolean }
        }
    }

    // TODO: not actually using render right now
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