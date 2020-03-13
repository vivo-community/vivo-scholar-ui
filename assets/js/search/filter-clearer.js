import { LitElement, html, css } from "lit-element";

class SearchFilterClearer extends LitElement {

    constructor() {
        super();
        this.handleClearFilters = this.handleClearFilters.bind(this);
    }

    static get styles() {
        return css`
          a:hover {
            cursor: pointer;
          }
          `
    }

    handleClearFilters(e) {
        console.log("should clear filters here");
        /*  
        this.dispatchEvent(new CustomEvent('removeFilters', {
            detail: { ?? },
            bubbles: true,
            cancelable: false,
            composed: true
        }));
        */
    }

    render() {
        return html`<a @click="${this.handleClearFilters}">
           Clear Filters ...
        </a>`
    }
}

customElements.define('vivo-filter-clearer', SearchFilterClearer);