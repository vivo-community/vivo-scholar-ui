import { LitElement, html, css } from "lit-element";
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import peopleQuery from "./person-query";
import './person-card';
import './person-image';
import Searcher from '../searcher.js'

class PersonSearch extends Searcher(LitElement) {

    static get properties() {
        return {
            graphql: { type: Object },
            implements: { type: String, attribute: true, reflect: true },
        }
    }

    static get styles() {
        return css`
        vivo-person-card-image {
            float:left;
            width: 10%;
        }
        vivo-person-card {
            float: left;
            width: 90%;
        }
        :host {
            display: block;
            clear: both;
        }
        
      `
    }

    constructor() {
        super();
        this.graphql = peopleQuery;
        this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
        this.handleCountResultsObtained = this.handleCountResultsObtained.bind(this);
        this.setUp();

        this.sortOptions = [
            {label: 'Name (asc)', field: 'name', 'direction': "asc"},
            {label: 'Name (desc)', field: 'name', 'direction': "desc"}
        ];
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
        let data = e.detail;
        if (!data || !data.people) {
            return;
        }
        this.data = data;

        // might be a new count in here
        var docCount = this.data ? this.data.people.page.totalElements : 0;
        let tab = document.querySelector('#person-search-count');
        tab.textContent = `${docCount}`;
    }

    handleCountResultsObtained(e) {
        // TODO: could probably have an associated <count> element
        // and just update that (could be tab heading or could not)
        this.countData = e.detail;
        var personCount = this.countData ? this.countData.peopleCount.page.totalElements : 0;
        let tab = document.querySelector('#person-search-count');
        tab.textContent = `${personCount}`;
    }

    renderOverview(person) {
        if (person.overview) {
            return html`<vivo-truncated-text>${unsafeHTML(person.overview)}</vivo-truncated-text>`;
        }
    }

    renderPerson(person) {
        let title = person.preferredTitle || person.id;
        return html`
            <vivo-person-card-image thumbnail="${person.thumbnail}"></vivo-person-card-image>
            <vivo-person-card>
                <div slot="title">${title}</div>
                <a slot="name" href="/entities/person/${person.id}">
                  ${person.name}
                </a>
              ${this.renderOverview(person)}
            </vivo-person-card>
        `;
    }

    render() {
        if (!this.active == true || !this.data || !this.data.people) {
            return html``
        }
        var results = [];

        if (this.data && this.data.people.content) {
            let content = this.data.people.content;
            _.each(content, function (item) {
                results.push(item);
            });
        }


        let _self = this;
        var resultsDisplay = html`<div>
          ${_.map(results, function (i) {
            return _self.renderPerson(i);
        })
            }
        </div>`;

        let pagination = html``;

        if (this.data) {
            pagination = html`<vivo-search-pagination 
              number="${this.data.people.page.number}"
              size="${this.data.people.page.size}"
              totalElements="${this.data.people.page.totalElements}"
              totalPages="${this.data.people.page.totalPages}"
          />`
        }

        let sorter = html``;
        if (this.data) {
            // make sorter
            sorter = html`<vivo-search-sorter
              options=${JSON.stringify(this.sortOptions)}>
            </vivo-search-sorter>`
        }

        return html`
          <div>
          ${sorter}
          ${resultsDisplay}
          ${pagination}
          </div>`
    }

}

customElements.define('vivo-person-search', PersonSearch);
