import { LitElement, html, css } from "lit-element";

class Publication extends LitElement {

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
      publishedDate: {
        attribute: "published-date",
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
      }
      ::slotted([slot="title"]) {
        margin-bottom: 0.5em;
        font-weight: bold;
        color: var(--linkColor);
        text-decoration: none;
        font-size: 1.1em;
        line-height: 1.6;
      }
      ::slotted([slot="authors"]), ::slotted([slot="publisher"]) {
        padding-top: .5em;
        margin-right: 0.5em;
      }
      ::slotted([slot="date"]){
      }
      ::slotted([slot="date"])::before, ::slotted([slot="publisher"])::before  {
        content: '·';
        font-weight: bold;
        margin-right: 0.5em;
      }
      slot[name="abstract"] {
        display: block;
        margin-top: 0.5em;
        font-size: 0.75em;
      }
      slot[name="links"] {
        display: flex;
        flex-flow: row wrap;
        margin-top: 0.75em;
      }
      ::slotted([slot="links"]) {
        color: var(--darkNeutralColor);
        margin-right: 3em;
        white-space: nowrap;
      }
      @media (max-width: 800px) {
        ::slotted([slot="authors"]), ::slotted([slot="publisher"]), ::slotted([slot="date"]) {
          display: block;
        }
        ::slotted([slot="date"])::before, ::slotted([slot="publisher"])::before  {
          display: none;
        }
      }
    `;
  }

  handlePublicationClick(e) {
    this.dispatchEvent(new CustomEvent('publicationClicked', {
      detail: this,
      bubbles: true,
      cancelable: false,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="title">
        <slot name="title" @click="${this.handlePublicationClick}"></slot>
      </div>
      <slot name="authors"></slot>
      <slot name="publisher"></slot>
      <slot name="date"></slot>
      <slot name="abstract"></slot>
      <slot name="links"></slot>
    `;
  }
}

customElements.define("vivo-publication", Publication);
