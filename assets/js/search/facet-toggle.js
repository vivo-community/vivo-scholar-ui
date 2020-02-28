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
        `
    }

    constructor() {
        super();
        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle(e) {
        console.log(e.target);
        // target=<vivo-search-facets key="documents" field="type" tag="type">
        console.log(`${JSON.stringify(e)}`);
        let label = e.target.textContent;
        if (label === 'More...') {  
            e.target.textContent = 'Less...';  
            this.visible = true;  
  
        } else if  ( label === 'Less...' ) {  
            e.target.textContent = 'More...';  
            this.visible = false;  
        }  
        
    }

    render() {      
        return html`
            <div @click=${this.handleToggle} title="Show More Facets">More...</div>
            <div class="facets" visible="${this.visible}">
              <slot></slot>
            </div>
        `
    }

}
  
customElements.define('vivo-search-facet-toggle', SearchFacetToggle);
  