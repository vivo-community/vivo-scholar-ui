import { LitElement, html, css } from "lit-element";

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
            padding-top: 5px;
        }
        vivo-search-pagination-summary {
            flex-grow: 2;
            flex-basis: 65%;
        }
        /* TODO: these same values set in each search */
        vivo-search-sorter {
            flex-grow: 1;
            flex-basis:35%;
            text-align: right;
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
            --lh: 1.2rem;
            line-height: var(--lh);  
        }
        #overview {
            width: 75%;
        }
        /* https://css-tricks.com/line-clampin/ */
        .truncate-overflow {
            --max-lines: 2;
            position: relative;
            max-height: calc(var(--lh) * var(--max-lines));
            overflow: hidden;
            padding-right: 1rem; /* space for ellipsis */
          }
          .truncate-overflow::before {
            position: absolute;
            // FIXME: this overlaps text in chrome */
            /* content: "..."; */
            inset-block-end: 0; /* "bottom" */
            inset-inline-end: 0; /* "right" */
          }
          .truncate-overflow::after {
            content: "";
            position: absolute;
            inset-inline-end: 0; /* "right" */
            width: 1rem;
            height: 1rem;
            background: white;
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
        this.defaultBoosts = [{ field: "name", value: 2 }];

        this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
        this.handleSearchStarted = this.handleSearchStarted.bind(this);

        this.sortOptions = [
            {label: 'Relevance', field: 'score', direction: "ASC"},
            {label: 'Last Name (Ascending)', field: 'name', 'direction': "ASC"},
            {label: 'Last Name (Descending)', field: 'name', 'direction': "DESC"}
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

    //https://stackoverflow.com/questions/822452/strip-html-from-text-javascript/47140708#47140708
    strip(html){
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    renderOverview(person) {
        if (person.overview) {
            return html`<div class="truncate-overflow">${this.strip(person.overview)}</div>`;
        }
    }

    renderPerson(person) {
        let title = person.preferredTitle || '';
        return html`<div class="person">
            <vivo-person-card-image thumbnail="${person.thumbnail}"></vivo-person-card-image>
            <vivo-person-card>
                <div slot="title">${title}</div>
                <a slot="name" href="/entities/person/${person.id}">
                  ${person.name}
                </a>
                <div id="overview">
                ${this.renderOverview(person)}
                </div>
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

        let pagingSummary = html``;

        if (this.data) {
          pagingSummary = html`<vivo-search-pagination-summary
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

        return html`
          <div id="people-search-results">
          <div class="search-actions">
          ${pagingSummary}
          ${sorter}
          </div>
          ${resultsDisplay}
          ${pagination}
          </div>`
    }

}

customElements.define('vivo-person-search', PersonSearch);
