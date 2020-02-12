import { LitElement, html, css } from "lit-element";

class SearchFacets extends LitElement {

    static get styles() {
      return css`
        :host {
            display: block;
        }
      `
    }
  
    render() {
      // TODO: not crazy about pass-through slots with same exact name
      // only purpose of this class is element is wrapping in sidebar-item
      // need to be grouping of facets per vivo-sidebar-item?
      return html`
          <vivo-sidebar-item>
            <div slot="heading">
              <slot name="heading"/>
            </div>
            <div slot="content">
              <slot name="content"/>
            </div>
          </vivo-sidebar-item>
          `
    }
  }
  
  customElements.define('vivo-search-facets', SearchFacets);
  