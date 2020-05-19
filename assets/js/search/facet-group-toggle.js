import { LitElement, html, css } from "lit-element";

class SearchFacetGroupToggle extends LitElement {

    static get properties() {
        return {
            shown: { type: Boolean, reflect: true }
        }
    }

    constructor() {
        super();
        this.shown = false;
        this.handleToggleFilters = this.handleToggleFilters.bind(this);
    }

    static get styles() {
        return css`
        :host {
            display: none;
        }
        a {
          font-weight: bold;
        }
        a:hover {
          cursor: pointer;
        }

        @media screen and (max-width: 1000px) {
            :host { display: inline; }
            :host([shown]) {
                display:block;
                margin-left: 85%;
            }
            :host([shown]) vivo-filter-clearer {
                display:block;
                margin-left: 85%;
            }
            :host .fa-filter::before {
                font-family: 'Font Awesome 5 Free';
                font-weight: 900;
                content: "\\f0b0";
                font-style: normal;
            }
        }        
        `
    }

    handleToggleFilters(e) {
        this.dispatchEvent(new CustomEvent('toggleFilters', {
            detail: { show: !this.shown }, // not sure what to put
            bubbles: true,
            cancelable: false,
            composed: true
        }));
        this.shown = !this.shown;

        this.toggleOptions();
    }

    render() {
        return html`
        <button @click="${this.handleToggleFilters}">
          <i class="fas fa-filter"></i> 
        </button>
        `
    }
}

customElements.define('vivo-facet-group-toggle', SearchFacetGroupToggle);