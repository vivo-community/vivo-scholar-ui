import { LitElement, html, css } from "lit-element";

class SearchFacetToggle extends LitElement {

    static get properties() {
        return {
          visible: { type: Boolean, attribute: true, reflect: true }
        }
    }

    static get styles() {
        return css`
            .facets {
                display: none;
            }
            .facets[visible='true'] {
                display: block;
            }
            span.label {
                opacity: 50%;
            }
        `
    }

    constructor() {
        super();
        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle(e) {
        if (!this.visible) {  
            let toggle = this.shadowRoot.querySelector("#toggle");
            toggle.textContent = "Show Less";
            this.visible = true;  
  
        } else if (this.visible) {  
            let toggle = this.shadowRoot.querySelector("#toggle");
            toggle.textContent = "Show More";
            this.visible = false;  
        }  
        
    }

    // TODO: what about facets selected - just be hidden?
    render() {      
        return html`
            <div class="facets" visible="${this.visible}">
              <slot></slot>
            </div>
            <div @click=${this.handleToggle}>
              <span class="label" id="toggle">Show More</span>
            </div>
        `
    }

}
  
customElements.define('vivo-search-facet-toggle', SearchFacetToggle);
  