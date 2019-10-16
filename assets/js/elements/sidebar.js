import { LitElement, html, css } from "lit-element";

class Sidebar extends LitElement {

    static get styles() {
      return css`
        :host {
            display: block;
            box-sizing: border-box;
        }
        ::slotted(vivo-sidebar-item) {
            display: block;
            margin: 0.25em 0 0.25em 0;
        }
      `
    }
  
    render() {
      return html`
        <slot></slot>
      `
    }
  }
  
  customElements.define('vivo-sidebar', Sidebar);