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
        margin-right: 3%;
      }
      slot[name="content"]{
        display: inline-block;
        width: 80%;
      }
      ::slotted([slot="title"]){
        font-weight: bold;
      }

      @media screen and (max-width: 800px) {
        :host{
          flex-direction: column;
        }
        slot[name="title"] {
          text-align: left;
          width: 100%;
        }
        slot[name="content"]{
          width: 100%;
          margin-bottom: 3%;
        }
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
