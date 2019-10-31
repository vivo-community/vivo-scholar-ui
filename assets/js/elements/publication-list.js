import { LitElement, html, css } from "lit-element";

class PublicationList extends LitElement {
  static get properties() {
    return {
      displayedPubCount: {
        attribute: "displayed-pub-count",
        type: Number,
        reflect: true
      },
      pubCount: { type: Number },
      truncatedPubCount: { type: Number }
    };
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
        border: 1px solid lightgray;
      }
    `;
  }
  constructor() {
    super();
    this.displayedPubCount = 3;
    this.pubCount = 0;
    this.truncatedPubCount = 0;
    this.slotChanged = this.slotChanged.bind(this);
  }

  firstUpdated() {
    let slot = this.shadowRoot.querySelector("slot");
    slot.addEventListener("slotchange", this.slotChanged);
  }

  slotChanged(e) {
    this.pubCount = Array.from(e.target.assignedElements()).length;
    if (this.pubCount > this.displayedPubCount) {
      this.truncatedPubCount = this.pubCount - this.displayedPubCount;
    } else {
      this.truncatedPubCount = 0;
    }
  }

  showAllPubs(e) {
    let pubs = this.querySelectorAll('vivo-publication');
    pubs.forEach((t) => t.style.display = "block");
  }

  render() {
    console.log(`pubCount=${this.pubCount}`);
    return html`
      <style type="text/css">
      ::slotted(vivo-publication:nth-child(n
            + ${this.displayedPubCount + 1})) {
        display: none;
      }
      .pub-summary {
        display: flex;
        padding: 0.25em;
        margin-bottom: 1em;
      }
      .pubs-shown-message {
        flex: 1;
        padding-top: 0.5em;
        padding-bottom: 0.5em;
        color: var(--darkNeutralColor, inherit);
      }
      .show-all-pubs {
         color: white;
         background-color: var(--highlightColor);
         padding: 0.5em;
         cursor: pointer;
      }
      </style>
    ${this.truncatedPubCount > 0
        ? html`
          <div class="pub-summary">
          <span class="pubs-shown-message"
            >Showing ${this.displayedPubCount} featured publications
          </span>
          <span class="show-all-pubs" @click="${this.showAllPubs}"
            >Show all ${this.truncatedPubCount} publications ></span
          >
          </div>
        `
        : null}
      <slot />
    `;
  }
}

customElements.define("vivo-publication-list", PublicationList);