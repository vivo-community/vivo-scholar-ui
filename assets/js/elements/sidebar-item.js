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
        background-color: var(--highlightBackgroundColor);
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

