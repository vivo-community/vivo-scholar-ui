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
1. if text? in slot more than max-lenght characters
2. hide with ... (More) button link
*/