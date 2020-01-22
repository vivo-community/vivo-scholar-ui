import { LitElement, html, css } from "lit-element";

class ListItem extends LitElement {

  static get properties() {
    return {
      id: { type: String },
      itemUrl: {
        attribute: "item-url",
        type: String,
        reflect: true
      },
      itemDate: {
        attribute: "item-date",
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
    return css`
      :host {
        display: block;
        padding-top: 1em;
      }
    `;
  }

  render() {
    return html`
    <slot></slot>
    `;
  }
}

customElements.define("vivo-list-item", ListItem)
