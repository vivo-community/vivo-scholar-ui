import { LitElement, html, css } from "lit-element";

import pubQuery from "./publication-query";

import './publication-card';
import Searcher from '../searcher.js'

class PublicationSearch extends Searcher(LitElement) {

    static get properties() {
      return {
        graphql: { type: Object },
        implements: { type: String, attribute: true, reflect: true }
      }
    }
  
    static get styles() {
      return css`
        :host {
          display: block;
          clear: both;
        }
        .publications {
          display: block; 
          padding: 1em;
          padding-top: 0.4em;
        }
        .search-actions {
          display: flex;
          padding-top: 5px;
        }
        vivo-search-pagination-summary {
          flex-grow: 2;
          flex-basis: 65%;
        }
        ::slotted(vivo-search-sort-options) {
          flex-grow: 1;
          flex-basis:35%;
          text-align: right;
        }
        @media screen and (max-width: 1000px) {
          .publications {
              padding-left: 0;
              padding-right: 0;
          }
          .search-actions {
              display: flex;
              flex-direction: column;
              padding-left: 0;
              padding-right: 0;
          }
          ::slotted(vivo-search-sort-options) {
              flex-basis: auto;
              flex-grow: 1;
              text-align: left;
          }
          ::slotted(vivo-pagination-summary) {
             flex-basis; auto;
             flex-grow: 1;
          }
      }
      `
    }
  
    constructor() {
      super();
      this.graphql = pubQuery;
      this.defaultBoosts = [{ field: "title", value: 2 }];
      this.active = false;

      this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
      this.handleSearchStarted = this.handleSearchStarted.bind(this);
      this.setUp();
    }
  
    firstUpdated() {
      document.addEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      document.addEventListener('searchStarted', this.handleSearchStarted);
    }
  
    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener('searchResultsObtained', this.handleSearchResultsObtained);        
      document.removeEventListener('searchStarted', this.handleSearchStarted);
    }
  
    handleSearchStarted(e) {
      this.waiting = true;
    }

    handleSearchResultsObtained(e) {
      this.waiting = false;
      let data = e.detail;
      // FIXME: shouldn't (in theory) need to check data, but getting null sometimes
      if (!data || !data.documents) {
          return;
      }
      this.data = data;
      // might be a new count in here
      var docCount = this.data ? this.data.documents.page.totalElements : 0;
      let tab = document.querySelector('#publication-search-count');
      tab.textContent = `${docCount}`;
    }
  
    renderPublication(p) {
      // TODO: not crazy about having to use JSON.stringify here
      return html`
      <vivo-publication-card publication="${JSON.stringify(p)}"></vivo-publication-card>
      `
    }

    setPagination() {
      // set all properties
      let props = {
        number: this.data.documents.page.number,
        size: this.data.documents.page.size,
        totalElements: this.data.documents.page.totalElements,
        totalPages: this.data.documents.page.totalPages
      };
      let pager = this.querySelector('vivo-search-pagination');
      if(pager) { Object.assign(pager, props) };
      let summary = this.querySelector('vivo-search-pagination-summary');
      if(summary) { Object.assign(summary, props) };
    }

    render() {
      if (this.active == true && this.waiting == true) {
        return html``
      }
      if (!this.active || !this.data || !this.data.documents) {
        return html``
      }
      
      var results = [];

      if (this.data && this.data.documents.content) {
        let content = this.data.documents.content;
        content.forEach((item) => {
          results.push(item);
        });
      }
      
      var resultsDisplay = html`<div class="publications">
        ${results.map((i) => {
            return this.renderPublication(i);
          })
        }
      </div>`;

      this.setPagination();

      return html`
        <div id="publication-search-results">
          <div class="search-actions">
            <slot name="pagination-summary"></slot>
            <slot name="sorter"></slot>
          </div>
        ${resultsDisplay}
        <slot name="pagination"></slot>
        </div>`
    }
  
  }
  
  customElements.define('vivo-publication-search', PublicationSearch);
  