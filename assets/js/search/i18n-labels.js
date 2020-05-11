import { LitElement } from "lit-element";

class InternationalizationLabels extends LitElement {

    constructor() {
      super();
      this.i18n = {};
      this.setLabels();
    }

    setLabels() {
        let values = Array.from(this.querySelectorAll('vivo-i18n-label'));
        values.forEach(opt => {
            const key = opt.getAttribute("key");
            const label = opt.getAttribute("label");
            this.i18n[key] = label;
        });
    }
    
    getLabel(key) {
        // TODO: what if no match? just blank or error?
        return this.i18n[key] || '';
    }

    getLabels() {
        return this.i18n;
    }
}

customElements.define('vivo-i18n-labels', InternationalizationLabels);