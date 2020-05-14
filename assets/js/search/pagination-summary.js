import { LitElement, html, css } from "lit-element";
import _ from "lodash";

class SearchPaginationSummary extends LitElement {

  static get properties() {
    return {
      totalElements: { type: Number },
      totalPages: { type: Number },
      number: { type: Number },
      size: { type: Number }
    }
  }

  constructor() {
    super();
    this.coordinator = this.closest('vivo-search-coordinator');
  }

  static get styles() {
    // TODO: should make link color etc...
    return css`
    @media screen and (max-width: 1000px) {
      span {
        display:none;
        font-size: 0.85em;
      }
    }   
    `
  }

  render() {
    let pagingText = html``;

    let total = this.totalElements;
    let start = (this.size*this.number) + 1;
    let end = start+this.size;
    end = end > total ? total : end;
    let rangeText = `${start}-${end}`;

    let showingLabel = this.coordinator.getLabel("showing");
    let ofLabel = this.coordinator.getLabel("of");
    pagingText = html`<span>${showingLabel} ${rangeText} ${ofLabel} ${total}</span>`  

    return html`${pagingText}`
  }
}

customElements.define('vivo-search-pagination-summary', SearchPaginationSummary);
