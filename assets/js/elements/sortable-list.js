import { LitElement, html, css } from "lit-element";

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
      sortItems: { type: Array },
      i18nItems: { type: Array },
      itemCount: { type: Number },
      truncatedItemCount: { type: Number },
      truncate: { type: Boolean, reflect: true },
      truncationRequired: { type: Boolean },
      sortProperty: { type: String },
      sortDirection: { type: String },
      sorts: { type: Array },
      i18n: { type: Object }
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
    this.sorts = [];
    this.i18n = {};

  }

  slotChanged(e) {
    const itemElements = Array.from(e.target.assignedNodes()).filter(
      (n) => n.tagName && (n.tagName != 'VIVO-SORT-OPTION' && n.tagName != 'VIVO-I18N-LABEL')
    ).map((n) => n.cloneNode(true));
    this.items = itemElements;
    this.setItems();

    const sortElements = Array.from(e.target.assignedNodes()).filter((n) => n.tagName && n.tagName == 'VIVO-SORT-OPTION').map((n) => n.cloneNode(true));
    this.sortItems = sortElements;
    this.setSortItems();

    const i18Elements = Array.from(e.target.assignedNodes()).filter((n) => n.tagName && n.tagName == 'VIVO-I18N-LABEL').map((n) => n.cloneNode(true));
    this.i18nItems = i18Elements;
    this.seti18Labels();
  }

  firstUpdated() {
    this.shadowRoot.addEventListener("slotchange", this.slotChanged);
  }

  connectedCallBack() {
    super.connectedCallBack();
  }

  disconnectedCallBack() {
    super.disconnectedCallBack();
  }

  setItems() {
    this.items = this.sortBy(this.items, this.sortProperty, this.sortDirection);
    this.setTruncation();
    this.refreshHides();
  }

  setSortItems() {
    this.sorts = this.sortItems.map(opt => {
      let label = opt.getAttribute("label");
      let field = opt.getAttribute("field");
      let direction = opt.getAttribute("direction");
      return { property: field, direction: direction, label: label }
    });;
  }

  seti18Labels() {
    this.i18nItems.forEach(opt => {
      const key = opt.getAttribute("key");
      const label = opt.getAttribute("label");
      this.i18n[key] = label;
    });
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

  selectSort(e) {
    let value = e.target.value;
    if (!value) {
      console.error('no value for sorter');
      return;
    }
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
    sortItems.sort((a, b) => {
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
    this.items.forEach((p, i) => {
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
      }
      .item-summary {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0.75em 0 0 0;
      }
      .items-shown-message {
        padding-bottom: 1em;
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

      /* https://www.filamentgroup.com/lab/select-css.html */ 
      select {
        display: inline-block;
        font-size: 16px;
        font-family: sans-serif;
        font-weight: 700;
        color: #444;
        line-height: 1.3;
        padding: .6em 1.4em .5em .8em;
        width: auto;
        max-width: 100%;
        box-sizing: border-box;
        margin: 0;
        border: 1px solid #aaa;
        box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
        border-radius: .5em;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        background-color: #fff;
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
          linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
        background-repeat: no-repeat, repeat;
        background-position: right .7em top 50%, 0 0;
        background-size: .65em auto, 100%;
      }
      .select::-ms-expand {
        display: none;
      }
      select:hover {
        border-color: #888;
      }
      select:focus {
        border-color: #aaa;
        box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
        box-shadow: 0 0 0 3px -moz-mac-focusring;
        color: #222;
        outline: none;
      }
      select option {
        font-weight:normal;
      }
      
      /* Support for rtl text, explicit support for Arabic and Hebrew */
      *[dir="rtl"] select, :root:lang(ar) select :root:lang(iw) select {
        background-position: left .7em top 50%, 0 0;
        padding: .6em .8em .5em 1.4em;
      }
      
      /* Disabled styles */
      select:disabled, select[aria-disabled=true] {
        color: graytext;
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22graytext%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
          linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
      }
      select:disabled:hover, select[aria-disabled=true] {
        border-color: #aaa;
      }
    `;
  }

  isSelected(option) {
    let flag = (`${this.sortProperty}-${this.sortDirection}` === `${option.property}-${option.direction}`);
    return flag;
  }

  render() {
    let showLabel = this.i18n['showing'] ? this.i18n['showing'] : '**i18n key not found**';
    let showingAllLabel = this.i18n['showing_all'] ? this.i18n['showing_all'] : '**i18n key not found**';

    return html`
      <div class="item-summary">
        ${this.truncationRequired && this.truncate ? html`
          <span>
            <span class="items-shown-message">
              ${showLabel} ${this.displayedItemCount} of ${this.itemCount} ${this.itemType}
            </span>
          </span>
        `
        : html`
          <span>
            <slot id="title" name="title"></slot>
            <span class="items-shown-message">
              ${showingAllLabel} ${this.itemCount} ${this.itemType}
            </span>
          </span>
        `}
        <span>
          ${this.sorts ? html`
          <select @change="${this.selectSort}" class="select-css">
              ${this.sorts.map((s) => html`<option ?selected=${this.isSelected(s)} value="${s.property}-${s.direction}">${s.label}</option>`)}
          </select>
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
