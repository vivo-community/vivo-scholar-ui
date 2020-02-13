import { LitElement, html, css } from "lit-element";

class SidebarItem extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        box-sizing: border-box;
        margin: 0;
      }
      ::slotted([slot="heading"]) {
        padding: .5em 1em;
        background-color: var(--highlightBackgroundColor);
      }
      ::slotted([slot="content"]) {
        padding: .5em 1em;
        font-size: 0.85em;
        background-color: var(--lightNeutralColor);
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
