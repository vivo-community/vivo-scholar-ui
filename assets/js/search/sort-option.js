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

    // NOTE: no render, seemed easier
}

customElements.define('vivo-search-sort-option', SearchSortOption);