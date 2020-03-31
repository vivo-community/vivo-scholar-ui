import { LitElement, html, css } from "lit-element";
import _ from 'lodash';

import grantQuery from "./grant-query";
import Searcher from '../searcher.js'
import './grant-card';

class GrantSearch extends Searcher(LitElement) {

    static get properties() {
        return {
            graphql: { type: Object },
            implements: { type: String, attribute: true, reflect: true }
        }
    }

    constructor() {
        super();
        this.graphql = grantQuery;
        this.active = false;
        this.waiting = false;
        // NOTE: all searches must set a default sort
        this.defaultSort = [{ property: "title", direction: "ASC" }];
        this.defaultBoosts = [{ field: "title", value: 2 }];

        this.defaultFilters = [{ field: "type", value: "Grant" }];

        this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
        this.handleSearchStarted = this.handleSearchStarted.bind(this);

        this.sortOptions = [
            { label: 'Relevance', field: 'score', direction: "ASC" },
            { label: 'Title (Ascending)', field: 'title', 'direction': "ASC" },
            { label: 'Title (Descending)', field: 'title', 'direction': "DESC" }
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
        if (!data || !data.relationships) {
            return;
        }
        this.data = data;

        // might be a new count in here
        var docCount = this.data ? this.data.relationships.page.totalElements : 0;
        // FIXME: this part is a little fragile, have to make sure
        // the page has a certain element with a certain id
        let tab = document.querySelector('#grant-search-count');
        tab.textContent = `${docCount}`;
    }

    // TODO: is this same thing as 'Funding Source'?
    renderContributors(grant) {
        if (grant.contributors) {
            var s = _.map(grant.contributors, 'label').join(',');
            return html`
            <div slot="contributors"><b>Contributors:</b> ${s}</div>
            `
        }
    }

    // TODO: is this same thing as 'Funding Source'?
    renderAwardedBy(grant) {
        if (grant.awardedBy) {
            // NOTE: array
            var s = _.map(grant.awardedBy, 'label').join(',');
            return html`
            <div slot="awardedBy"><b>Funding Source:</b> ${s}</div>
            `
        }
    }

    renderDateInterval(grant) {
        if (!grant.dateTimeIntervalStart || !grant.dateTimeIntervalEnd) {
            return html``
        }
        // NOTE: just showing years
        let start = new Date(grant.dateTimeIntervalStart).getFullYear();
        let end = new Date(grant.dateTimeIntervalEnd).getFullYear();
        return html`
          <div slot="date">
            <b>Date:</b>
            <vivo-interval class="grant-date" 
              interval-start="${start}"
              interval-end="${end}">
            </vivo-interval>
          </div>
        `
    }


    renderGrant(grant) {
        let url = `/entities/grant/${grant.id}`;
        return html`
        <vivo-grant-card>
          <a slot="title" href="${url}">
          ${grant.title}
          </a>
          ${this.renderContributors(grant)}
          ${this.renderDateInterval(grant)}
          ${this.renderAwardedBy(grant)}
        </vivo-grant-card>
        `;
    }

    static get styles() {
        return css`
        .search-actions {
            display: flex;
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
        :host {
            display: block;
        }
        .title {
            font-size: 1.2em;
        }
        vivo-interval {
            color: #000000;
            color: var(--primaryColor);
          }
        #grant-search-results {
            padding: 1em;
        }
      `
    }

    render() {
        if (this.active == true && this.waiting == true) {
            return html``
        }
        if (!this.active == true || !this.data || !this.data.relationships) {
            return html``
        }
        var results = [];

        if (this.data && this.data.relationships.content) {
            let content = this.data.relationships.content;
            _.each(content, function (item) {
                results.push(item);
            });
        }


        let _self = this;
        var resultsDisplay = html`<div class="grants">
          ${_.map(results, function (i) {
            return _self.renderGrant(i);
        })
            }
        </div>`;

        let pagination = html``;
        if (this.data) {
            pagination = html`<vivo-search-pagination 
              number="${this.data.relationships.page.number}"
              size="${this.data.relationships.page.size}"
              totalElements="${this.data.relationships.page.totalElements}"
              totalPages="${this.data.relationships.page.totalPages}"
          />`
        }

        let pagingSummary = html``;

        if (this.data) {
            pagingSummary = html`<vivo-search-pagination-summary
            number="${this.data.relationships.page.number}"
            size="${this.data.relationships.page.size}"
            totalElements="${this.data.relationships.page.totalElements}"
            totalPages="${this.data.relationships.page.totalPages}"
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
          <div id="grant-search-results">
            <div class="search-actions">
            ${pagingSummary}
            ${sorter}
            </div>
            ${resultsDisplay}
            ${pagination}
          </div>`
    }

}

customElements.define('vivo-grant-search', GrantSearch);
