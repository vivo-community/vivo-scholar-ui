import {LitElement, html, css } from "lit-element";

class Grant extends LitElement{


  static get styles() {
    return css `
      :host{
        display: block;
        border-top: 1px solid var(--lightNeutralColor);
        margin-bottom: 1em;
        margin-top: 1em;
        padding-top: 1em;
        font-size: 18px;
      }

    ::slotted([slot="label"]) {
        color: var(--linkColor);
        font-weight: bold;
        text-decoration: none;
      }

    `;
  }

  render() {
    return html `
      <slot name="label"></slot>
      <slot name="awardedBy"></slot>
      <slot name="date"></slot>
    `;
  }
}

customElements.define("vivo-grant", Grant);
