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
        }
        .search-actions {
          display: flex;
          padding-top: 5px;
        }
        vivo-search-pagination-summary {
          flex-grow: 2;
          flex-basis: 65%;
        }
        vivo-search-sorter {
          flex-grow: 1;
          flex-basis:35%;
          text-align: right;
        }
      `
    }
  
    constructor() {
      super();
      this.graphql = pubQuery;
      // must set a default sort
      this.defaultSort = [{property: 'title', direction: "ASC"}];
      this.defaultBoosts = [{ field: "title", value: 2 }];

      this.active = false;

      this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
      this.handleSearchStarted = this.handleSearchStarted.bind(this);

      // FIXME: i18n problem
      this.sortOptions = [
        {label: 'Relevance', field: 'score', direction: "ASC"},
        {label: 'Title (Ascending)', field: 'title', 'direction': "ASC"},
        {label: 'Title (Descending)', field: 'title', 'direction': "DESC"},
        {label: 'Date (Ascending)', field: 'publicationDate', 'direction': "ASC"},
        {label: 'Date (Descending)', field: 'publicationDate', 'direction': "DESC"}
      ];

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
        _.each(content, function (item) {
          results.push(item);
        });
      }
      
      // FIXME: use arrow notation to get rid of _self?
      let _self = this;
      var resultsDisplay = html`<div class="publications">
        ${_.map(results, function (i) {
            return _self.renderPublication(i);
          })
        }
      </div>`;

      let pagination = html``;

      if (this.data) {
        pagination = html`<vivo-search-pagination 
              number="${this.data.documents.page.number}"
              size="${this.data.documents.page.size}"
              totalElements="${this.data.documents.page.totalElements}"
              totalPages="${this.data.documents.page.totalPages}"
          />`
      }

      let pagingSummary = html``;

      if (this.data) {
        pagingSummary = html`<vivo-search-pagination-summary
          number="${this.data.documents.page.number}"
          size="${this.data.documents.page.size}"
          totalElements="${this.data.documents.page.totalElements}"
          totalPages="${this.data.documents.page.totalPages}"
       />`
      }

      let selected = `${this.orders[0].property}-${this.orders[0].direction}`;

      let sorter = html``;
      if (this.data) {
          // make sorter
          sorter = html`<vivo-search-sorter
            selected=${selected}
            options=${JSON.stringify(this.sortOptions)}>
          </vivo-search-sorter>`
      }

 
      return html`
        <div id="publication-search-results">
          <div class="search-actions">
          ${pagingSummary}
          ${sorter}
          </div>
        ${resultsDisplay}
        ${pagination}
        </div>`
    }
  
  }
  
  customElements.define('vivo-publication-search', PublicationSearch);
  