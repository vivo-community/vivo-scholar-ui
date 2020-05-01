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
            :host .fa-filter::before {
                font-family: 'Font Awesome 5 Free';
                font-weight: 900;
                content: "\\f0b0";
                font-style: normal;
            }
            :host ::slotted([slot="show"]) {
                display: inline;
            }
            :host ::slotted([slot="hide"]) {
                display: none;
            }
            :host([shown]) ::slotted([slot="show"]) {
                display: none;
            }
            :host([shown]) ::slotted([slot="hide"]) {
                display: inline;
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
    }

    // FIXME: i18n problem
    render() {
        return html`
        <button @click="${this.handleToggleFilters}">
          <i class="fas fa-filter"></i> 
          <slot name="show"></slot>
          <slot name="hide"></slot>
        </button>`
    }
}

customElements.define('vivo-facet-group-toggle', SearchFacetGroupToggle);