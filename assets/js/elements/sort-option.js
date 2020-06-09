import { LitElement, html, css } from "lit-element";

class SortOption extends LitElement {

    static get properties() {
        return {
          field: { type: String },
          direction: { type: String },
          label: { type: String }
        }
    }
}

customElements.define('vivo-sort-option', SortOption);