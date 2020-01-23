import {LitElement, html, css } from "lit-element";

class Grant extends LitElement{

  static get styles() {
    return css `

      ::slotted([slot="label"]) {
          color: var(--linkColor);
          font-weight: bold;
          text-decoration: none;
        }
    `;
  }

  handleGrantClick(e) {
    this.dispatchEvent(new CustomEvent('grantClicked', {
      detail: this,
      bubbles: true,
      cancelable: false,
      composed: true
    }));
  }

  render() {
    return html `
    <div class="label">
      <slot name="label" @click="${this.handleGrantClick}"></slot>
    </div>
    <slot name="awardedBy"></slot>
    <slot name="date"></slot>
    `;
  }
}

customElements.define("vivo-grant", Grant);
