import { LitElement, html, css } from "lit-element";

import grantQuery from "./grant-query";
import Searcher from '../searcher.js'

class GrantSearch extends Searcher(LitElement) {

    static get properties() {
        return {
            graphql: { type: Object },
            implements: { type: String, attribute: true, reflect: true }
        }
    }

    static get styles() {
        return css`
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
        :host {
            display: block;
        }
        
      `
    }

    constructor() {
        super();
        this.graphql = grantQuery;
        this.active = false;
        this.waiting = false;
        // NOTE: all searches must set a default sort
        this.defaultSort = [{ property: "title", direction: "ASC" }];
        this.defaultBoosts = [{ field: "title", value: 2 }];

        this.defaultFilters = [{field: "type", value: "Grant"}];

        this.handleSearchResultsObtained = this.handleSearchResultsObtained.bind(this);
        this.handleSearchStarted = this.handleSearchStarted.bind(this);

        this.sortOptions = [
            {label: 'Relevance', field: 'score', direction: "ASC"},
            {label: 'Title (asc)', field: 'title', 'direction': "ASC"},
            {label: 'Title (desc)', field: 'title', 'direction': "DESC"}
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


    /*
      <vivo-grant url="/entities/grant/<%= p["id"] %>" start-date="<%= p["startDate"] %>" 
          title="<%= p["label"] %>">
        <a slot="label" href="/entities/grant/<%= p["id"] %>">
          <%= p["label"] %>
        </a>
        <%= if (p["awardedBy"]) { %>
           <span slot="awardedBy">  awarded by  <%=p["awardedBy"]["label"] %></span>
        <% } %>
        <span slot="date">
          <vivo-interval interval-start="<%= FormatISODate(p["startDate"], "year") %>" 
            interval-end="<%= FormatISODate(p["endDate"], "year") %>">
          </vivo-interval>
        </span>
      </vivo-grant>
    */
    renderAwardedBy(grant) {
        if (grant.awardedBy) {
            return html`
            <span slot="awardedBy"> awarded by ${grant.awardedBy.label}</span>
            `
        }
    }

    renderGrant(grant) {
        let url = `/entities/grant/${grant.id}`;
        return html`
        <vivo-grant url="${url}" start-date="${grant.dateTimeIntervalStart}" title="${grant.title}">
            <div>${grant.title}</div>
            <a slot="label" href="${url}">
              ${grant.title}
            </a>
            ${this.renderAwardedBy} 
            <span slot="date">
              <vivo-interval interval-start="${grant.dateTimeIntervalStart}" 
                interval-end="${grant.dateTimeIntervalEnd}">
              </vivo-interval>
            </span>
        </vivo-grant>
        `;
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
          <div id="grant-search-results">
          <div class="search-actions">
          ${clearer}
          ${sorter}
          </div>
          ${resultsDisplay}
          ${pagination}
          </div>`
    }

}

customElements.define('vivo-grant-search', GrantSearch);
