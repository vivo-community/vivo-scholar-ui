import { LitElement, html, css } from "lit-element";

class SiteHeader extends LitElement {

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-flow: row nowrap;
        margin: 0;
        padding: 0 50px;
        width: 100%;
        background-color: var(--primaryColor);
        color: white;
        height: 100px;
        justify-content: space-between;
        align-items: center;
      }
      #navigation {
        display: flex;
        flex-flow: row nowrap;
        color: white;
        justify-content: space-evenly;
      }
      ::slotted([slot="title"]) {
        font-size: 3em !important;
        margin: 0 !important;
      }
      ::slotted([slot="nav-item"]) {
        font-size: 1.5em;
        font-weight: bold;
        margin-right: 100px;
        text-decoration: none;
        color: white !important;
      }
    `
  }

  render() {
    return html`
      <slot name="title"></slot>
      <div id="navigation">
        <slot name="nav-item"></slot>
      </div>
    `
  }

}

customElements.define('vivo-site-header', SiteHeader);

