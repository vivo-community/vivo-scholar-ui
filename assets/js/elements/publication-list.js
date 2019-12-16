import { LitElement, html, css } from "lit-element";
import '@vaadin/vaadin-select';

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
      truncate: { type: Boolean, reflect: true },
      truncationRequired: { type: Boolean },
      sortProperty: { type: String },
      sortDirection: { type: String }
    };
  }

  constructor() {
    super();
    this.truncate = true;
    this.truncationRequired = false;
    this.displayedPubCount = 25;
    this.publications = [];
    this.pubCount = 0;
    this.truncatedPubCount = 0;
    this.sortProperty = 'publishedDate';
    this.sortDirection = 'desc';
    this.slotChanged = this.slotChanged.bind(this);
  }

  slotChanged(e) {
    const pubElements = Array.from(e.target.assignedNodes()).filter((n) => n.tagName === 'VIVO-PUBLICATION').map((n) => n.cloneNode(true));
    this.publications = pubElements;
    this.setPublications();
  }

  firstUpdated() {
    this.shadowRoot.addEventListener("slotchange",this.slotChanged);
  }

  disconnectedCallBack() {
    super.disconnectedCallBack();
  }

  setPublications() {
    this.publications = this.sortBy(this.publications, this.sortProperty, this.sortDirection);
    this.setTruncation();
    this.refreshHides();
  }

  setTruncation() {
    this.pubCount = this.publications.length;
    if (this.pubCount > this.displayedPubCount) {
      this.truncatedPubCount = this.pubCount - this.displayedPubCount;
      this.truncationRequired = true;
    } else {
      this.truncatedPubCount = 0;
      this.truncationRequired = false;
    }
  }

  showTruncatedPubs(e) {
    this.truncate = false;
    this.refreshHides();
  }

  hideTruncatedPubs(e) {
    this.truncate = true;
    this.refreshHides();
  }

  selectSort({detail: {value}}) {
    this.setSort(value);
  }

  setSort(value) {
    const [property, direction] = value.split("-");
    this.sortProperty = property;
    this.sortDirection = direction;
    this.setPublications();
  }

  getSort() {
    return `${this.sortProperty}-${this.sortDirection}`;
  }

  sortBy(pubs, sortProperty, sortDirection) {
    const sortPubs = pubs.slice();
    sortPubs.sort((a,b) => {
      // send missing values to the bottom of the list regardless of sort order
      if (!a[sortProperty] && !b[sortProperty]) return 0
      if (!a[sortProperty]) return 1;
      if (!b[sortProperty]) return -1;
      if (sortDirection === 'asc') {
        return a[sortProperty] - b[sortProperty];
      }
      if (sortDirection === 'desc') {
        return b[sortProperty] - a[sortProperty];
      }
    });
    this.dispatchEvent(new CustomEvent('publicationsSorted', {
      detail: this,
      bubbles: true,
      cancelable: false,
      composed: true
    }));
    return sortPubs;
  }

  refreshHides() {
    this.publications.forEach((p,i) => {
      if (this.truncate) {
        if (i < this.displayedPubCount) {
          p.style.display = "block";
        } else {
          p.style.display = "none";
        }
      } else {
        p.style.display = "block";
      }
    });
  }

  showPublication(publicationUrl) {
    const pub = this.publications.find((p) => p.publicationUrl === publicationUrl)
    if (pub) {
      const isVisible = pub.getClientRects().length > 0;
      if (!isVisible) {
        this.showTruncatedPubs();
      }
      pub.scrollIntoView();
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      slot {
        display: none;
      }
      vivo-publication {
        margin-bottom: 1em;
      }
      vivo-publication {
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
        border: 1px solid var(--highlightColor);
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
        ${this.truncationRequired && this.truncate ? html`
          <span>
            <span class="pubs-shown-message">
              Showing ${this.displayedPubCount} of ${this.pubCount} publications
            </span>
          </span>
        `
        : html`
          <span>
            <slot id="title" name="title"></slot>
            <span class="pubs-shown-message">
              Showing all ${this.pubCount} publications
            </span>
          </span>
        `}
        <span>
          <vaadin-select value="${this.sortProperty}-${this.sortDirection}" @value-changed="${this.selectSort}">
            <template>
              <vaadin-list-box>
                <vaadin-item value="publishedDate-desc">Newest First</vaadin-item>
                <vaadin-item value="publishedDate-asc">Oldest First</vaadin-item>
              </vaadin-list-box>
            </template>
          </vaadin-select>
          ${this.truncationRequired && this.truncate ? html`
            <button @click="${this.showTruncatedPubs}">
              Show all ${this.pubCount} publications &gt;
            </button>
          `
          : html`
            ${this.truncatedPubCount > 0 ? html`
              <button @click="${this.hideTruncatedPubs}">
                &lt; Show fewer publications
              </button>
            ` : null}
          `}
        </span>
      </div>
      <div id="publications">
        ${this.publications}
      </div>
      <slot></slot>
    `;
  }

}

customElements.define("vivo-publication-list", PublicationList);
