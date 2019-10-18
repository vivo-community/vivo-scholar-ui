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
      truncatedAuthorCount: { type: Number },
      authorsExpanded: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.displayedAuthorCount = 2;
    this.authorCount = 0;
    this.truncatedAuthorCount = 0;
    this.slotChanged = this.slotChanged.bind(this);
    this.authorsExpanded = false;
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

  authorsToggle(e) {
    if (this.authorsExpanded) {
      console.log("should hide author list");
    } else {
      console.log("should show author list");
    }
    this.authorsExpanded = !this.authorsExpanded;
  }

  render() {
    // 1. if truncatedAuthorCount > 0 
    //    a. if authorsExpanded -> show whole list -> @click to collapse
    //    b. else -> show truncated list -> @click to expand
    // 2. else -> show list (no @click)
    //
    // not sure how to get 'original' content?
    // let slot = this.shadowRoot.querySelector("slot");
    // let postContent = () => {
    //  if(truncatedAuthorCount > 0) {
    //     if (this.authorsExpanded) {
    //       return `
    //         <span class="all-authors" @click="${this.authorToggle}"
    //           >${slot}
    //         >`
    //     } else {
    //       return `
    //         <span class="truncated-authors" @click="${this.authorToggle}"
    //           >+ ${this.truncatedAuthorCount} authors</span
    //          >`
    //     }
    //  } else {
    //     return null;
    //  }
    //}
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
            <span class="truncated-authors" @click="${this.authorsToggle}"
              >+ ${this.truncatedAuthorCount} authors</span
            >
          `
        : null}
    `;
  }
}

customElements.define("vivo-publication-author-list", PublicationAuthorList);
