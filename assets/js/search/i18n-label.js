import { LitElement, html, css } from "lit-element";

class InternationlizationLabel extends LitElement {
    static get properties() {
        return {
          key: { type: String },
          label: { type: String }
        }
    }
}

customElements.define('vivo-search-i18n-label', InternationlizationLabel);