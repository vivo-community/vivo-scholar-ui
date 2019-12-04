import { LitElement, html, css } from "lit-element";

class Publication extends LitElement {
  static get properties() {
    return {
      publicationUrl: {
        attribute: "publication-url",
        type: String,
        reflect: true
      }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding-top: 1em;
      }
      :host([link-decorate="true"]) .title a {
        text-decoration: underline;
      }
      .title {
        margin-bottom: 0.5em;
        font-weight: bold;
        color: var(--linkColor);
      }
      .title a {
        text-decoration: none;
        background-color: transparent;
        color: var(--linkColor);
      }
      ::slotted([slot="authors"]), ::slotted([slot="publisher"]) {
        margin-right: 0.5em;
      }
      ::slotted([slot="date"])::before, ::slotted([slot="publisher"])::before  {
        content: '·';
        font-weight: bold;
        margin-right: 0.5em;
      }
      slot[name="abstract"] {
        display: block;
        margin-top: 0.5em;
      }
      slot[name="links"] {
        display: flex;
        flex-flow: row wrap;
        margin-top: .75em;
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

  render() {
    return html`
      <div class="title">
        ${this.publicationUrl
          ? html`
              <a href="${this.publicationUrl}">
                <slot name="title"></slot>
              </a>
            `
          : html`
              <slot name="title"></slot>
            `}
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
