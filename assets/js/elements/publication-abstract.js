import { LitElement, html, css } from "lit-element";

class PublicationAbstract extends LitElement {
  static get properties() {
    return {
      maxLength: { attribute: "max-length", type: Number }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

customElements.define("vivo-publication-abstract", PublicationAbstract);
/*
TODO: 
1. if text? in slot more than max-length characters - or slot takes up
   some amount of height/width ???
2. hide with ... and a (More) button link
3. click button to show rest (toggle? or not)

e.g.
html`<span>...</span><a @click="${this.clickHandler}">(More)</a>`

*/