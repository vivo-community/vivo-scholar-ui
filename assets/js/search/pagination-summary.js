import { LitElement, html, css } from "lit-element";
import _ from "lodash";

import slicePages from '../lib/paging-helper';

import * as config from './config.js'
class SearchPaginationSummary extends LitElement {

  static get properties() {
    return {
      totalElements: { type: Number },
      totalPages: { type: Number },
      number: { type: Number },
      size: { type: Number },
      showingLabel: { type: String },
      ofLabel: { type: String }
    }
  }


  // FIXME: i18n problem
  render() {
    let pagingText = html``;

    let total = this.totalElements;
    let start = (this.size*this.number) + 1;
    let end = start+this.size;
    end = end > total ? total : end;
    let rangeText = `${start}-${end}`;
    pagingText = html`<span>${this.showingLabel} ${rangeText} ${this.ofLabel} ${total}</span>`  

    return html`${pagingText}`
  }
}

customElements.define('vivo-search-pagination-summary', SearchPaginationSummary);
