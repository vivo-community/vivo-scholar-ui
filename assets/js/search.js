import { Router } from '@vaadin/router';
import { LitElement, html, css } from "lit-element";
import qs from "qs";
import _ from "lodash";

const search = document.getElementById('search');
const router = new Router(search, {baseUrl: '/search/'});

import peopleQuery from "./people/query";
import client from "./lib/apollo";

router.setRoutes([
    { path: '', component: 'vivo-search' },
    { path: 'people', component: 'vivo-search' }//,
    //{path: '/entities/person/:id+', redirect: '/entities/person/:id+'},
]);

function stringifyQuery(params) {
    let result = qs.stringify(params);
    return result ? "?" + result : "";
}

function parseQuery(qryString) {
    return qs.parse(qryString);
}

// make a PeopleSearch, PublicationSearch etc... (each tab)
class Search extends LitElement {

    static get properties() {
        return {
            query: { type: String },
            location: { type: Object },
            data: { type: Object }
        }
    }

    constructor() {
        super();
        const parsed = parseQuery(location.search.substring(1));
        const defaultSearch = parsed.search ? parsed.search : "*";
        this.query = defaultSearch;

        this.runSearch()
    }

    onAfterEnter(location, commands, router) {
        const parsed = parseQuery(location.search.substring(1));
        const defaultSearch = parsed.search ? parsed.search : "*";
        this.query = defaultSearch;
    }


    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('searchSubmitted', this.doSearch);
        this.addEventListener('vaadin-router-location-changed', this.locationChanged);
    }

    runSearch() {
        const fetchData = async () => {
            try {
                // supposed to be adding filters
                const { data } = await client.query({
                    query: peopleQuery,
                    variables: {
                        pageNumber: 0,
                        search: this.query,
                        filters: []
                    }
                });
                this.data = data;
                // then update component properties?
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }

    doSearch(e) {
        this.query = e.detail;
        const qry = stringifyQuery({ search: e.detail });
        // add it to the url
        Router.go(`/search/${qry}`);
        this.runSearch()
    }

    render() {
        var results = [];
        if (this.data && this.data.personsFacetedSearch.content) {
            let content = this.data.personsFacetedSearch.content;
            _.each(content, function (item) {
                results.push(item);
            });
        }
        var list = html`<ul>
            ${results.map(i => html`<li><a target="_blank" href="/entities/person/${i.id}">${i.name}</a></li>`)}
        </ul>`

        return html`
        <vivo-site-sub-header class="site-sub-header"></vivo-site-sub-header>

        <div id="main">
            <vivo-site-search-box id="sitewide-search" 
                class="site-search" 
                action="/search" label="search" 
                external-submit="true" 
                query="${this.query}">
            </vivo-site-search-box>

            <p>query:${this.query}</p>
        </div>
        ${list}
        `
    }
}

customElements.define('vivo-search', Search);
