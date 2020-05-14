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
            :host { display: inline; }
            
            :host .fa-filter::before {
                font-family: 'Font Awesome 5 Free';
                font-weight: 900;
                content: "\\f0b0";
                font-style: normal;
            }
            
            #menu {
                display: none;
            }
            #menu.open {
                display: block;
                color: var(--textColor);
                background-color: var(--lightNeutralColor);  
            }
            #menu.open ul {
                list-style: none;
                padding-left: 8px;
                padding-right: 4px;
                margin-top: 0;
            }
            #menu.open ul li {
                font-weight: bold;
            }
            :host ::slotted([slot="clear"]) {
                cursor: pointer;
                display: inline;
            }
            :host ::slotted([slot="show"]) {
                display: inline;
                cursor: pointer;
            }
            :host ::slotted([slot="hide"]) {
                display: none;
            }
            :host([shown]) ::slotted([slot="show"]) {
                display: none;
            }
            :host([shown]) ::slotted([slot="hide"]) {
                display: inline;
                cursor: pointer;
            }
        }        
        `
    }

    toggleOptions() {   
        const showMenu = this.shadowRoot.querySelector("#menu");
        if (showMenu.classList.contains('open')){
          showMenu.classList.remove('open');
        } else {
          showMenu.classList.add('open');
        }
    }

    handleClearFilters(e) {
        this.dispatchEvent(new CustomEvent('removeFilters', {
            detail: { clear: true }, // not sure what to put
            bubbles: true,
            cancelable: false,
            composed: true
        }));

        this.toggleOptions();
    }

    handleToggleFilters(e) {
        
        // actually show menu instead ...
        this.dispatchEvent(new CustomEvent('toggleFilters', {
            detail: { show: !this.shown }, // not sure what to put
            bubbles: true,
            cancelable: false,
            composed: true
        }));
        this.shown = !this.shown;

        this.toggleOptions();
    }

    //<button @click="${this.handleToggleFilters}">
    render() {
        return html`
        <button @click="${this.toggleOptions}">
          <i class="fas fa-filter"></i> 
        </button>
        <div id="menu">
          <ul>
            <li><slot name="show" @click="${this.handleToggleFilters}"></slot></li>
            <li><slot name="hide" @click="${this.handleToggleFilters}"></slot></li>
            <li><slot name="clear" @click="${this.handleClearFilters}"></slot></li>
          </ul>
        </div>
        `
    }
}

customElements.define('vivo-facet-group-toggle', SearchFacetGroupToggle);