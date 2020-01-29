import { LitElement, html, css } from "lit-element";
import '@vaadin/vaadin-select';

class SortableList extends LitElement {
  static get properties() {
    return {
      displayedItemCount: {
        attribute: "displayed-item-count",
        type: Number,
        reflect: true
      },
      itemType: {
        attribute: "item-type",
        type: String,
        reflect: true
      },
      items: { type: Array },
      itemCount: { type: Number },
      truncatedItemCount: { type: Number },
      truncate: { type: Boolean, reflect: true },
      truncationRequired: { type: Boolean },
      sortProperty: { type: String },
      sortDirection: { type: String },
      sorts: {type: Object}
  };
}

  constructor() {
    super();
    this.truncate = true;
    this.truncationRequired = false;
    this.displayedItemCount = 25;
    this.items = [];
    this.itemCount = 0;
    this.truncatedItemCount = 0;
    this.sortProperty = null;
    this.sortDirection = null;
    this.slotChanged = this.slotChanged.bind(this);
    this.itemType = 'items';
    this.sorts = null
  }

  slotChanged(e) {
    const itemElements = Array.from(e.target.assignedNodes()).filter((n) => n.tagName ).map((n) => n.cloneNode(true));
    this.items = itemElements;
    this.setItems();
  }

  firstUpdated() {
    this.shadowRoot.addEventListener("slotchange",this.slotChanged);
  }

  disconnectedCallBack() {
    super.disconnectedCallBack();
  }


  setItems() {
    this.items = this.sortBy(this.items, this.sortProperty, this.sortDirection);
    this.setTruncation();
    this.refreshHides();
  }

  setTruncation() {
    this.itemCount = this.items.length;
    if (this.itemCount > this.displayedItemCount) {
      this.truncatedItemCount = this.itemCount - this.displayedItemCount;
      this.truncationRequired = true;
    } else {
      this.truncatedItemCount = 0;
      this.truncationRequired = false;
    }
  }

  showTruncatedItems(e) {
    this.truncate = false;
    this.refreshHides();
  }

  hideTruncatedItems(e) {
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
    this.setItems();
  }

  getSort() {
    return `${this.sortProperty}-${this.sortDirection}`;
  }

  sortBy(items, sortProperty, sortDirection) {
    const sortItems = items.slice();
      sortItems.sort((a,b) => {
        // send missing values to the bottom of the list regardless of sort order
        if (!a[sortProperty] && !b[sortProperty]) return 0;
        if (!a[sortProperty]) return 1;
        if (!b[sortProperty]) return -1;
        if (sortDirection === 'asc') {
          if (a[sortProperty] == b[sortProperty]) return 0;
          if (a[sortProperty] > b[sortProperty]) return 1;
          if (a[sortProperty] < b[sortProperty]) return -1;
        }
        if (sortDirection === 'desc') {
          if (a[sortProperty] == b[sortProperty]) return 0;
          if (a[sortProperty] < b[sortProperty]) return 1;
          if (a[sortProperty] > b[sortProperty]) return -1;
        }
      });
    this.dispatchEvent(new CustomEvent('itemsSorted', {
      detail: this,
      bubbles: true,
      cancelable: false,
      composed: true
    }));
    return sortItems;
  }

  refreshHides() {
    this.items.forEach((p,i) => {
      if (this.truncate) {
        if (i < this.displayedItemCount) {
          p.style.display = "block";
        } else {
          p.style.display = "none";
        }
      } else {
        p.style.display = "block";
      }
    });
  }

  showItem(itemUrl) {
    const item = this.items.find((p) => p.itemUrl === itemUrl)
    if (item) {
      const isVisible = item.getClientRects().length > 0;
      if (!isVisible) {
        this.showTruncatedItems();
      }
      item.scrollIntoView();
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

      #items > * {
        margin-bottom: 1em;
        font-size: 18px;
        border-top: 1px solid var(--lightNeutralColor);
      }
      .item-summary {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: baseline;
        padding: 0.75em 0;
      }
      .items-shown-message {
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
      <div class="item-summary">
        ${this.truncationRequired && this.truncate ? html`
          <span>
            <span class="items-shown-message">
              Showing ${this.displayedItemCount} of ${this.itemCount} ${this.itemType}
            </span>
          </span>
        `
        : html`
          <span>
            <slot id="title" name="title"></slot>
            <span class="items-shown-message">
              Showing all ${this.itemCount} ${this.itemType}
            </span>
          </span>
        `}
        <span>
          ${this.sorts ? html`
          <vaadin-select value="${this.sortProperty}-${this.sortDirection}" @value-changed="${this.selectSort}">
          <template>
            <vaadin-list-box>
              ${this.sorts.map((s) => html`<vaadin-item value="${s.property}-${s.direction}">${s.label}</vaadin-item>`)}
            </vaadin-list-box>
          </template>
          </vaadin-select>
          ` : null}
          ${this.truncationRequired && this.truncate ? html`
            <button @click="${this.showTruncatedItems}">
              Show all ${this.itemCount} ${this.itemType} &gt;
            </button>
          `
          : html`
            ${this.truncatedItemCount > 0 ? html`
              <button @click="${this.hideTruncatedItems}">
                &lt; Show fewer ${this.itemType}
              </button>
            ` : null}
          `}
        </span>
      </div>
      <div id="items">
        ${this.items}
      </div>
      <slot></slot>
    `;
  }

}

customElements.define("vivo-sortable-list", SortableList);
