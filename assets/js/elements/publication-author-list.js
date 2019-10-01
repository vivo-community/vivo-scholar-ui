import { LitElement, html, css } from "lit-element";

class PublicationAuthorList extends LitElement {
  static get properties() {
    return {
      displayedAuthorCount: {
        attribute: "displayed-author-count",
        type: Number,
        reflect: true
      },
      authorCount: { type: Number },
      truncatedAuthorCount: { type: Number }
    };
  }

  constructor() {
    super();
    this.displayedAuthorCount = 2;
    this.authorCount = 0;
    this.truncatedAuthorCount = 0;
    this.slotChanged = this.slotChanged.bind(this);
  }

  firstUpdated() {
    let slot = this.shadowRoot.querySelector("slot");
    slot.addEventListener("slotchange", this.slotChanged);
  }

  slotChanged(e) {
    this.authorCount = Array.from(e.target.assignedElements()).length;
    if (this.authorCount > this.displayedAuthorCount) {
      this.truncatedAuthorCount = this.authorCount - this.displayedAuthorCount;
    } else {
      this.truncatedAuthorCount = 0;
    }
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        margin: 0;
        padding: 0;
      }
      ::slotted(vivo-publication-author):after {
        content: "; ";
      }
    `;
  }

  render() {
    return html`
      <style type="text/css">
        ::slotted(vivo-publication-author:nth-child(n
              + ${this.displayedAuthorCount})):after {
          content: "";
        }
        ::slotted(vivo-publication-author:nth-child(n
              + ${this.displayedAuthorCount + 1})) {
          display: none;
        }
      </style>
      <slot></slot>
      ${this.truncatedAuthorCount > 0
        ? html`
            <span class="truncated-authors"
              >+ ${this.truncatedAuthorCount} authors</span
            >
          `
        : null}
    `;
  }
}

customElements.define("vivo-publication-author-list", PublicationAuthorList);
