import { LitElement, html, css } from "lit-element";

class SearchSidebarItem extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        box-sizing: border-box;
        margin: 0;
      }
      ::slotted([slot="heading"]) {
        padding: .25em 1em;
        background-color: var(--highlightBackgroundColor);
      }
      ::slotted([slot="content"]) {
        padding: 0 1em;
        font-size: 0.85em;
        background-color: var(--lightNeutralColor);
        /* text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        */
      }
      @media screen and (max-width: 800px) {
        ::slotted([slot="content"]) {
          width: auto;
        }
      }
    `
  }

  render() {
    return html`
      <slot name="heading"></slot>
      <slot name="content"></slot>
    `
  }
}

customElements.define('vivo-search-sidebar-item', SearchSidebarItem);
