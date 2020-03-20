import { LitElement, html, css } from "lit-element";

class Entity extends LitElement {

  static get styles() {
    return css`
      :host {
        margin: 5%;
        padding: 0 10%;
      }


    `
  }

  render() {
    return html`
      <slot></slot>
    `
  }

}

customElements.define('vivo-entity', Entity);
