import { LitElement, html, css } from "lit-element";
import _ from "lodash";

import slicePages from '../lib/paging-helper';

import * as config from './config.js'
class SearchPagination extends LitElement {

  static get properties() {
    return {
      totalElements: { type: Number },
      totalPages: { type: Number },
      number: { type: Number },
      size: { type: Number },
      pageGrouping: { type: Number }
    }
  }

  static get styles() {
    // TODO: should make link color etc...
    return css`
      a:hover {
          cursor: pointer;
      }
      a {
          text-decoration: underline;
      }
      :host {
        display: block;
      }
      div {
        clear: both;
      }
      ul {
        display: flex;
        flex-wrap: nowrap;
        padding-left: 0;
        margin: 20px 0;
        border-radius: 4px;
      }
      li {
        display: inline;
      }
      li a {
        /* FIXME: use theme colors etc... */
        padding: 6px 12px;
        color: #337ab7;
        background-color: #fff;
        border: 1px solid #ddd;
        flex-grow: 1;
      }
      li[active=""] > a {
        background-color: #337ab7;
        color: #fff;
      }
    `
  }

  constructor() {
    super();
    this.handlePageSelected = this.handlePageSelected.bind(this);
    this.pageGrouping = config.PAGE_GROUPING;
  }

  handlePageSelected(e) {
    var page = e.target.getAttribute("value");

    this.dispatchEvent(new CustomEvent('pageSelected', {
      detail: { value: page },
      bubbles: true,
      cancelable: true,
      composed: true
    }));
  }

  render() {
    let { previous, pageList, next } = slicePages(this.totalPages, this.number, this.pagesGrouping)

    let callback = this.handlePageSelected;
    
    var pages = html`<div>
      ${pageList.map(i => {
        // 0 based, so +1
        let active = (i == (this.number + 1));
        return html`<li ?active=${active}>
            <a value="${i - 1}" @click=${callback}>
              ${i}
            </a>
          </li>`
        })
      }
    </div>`


    var previousLink = function () {
      if (previous.display) {
        return html`<li>
             <a value="${previous.start - 1}" @click=${callback}>
               <span>«</span> Previous
             </a>
           </li>`
      }
    };

    var nextLink = function () {
      if (next.display) {
        return html`<li>
              <a value="${next.start - 1}" @click=${callback}>
                Next <span>»</span>
              </a>
            </li>`
      }
    };

    let totalPages = this.totalPages;
    var pagingCombined = function() {
      if (totalPages > 1) {
        return html`<ul>
          ${previousLink()}
          ${pages}
          ${nextLink()}
        </ul>`
      }
    };

    return html`${pagingCombined()}`
  }
}

customElements.define('vivo-search-pagination', SearchPagination);
