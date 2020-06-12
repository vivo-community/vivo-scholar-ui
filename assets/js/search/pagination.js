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
      pageGrouping: { type: Number },
      labels: { type: String }
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
      @media screen and (max-width: 1000px) {
        :host {
          font-size: 0.9em;
        }
        li a {
          padding: 4px 10px;
        }
      }   

    `
  }

  constructor() {
    super();
    this.handlePageSelected = this.handlePageSelected.bind(this);
    this.pageGrouping = config.PAGE_GROUPING;

    this.coordinator = this.closest('vivo-search-coordinator');
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
    // defaults?
    let nextLabel = this.coordinator.getLabel("next");
    let previousLabel = this.coordinator.getLabel("previous");

    let { previous, pageList, next } = slicePages(this.totalPages, this.number, this.pageGrouping)

    let callback = this.handlePageSelected;
    
    var pages = html`<div>
      ${pageList.map(i => {
        // 0 based, so +1 to display
        let active = (i == (this.number));
        return html`<li ?active=${active}>
            <a value="${i}" @click=${callback}>${i + 1}</a>
          </li>`
        })
      }
    </div>`

    let _self = this;
    let previousLink = function () {
      if (previous.display) {
        return html`<li>
             <a value="${previous.start}" @click=${callback}><span>«</span> ${previousLabel}</a>
           </li>`
      }
    };

    let nextLink = function () {
      if (next.display) {
        return html`<li>
              <a value="${next.start}" @click=${callback}>${nextLabel} <span>»</span></a>
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
