import { LitElement, html, css } from "lit-element";

class SidebarItem extends LitElement {

  static get styles() {
    return css`
      :host {
        display: inline-block;
        box-sizing: border-box;
        margin: 0;
      }
      ::slotted([slot="heading"]) {
        padding: 0.5em;
        margin: 0.5em 0 0.5em 0;
        font-size: var(--sidebar-heading-font-size, 12px);
        background-color: var(--highlightBackgroundColor);
      }
      ::slotted([slot="content"]) {
        padding: 0.25em;
        margin: 0.25em 0 0.25em 0;
        font-size: var(--sidebar-content-font-size, 10px);
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

customElements.define('vivo-sidebar-item', SidebarItem);

