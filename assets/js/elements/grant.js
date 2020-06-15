import {LitElement, html, css } from "lit-element";

class Grant extends LitElement{

  static get properties() {
    return {
      id: { type: String },
      url: {
        attribute: "url",
        type: String,
        reflect: true
      },
      title: {
        attribute: "title",
        converter: {
          fromAttribute: (value, type) => {
            if (value) {
              let newValue = value.toUpperCase();
              return newValue;
            }
          },
          toAttribute: (value, type) => {
            if (value) {
              return value;
            }
          }
        },
        reflect: true
      },
      startDate: {
        attribute: "start-date",
        converter: {
          fromAttribute: (value, type) => {
            if (value) {
              return new Date(value);
            }
          },
          toAttribute: (value, type) => {
            if (value) {
              return value.toISO8601;
            }
          }
        },
        reflect: true
      },
      onSelect: { type: Object }
    };
  }


  static get styles() {
    return css `
      :host {
        display: block;
        line-height: 1.6;
      }
      ::slotted([slot="label"]) {
          color: var(--linkColor);
          font-weight: bold;
          text-decoration: none;
          font-size: 1.1em;
          margin-bottom: 1em;
        }
      ::slotted([slot="awardedBy"]){
        font-size: 0.75em;
      }
      ::slotted([slot="date"]){
        font-size: 0.75em;
      }
      ::slotted([slot="date"])::before {
        content: '·';
        font-weight: bold;
        margin-right: 0.5em;
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
