import { LitElement, html, css } from "lit-element";

class InternationalizationLabel extends LitElement {
    static get properties() {
        return {
          key: { type: String },
          label: { type: String }
        }
    }
}

customElements.define('vivo-i18n-label', InternationalizationLabel);