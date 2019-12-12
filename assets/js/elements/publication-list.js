import { LitElement, html, css } from "lit-element";

class PublicationList extends LitElement {
  static get properties() {
    return {
      displayedPubCount: {
        attribute: "displayed-pub-count",
        type: Number,
        reflect: true
      },
      publications: { type: Array },
      pubCount: { type: Number },
      truncatedPubCount: { type: Number },
      truncate: { type: Boolean, reflect: true }
    };
  }

  constructor() {
    super();
    this.truncate = true;
    this.displayedPubCount = 25;
    this.publications = [];
    this.pubCount = 0;
    this.truncatedPubCount = 0;
    this.slotChanged = this.slotChanged.bind(this);
  }

  firstUpdated() {
    let slot = this.shadowRoot.querySelector("slot#publications");
    slot.addEventListener("slotchange", this.slotChanged);
  }

  slotChanged(e) {
    this.publications = Array.from(e.target.assignedElements());
    this.pubCount = this.publications.length;
    if (this.pubCount > this.displayedPubCount) {
      this.truncatedPubCount = this.pubCount - this.displayedPubCount;
      this.truncate = true;
      this.hideTruncatedPubs();
    } else {
      this.truncatedPubCount = 0;
      this.truncate = false;
    }
  }

  showTruncatedPubs(e) {
    let pubs = this.querySelectorAll('vivo-publication');
    pubs.forEach((t) => t.style.display = "block");
    this.truncate = false;
  }

  hideTruncatedPubs(e) {
    this.truncatedPubCount = this.pubCount - this.displayedPubCount;
    let displayedPubs = this.querySelectorAll(`vivo-publication:nth-of-type(-n + ${this.displayedPubCount}`);
    displayedPubs.forEach((t) => t.style.display = "block");
    let truncatedPubs = this.querySelectorAll(`vivo-publication:nth-of-type(n + ${this.displayedPubCount + 1}`);
    truncatedPubs.forEach((t) => t.style.display = "none");
    this.truncate = true;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      ::slotted(vivo-publication) {
        margin-bottom: 1em;
      }
      ::slotted(vivo-publication) {
        font-size: var(--publication-font-size, 18px);
        border-top: 1px solid var(--lightNeutralColor);
      }
      .pub-summary {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: baseline;
        padding: 0.75em 0;
      }
      .pubs-shown-message {
        padding-top: 0.5em;
        padding-bottom: 0.5em;
        color: var(--darkNeutralColor, inherit);
        white-space: nowrap;
      }
      button {
        border: none;
        color: white;
        background-color: var(--highlightColor);
        padding: 0.75em;
        cursor: pointer;
        white-space: nowrap;
      }
    `;
  }

  render() {
    return html`
      <div class="pub-summary">
        ${this.truncate ? html`
          <span>
            <span class="pubs-shown-message">
              Showing ${this.displayedPubCount} of ${this.pubCount} publications
            </span>
          </span>
          <button @click="${this.showTruncatedPubs}">
            Show all ${this.pubCount} publications &gt;
          </button>
        `
        : html`
          <span>
            <slot id="title" name="title"></slot>
            <span class="pubs-shown-message">
              Showing all ${this.pubCount} publications
            </span>
          </span>
          ${this.truncatedPubCount > 0 ? html`
            <button @click="${this.hideTruncatedPubs}">
              &lt; Show fewer publications
            </button>
          ` : null}
        `}
      </div>
      <slot id="publications"></slot>
    `;
  }

}

customElements.define("vivo-publication-list", PublicationList);
