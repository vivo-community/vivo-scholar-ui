import { LitElement, html, css } from "lit-element";

import pubQuery from "./publication-query";

import Searcher from '../searcher.js'

class PublicationSearch extends Searcher(LitElement) {
//class PublicationSearch extends LitElement {

    // NOTE: this 'query' is the graphql statement
    // not crazy about JSON.stringify below for setting that attribute
    // (see <vivo-search graphql=${JSON.stringify(this.query)}>)
    static get properties() {
      return {
        graphql: { type: Object },
        //data: { type: Object },
        implements: { type: String, attribute: true, reflect: true },
        //countData: { type: Object }
      }
    }
  
    static get styles() {
      return css`
        :host {
            display: block;
            clear: both;
        }
        
      `
    }
  
    constructor() {
      super();
      this.graphql = pubQuery;
      this.active = false;
      //this.implements = "vivo-search";
      this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
      this.handleCountResultsObtained = this.handleCountResultsObtained.bind(this);
      this.setUp();
    }
  
    firstUpdated() {
      document.addEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      document.addEventListener('countResultsObtained', this.handleCountResultsObtained);
    }
  
    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener('searchResultsObtained', this.handleSearchResultsObtained);
      document.addEventListener('countResultsObtained', this.handleCountResultsObtained);
    }
  
    handleSearchResultsObtained(e) {
      // FIXME: shouldn't need to add code to do this check
      let data = e.detail;
      if (!data || !data.documents) {
          return;
      }
      this.data = data;
    }
  
    handleCountResultsObtained(e) {
      this.countData = e.detail;
      var docCount = this.countData ? this.countData.pubCount.page.totalElements : 0;
      let tab = document.querySelector('#publication-search-tab');
      tab.textContent = `Publications (${docCount})`;
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
      var resultsDisplay = html`<div>
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
  
      return html`
        <div>
        ${resultsDisplay}
        ${pagination}
        </div>`
    }
  
  }
  
  customElements.define('vivo-publication-search', PublicationSearch);
  