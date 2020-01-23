import {LitElement, html, css } from "lit-element";

class Grant extends LitElement{
//this section for use with vivo-grant-list
  // static get properties() {
  //   return {
  //     id: { type: String },
  //     grantUrl: {
  //       attribute: "grant-url",
  //       type: String,
  //       reflect: true
  //     },
  //     grantDate: {
  //       attribute: "grant-date",
  //       converter: {
  //         fromAttribute: (value, type) => {
  //           if (value) {
  //             return new Date(value);
  //           }
  //         },
  //         toAttribute: (value, type) => {
  //           if (value) {
  //             return value.toISO8601;
  //           }
  //         }
  //       },
  //       reflect: true
  //     },
  //     onSelect: { type: Object }
  //   };
  // }

  static get styles() {
    return css `
      /* :host{
        display: block;
        border-top: 1px solid var(--lightNeutralColor);
        margin-bottom: 1em;
        margin-top: 1em;
        padding-top: 1em;
        font-size: 18px;
      } */
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
