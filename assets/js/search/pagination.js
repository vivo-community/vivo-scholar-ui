import { LitElement, html, css } from "lit-element";
import _ from "lodash";

import pageArrays from '../lib/paging-helper';

class SearchPagination extends LitElement {

  static get properties() {
    return {
      totalElements: { type: Number },
      totalPages: { type: Number },
      number: { type: Number },
      size: { type: Number }
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
    `
  }
  constructor() {
    super();
    this.handlePageSelected = this.handlePageSelected.bind(this);
  }

  handlePageSelected(e) {
    var page = e.target.getAttribute("value");

    this.dispatchEvent(new CustomEvent('pageSelected', {
      detail: { value: page },
      bubbles: true,
      cancelable: false,
      composed: true
    }));
  }
  // TODO: need some kind of event for paging - which
  // then sends page to search to re-filter
  render() {
    let paging = pageArrays(this.totalPages, this.number, this.size);
    /* might look like this (for example):
    [ 
      [ '-' ],
      [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
      [ '+', 16 ] 
    ]
    */
    let previous = paging[0];
    let next = paging[2];
    let pageList = paging[1];

    let callback = this.handlePageSelected;
    var pages = html`<div>
      ${_.map(pageList, function (i) {
      return html`<li>
            <a value="${i - 1}" @click=${callback}>
              ${i}
            </a>
          </li>`
    })
      }
    </div>`


    var previousLink = function () {
      if (previous[0] != '-') {
        return html`<li>
             <a value="${previous[1] - 1}" @click=${callback}>
               ${previous[1]}
             </a>
           </li>`
      }
    };

    var nextLink = function () {
      if (next[0] != '-') {
        return html`<li>
              <a value="${next[1] - 1}" @click=${callback}>
                ${previous[1]}
              </a>
            </li>`
      }
    };

    return html`
      <ul>
        ${previousLink()}
        ${pages}
        ${nextLink()}
      </ul>
    `
  }
}

customElements.define('vivo-search-pagination', SearchPagination);
