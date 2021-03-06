import { LitElement, html, css } from "lit-element";
import '@vaadin/vaadin-select';

class GrantList extends LitElement {
  static get properties() {
    return {
      displayedGrantCount: {
        attribute: "displayed-grant-count",
        type: Number,
        reflect: true
      },
      grants: { type: Array },
      grantCount: { type: Number },
      truncatedGrantCount: { type: Number },
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
    this.displayedGrantCount = 25;
    this.grants = [];
    this.grantCount = 0;
    this.truncatedGrantCount = 0;
    this.sortProperty = 'grantDate';
    this.sortDirection = 'desc';
    this.slotChanged = this.slotChanged.bind(this);
  }

  slotChanged(e) {
    const grantElements = Array.from(e.target.assignedNodes()).filter((n) => n.tagName === 'VIVO-GRANT').map((n) => n.cloneNode(true));
    this.grants = grantElements;
    this.setGrants();
  }

  firstUpdated() {
    this.shadowRoot.addEventListener("slotchange",this.slotChanged);
  }

  disconnectedCallBack() {
    super.disconnectedCallBack();
  }

  setGrants() {
    this.grants = this.sortBy(this.grants, this.sortProperty, this.sortDirection);
    this.setTruncation();
    this.refreshHides();
  }

  setTruncation() {
    this.grantCount = this.grants.length;
    if (this.grantCount > this.displayedGrantCount) {
      this.truncatedGrantCount = this.grantCount - this.displayedGrantCount;
      this.truncationRequired = true;
    } else {
      this.truncatedGrantCount = 0;
      this.truncationRequired = false;
    }
  }

  showTruncatedGrants(e) {
    this.truncate = false;
    this.refreshHides();
  }

  hideTruncatedGrants(e) {
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
    this.setGrants();
  }

  getSort() {
    return `${this.sortProperty}-${this.sortDirection}`;
  }

  sortBy(grants, sortProperty, sortDirection) {
    const sortGrants = grants.slice();
    sortGrants.sort((a,b) => {
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
    this.dispatchEvent(new CustomEvent('grantsSorted', {
      detail: this,
      bubbles: true,
      cancelable: false,
      composed: true
    }));
    return sortGrants;
  }

  refreshHides() {
    this.grants.forEach((g,i) => {
      if (this.truncate) {
        if (i < this.displayedGrantCount) {
          g.style.display = "block";
        } else {
          g.style.display = "none";
        }
      } else {
        g.style.display = "block";
      }
    });
  }

  showGrant(grantUrl) {
    const grant = this.grants.find((g) => g.grantUrl === grantUrl)
    if (grant) {
      const isVisible = grant.getClientRects().length > 0;
      if (!isVisible) {
        this.showTruncatedPubs();
      }
      grant.scrollIntoView();
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
      vivo-grant {
        margin-bottom: 1em;
        padding-top: 1em;
      }
      vivo-grant {
        font-size: 18px;
      }
      .grant-summary {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: baseline;
        padding: 0.75em 0;
      }
      .grants-shown-message {
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
      <div class="grant-summary">
        ${this.truncationRequired && this.truncate ? html`
          <span>
            <span class="grants-shown-message">
              Showing ${this.displayedGrantCount} of ${this.grantCount} grants
            </span>
          </span>
        `
        : html`
          <span>
            <slot id="label" name="label"></slot>
            <span class="grants-shown-message">
              Showing all ${this.grantCount} grants
            </span>
          </span>
        `}
        <span>
          <vaadin-select value="${this.sortProperty}-${this.sortDirection}" @value-changed="${this.selectSort}">
            <template>
              <vaadin-list-box>
                <vaadin-item value="grantDate-desc">Newest First</vaadin-item>
                <vaadin-item value="grantDate-asc">Oldest First</vaadin-item>
              </vaadin-list-box>
            </template>
          </vaadin-select>
          ${this.truncationRequired && this.truncate ? html`
            <button @click="${this.showTruncatedGrants}">
              Show all ${this.grantCount} grants &gt;
            </button>
          `
          : html`
            ${this.truncatedGrantCount > 0 ? html`
              <button @click="${this.hideTruncatedGrants}">
                &lt; Show fewer grants
              </button>
            ` : null}
          `}
        </span>
      </div>
      <div id="grants">
        ${this.grants}
      </div>
      <slot></slot>
    `;
  }

}

customElements.define("vivo-grant-list", GrantList);
