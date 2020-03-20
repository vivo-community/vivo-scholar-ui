import { LitElement, html, css } from "lit-element";

class EntityItem extends LitElement {

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-flow: row wrap;
        margin-top: 2%;
      }
      slot[name="title"] {
        display: inline-block;
        width: 15%;
        text-align: right;
        margin-right: 5%;
      }
      slot[name="content"]{
        display: inline-block;
        width: 70%;
      }
      ::slotted([slot="title"]){
        font-weight: bold;
      }

    `
  }

  render() {
    return html`
      <slot name="title"></slot>
      <slot name="content"></slot>
    `
  }

}

customElements.define('vivo-entity-item', EntityItem);
