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
        padding: 4px;
      }
      :host([link-decorate="true"]) .title a {
        text-decoration: underline;
      }
      .title {
        margin-bottom: 8px;
        font-weight: bold;
        color: var(--linkColor);
      }
      .title a {
        text-decoration: none;
        background-color: transparent;
        color: var(--linkColor);
      }
      ::slotted([slot="abstract"]) {
        /* padding: 0.5em; */
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
      <slot name="abstract">[Placeholder Abstract]</slot>
      <slot name="links"></slot>
    `;
  }
}

customElements.define("vivo-publication", Publication);
/*
TODO:
1. abstract needs (More...) link - > ? # of characters? 318?
2. publication Full Text, Open Access, Link to Item, Cite links
3. journal name?

*/