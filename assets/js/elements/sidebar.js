import { LitElement, html, css } from "lit-element";

class Sidebar extends LitElement {

    static get styles() {
      return css`
        :host {
            display: block;
            box-sizing: border-box;
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
