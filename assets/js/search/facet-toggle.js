import { LitElement, html, css } from "lit-element";

// TODO: probably want to show more, and show more 
// until there are no more
class SearchFacetToggle extends LitElement {

    static get properties() {
        return {
          count: { type: Number },
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
        // console.log(`total facets (over 5)=${this.count}`);
        // need facets shown count?
        // if we keep track of how many shown, if another 'More'
        // would go over number, show Less
        // e.g. this.shadowRoot.querySelector('vivo-search-facet') ??
        // if allShown ->
        //   show less ->
        // else (e.g. there are more) -> 
        //   show more -> display: visible? 
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

    // TODO: what to do about facets selected and 'show less'?
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
  