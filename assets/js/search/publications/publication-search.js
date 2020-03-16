import { LitElement, html, css } from "lit-element";

import pubQuery from "./publication-query";

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
        }
        vivo-filter-clearer {
          flex-grow: 2;
          flex-basis: 65%;
        }
        vivo-search-sorter {
          flex-grow: 1;
          flex-basis:35%;
        }
      `
    }
  
    constructor() {
      super();
      this.graphql = pubQuery;
      // must set a default sort
      this.defaultSort = [{property: 'title', direction: "ASC"}];
      this.active = false;

      this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
      this.handleSearchStarted = this.handleSearchStarted.bind(this);

      this.sortOptions = [
        {label: 'Title (asc)', field: 'title', 'direction': "ASC"},
        {label: 'Title (desc)', field: 'title', 'direction': "DESC"},
        {label: 'Date (asc)', field: 'publicationDate', 'direction': "ASC"},
        {label: 'Date (desc)', field: 'publicationDate', 'direction': "DESC"}
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
      // FIXME: shouldn't need to add code to do this check
      let data = e.detail;
      if (!data || !data.documents) {
          return;
      }
      this.data = data;
      // might be a new count in here
      var docCount = this.data ? this.data.documents.page.totalElements : 0;
      let tab = document.querySelector('#publication-search-count');
      tab.textContent = `${docCount}`;

    }
  
    renderPublisher(publisher) {
        if (publisher) {
            return html`
              <span slot="publisher">${publisher.label}</span>
            `
        }
    }

    renderAbstract(abstract) {
        if (abstract) {
            return html`
            <vivo-truncated-text slot="abstract">${abstract}</vivo-truncated-text>
            `
        }
    }

    renderAuthor(author) {
      return html`
      <vivo-publication-author profile-url="/entities/person/${author.id}">
        ${author.label}
      </vivo-publication-author>
    `
    }

    renderAuthors(authors) {
      if (authors) {
        return html`<vivo-publication-author-list slot="authors">
          ${authors.map((a) => this.renderAuthor(a))}
        </vivo-publication-author-list>
        `
      }
    }

    renderPublication(p) {
      let pubDate = new Date(p.publicationDate);
      let dateFormatted = pubDate.toLocaleDateString("en-US");

      return html`
        <vivo-publication publication-url="/entities/publication/${p.id}" 
          link-decorate="${this.linkDecorate}"
          published-date="${p.publicationDate}">
          <div slot="title">${p.title}</div>
          ${this.renderAuthors(p.authors)}
          ${this.renderPublisher(p.publisher)}
          <span slot="date">${dateFormatted}</span>
          ${this.renderAbstract(p.abstractText)}
        </vivo-publication>
        `;
    }

    render() {
      if (this.active == true && this.waiting == true) {
        return html`<vivo-search-spinner></vivo-search-spinner>`
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

      let selected = `${this.orders[0].property}-${this.orders[0].direction}`;

      let sorter = html``;
      if (this.data) {
          // make sorter
          sorter = html`<vivo-search-sorter
            selected=${selected}
            options=${JSON.stringify(this.sortOptions)}>
          </vivo-search-sorter>`
      }

      let clearer = html`<vivo-filter-clearer>
      </vivo-filter-clearer>`
 
      return html`
        <div id="publication-search-results">
          <div class="search-actions">
          ${clearer}
          ${sorter}
          </div>
        ${resultsDisplay}
        ${pagination}
        </div>`
    }
  
  }
  
  customElements.define('vivo-publication-search', PublicationSearch);
  