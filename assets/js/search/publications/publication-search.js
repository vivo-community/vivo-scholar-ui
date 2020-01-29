import { LitElement, html, css } from "lit-element";

import pubQuery from "./publication-query";

class PublicationSearch extends LitElement {

    // NOTE: this 'query' is the graphql statement
    // not crazy about JSON.stringify below
    static get properties() {
      return {
        query: { type: Object },
        data: { type: Object },
        countData: { type: Object },
        active: { type: Boolean }
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
      this.query = pubQuery;
      this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
      this.handleCountResultsObtained = this.handleCountResultsObtained.bind(this);
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
      this.data = e.detail;
    }
  
    handleCountResultsObtained(e) {
      this.countData = e.detail;
      var docCount = this.countData ? this.countData.pubCount.page.totalElements : 0;
      let tab = document.querySelector('#publication-search-tab');
      tab.textContent = `Publications (${docCount})`;
    }
  
    // need this so we can pass through
    search() {
      let search = this.shadowRoot.querySelector('vivo-search');
      if (!search) {
          console.error(`search not found: ${search}`);
          return
      }
      search.search();
    }
  
    counts() {
      let search = this.shadowRoot.querySelector('vivo-search');
      // shouldn't be null
      if (!search) {
        console.error(`search not found: ${search}`);
        return
      }
      search.counts();
    }
  
    setPage(num) {
      let search = this.shadowRoot.querySelector('vivo-search');
      search.setPage(num);
    }

    setActive(b) {
        let search = this.shadowRoot.querySelector('vivo-search');
        search.setActive(b);
        this.active = b;
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

    renderAuthors(authors) {
      if (authors) {
        return html`<vivo-publication-author-list slot="authors">
          ${authors.map((a) => this.authorTemplate(a))}
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
      // FIXME: always returning this makes people tab work(ish)
      // but then publication search results never show
      // remove this and publications show, but not people
      if (!this.active || !this.data || !this.data.documents) {
        return html`<vivo-search graphql=${JSON.stringify(this.query)} />`
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
         <vivo-search graphql=${JSON.stringify(this.query)}>
         ${resultsDisplay}
         ${pagination}
         </vivo-search>`
    }
  
  }
  
  customElements.define('vivo-publication-search', PublicationSearch);
  