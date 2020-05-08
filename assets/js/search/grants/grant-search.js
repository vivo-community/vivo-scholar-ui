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
        this.defaultBoosts = [{ field: "title", value: 2 }];

        this.defaultFilters = [{ field: "type", value: "Grant" }];

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

    renderContributors(grant, label) {
        if (grant.contributors) {
            var s = _.map(grant.contributors, 'label').join(',');
            return html`
            <div slot="contributors">
                <b>${label}:</b> ${s}
            </div>
            `
        }
    }

    renderAwardedBy(grant, label) {
        if (grant.awardedBy) {
            // NOTE: array
            var s = _.map(grant.awardedBy, 'label').join(',');
            return html`
            <div slot="awardedBy">
              <b>${label}:</b> ${s}
            </div>
            `
        }
    }

    renderDateInterval(grant, label) {
        if (!grant.dateTimeIntervalStart || !grant.dateTimeIntervalEnd) {
            return html``
        }
        // NOTE: just showing years
        let start = new Date(grant.dateTimeIntervalStart).getFullYear();
        let end = new Date(grant.dateTimeIntervalEnd).getFullYear();
        return html`
          <div slot="date">
            <b>${label}:</b>
            <vivo-interval class="grant-date" 
              interval-start="${start}"
              interval-end="${end}">
            </vivo-interval>
          </div>
        `
    }

    // FIXME: i18n how to get labels in here?
    renderGrant(grant) {
        let url = `/entities/grant/${grant.id}`;
        return html`
        <vivo-grant-card>
          <a slot="title" href="${url}">
          ${grant.title}
          </a>
          ${this.renderContributors(grant, "Contributors")}
          ${this.renderDateInterval(grant, "Date")}
          ${this.renderAwardedBy(grant, "Funding Source")}
        </vivo-grant-card>
        `;
    }

    static get styles() {
        return css`
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
        .grants {
            padding: 1em;
        }
      `
    }

    setPagination() {
        // set all properties
        let props = {
          number: this.data.relationships.page.number,
          size: this.data.relationships.page.size,
          totalElements: this.data.relationships.page.totalElements,
          totalPages: this.data.relationships.page.totalPages
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
        if (!this.active == true || !this.data || !this.data.relationships) {
            return html``
        }
        var results = [];

        if (this.data && this.data.relationships.content) {
            let content = this.data.relationships.content;
            content.forEach((item) => {
                results.push(item);
            });
        }

        var resultsDisplay = html`
        <div class="grants">
          ${results.map((i) => {
              return this.renderGrant(i);
            })
          }
        </div>`;

        this.setPagination();
        /*
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
        */

        return html`
          <div id="grant-search-results">
            <div class="search-actions">
              <slot name="pagination-summary"></slot>
              <slot name="sorter"></slot>
            </div>
            ${resultsDisplay}
            <slot name="pagination"></slot>
          </div>`
    }

}

customElements.define('vivo-grant-search', GrantSearch);
