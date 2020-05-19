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
        this.handleClearFilters = this.handleClearFilters.bind(this);
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
            :host { display: block; }
            div { display: flex; }
            :host ::slotted([slot=clear]) {
                display:none;
            }
            :host([shown]) {
                display:block;
                width: 100%;
            }   
            :host .fa-filter::before {
                font-family: 'Font Awesome 5 Free';
                font-weight: 900;
                content: "\\f0b0";
                font-style: normal;
            }
            :host([shown]) ::slotted([slot=clear]) {
                display:block; 
                flex-grow: 4;
                font-weight: bold;
            }
        }        
        `
    }

    handleClearFilters(e) {
        this.dispatchEvent(new CustomEvent('removeFilters', {
            detail: { clear: true }, // not sure what to put
            bubbles: true,
            cancelable: false,
            composed: true
        }));
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
        <div>
          <slot name="clear" @click="${this.handleClearFilters}"></slot>
          <button @click="${this.handleToggleFilters}">
            <i class="fas fa-filter"></i> 
          </button>
        </div>
        `
    }
}

customElements.define('vivo-facet-group-toggle', SearchFacetGroupToggle);