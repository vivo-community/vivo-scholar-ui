import { LitElement, html, css } from "lit-element";

class SearchFacetToggle extends LitElement {

    static get properties() {
        return {
            count: { type: Number },
            visible: { type: Boolean, attribute: true, reflect: true }
        }
    }

    constructor() {
        super();
        this.handleToggle = this.handleToggle.bind(this);
        this._onSlotChange = this._onSlotChange.bind(this);
    }

    firstUpdated() {
        this._slot = this.shadowRoot.querySelector("slot");
        this._slot.addEventListener('slotchange', this._onSlotChange);
    }


    disconnectedCallback() {
        super.disconnectedCallback();
        this._slot.removeEventListener('slotchange', this._onSlotChange);
    }

    _onSlotChange() {
        this._countFacets();
    }

    _countFacets() {
        this.facets = Array.from(this.querySelectorAll('vivo-search-facet'));
        this.count = this.facets.length; /// e.g. how many more than 5
    }

    handleToggle(e) {
        this.visible = !this.visible;
    }


    static get styles() {
        return css`
          :host ::slotted([slot="show-less"]) {
            display: none;
          }
          :host ::slotted([slot="show-more"]) {
            display: inline;  
          }
          :host([visible]) ::slotted([slot="show-less"]) {
             display: inline;
          }
          :host([visible]) ::slotted([slot="show-more"]) {
            display: none;
          }
          .facets {
            display: none;
          }
          .facets[visible='true'] {
              display: block;
          }
          div.label {
              opacity: 50%;
              text-decoration: underline;
          }
          div.label:hover {
              cursor: pointer;
          }
        `
    }

   render() {
        return html`
            <div class="facets" visible="${this.visible}">
              <slot></slot>
            </div>
            <div @click=${this.handleToggle} class="label">
               <slot name="show-less"></slot>
               <slot name="show-more"></slot>
            </div>
        `
    }

}

customElements.define('vivo-search-facet-toggle', SearchFacetToggle);
