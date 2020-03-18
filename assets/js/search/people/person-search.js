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
            implements: { type: String, attribute: true, reflect: true }
        }
    }

    static get styles() {
        return css`
        .people {
            display: block; 
            padding: 1em;
        }
        .person {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap; 
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
        vivo-person-card-image {
            flex-shrink: 1;
            flex-basis: 10%;
            padding: 0.2em;
        }
        vivo-person-card {
            flex-shrink: 3;
            flex-basis: 90%;
            padding: 0.2em;
        }
        :host {
            display: block;
        }
        
      `
    }

    constructor() {
        super();
        this.graphql = peopleQuery;
        this.active = false;
        this.waiting = false;
        // NOTE: all searches must set a default sort
        this.defaultSort = [{ property: "name", direction: "ASC" }];

        this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
        this.handleSearchStarted = this.handleSearchStarted.bind(this);

        this.sortOptions = [
            {label: 'Name (asc)', field: 'name', 'direction': "ASC"},
            {label: 'Name (desc)', field: 'name', 'direction': "DESC"}
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
        if (!data || !data.people) {
            return;
        }
        this.data = data;

        // might be a new count in here
        var docCount = this.data ? this.data.people.page.totalElements : 0;
        let tab = document.querySelector('#person-search-count');
        tab.textContent = `${docCount}`;
    }

    renderOverview(person) {
        if (person.overview) {
            return html`<vivo-truncated-text>${unsafeHTML(person.overview)}</vivo-truncated-text>`;
        }
    }

    renderPerson(person) {
        let title = person.preferredTitle || person.id;
        return html`<div class="person">
            <vivo-person-card-image thumbnail="${person.thumbnail}"></vivo-person-card-image>
            <vivo-person-card>
                <div slot="title">${title}</div>
                <a slot="name" href="/entities/person/${person.id}">
                  ${person.name}
                </a>
            </vivo-person-card>
        </div>
        `;
    }

    render() {
        if (this.active == true && this.waiting == true) {
            return html``
        }
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
        var resultsDisplay = html`<div class="people">
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

        // TODO: might be better if 'searcher.js' code took care of this
        let selected = `${this.orders[0].property}-${this.orders[0].direction}`;

        if (this.data) {
            sorter = html`<vivo-search-sorter
              selected=${selected}
              options=${JSON.stringify(this.sortOptions)}>
            </vivo-search-sorter>`
        }

        // TODO: add a filter-clearer
        let clearer = html`<vivo-filter-clearer>
        </vivo-filter-clearer>`

        return html`
          <div id="people-search-results">
          <div class="search-actions">
          ${clearer}
          ${sorter}
          </div>
          ${resultsDisplay}
          ${pagination}
          </div>`
    }

}

customElements.define('vivo-person-search', PersonSearch);
