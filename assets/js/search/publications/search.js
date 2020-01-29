import { LitElement, html, css } from "lit-element";

import peopleQuery from "./query";

class PublicationSearch extends LitElement {

    // NOTE: this 'query' is the graphql statement
    // not crazy about JSON.stringify below
    static get properties() {
      return {
        query: { type: Object },
        data: { type: Object },
        countData: { type: Object }
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
      this.query = peopleQuery;
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
      // NOTE: alias of 'peopleCount' doesn't seem to work
      var docCount = this.countData ? this.countData.documents.page.totalElements : 0;
      let tab = document.querySelector('#publication-search-tab');
      tab.textContent = `Publications (${docCount})`;
    }
  
    // need this so we can pass through
    search() {
      let search = this.shadowRoot.querySelector('vivo-search');
      search.search();
    }
  
    // TODO: not sure it's good to have to remember to call search AND counts
    counts() {
      let search = this.shadowRoot.querySelector('vivo-search');
      search.counts();
    }
  
    setPage(num) {
      let search = this.shadowRoot.querySelector('vivo-search');
      search.setPage(num);
    }
  
    render() {
      var results = [];
      if (!this.data || !this.data.documents) {
          return;
      }
      
      if (this.data && this.data.documents.content) {
        let content = this.data.documents.content;
        _.each(content, function (item) {
          results.push(item);
        });
      }
  
  
      let pagination = html``;

      if (this.data) {
        pagination = html`<vivo-search-pagination 
              number="${this.data.people.page.number}"
              size="${this.data.people.page.size}"
              totalElements="${this.data.people.page.totalElements}"
              totalPages="${this.data.people.page.totalPages}"
          />`
      }
  
      return html`
         <vivo-search graphql=${JSON.stringify(this.query)}>
         ${pagination}
         </vivo-search>`
    }
  
  }
  
  customElements.define('vivo-publication-search', PublicationSearch);
  